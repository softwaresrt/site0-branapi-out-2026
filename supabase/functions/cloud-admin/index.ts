// ADMIN BRANAPI: cria acessos de cliente e atribui servidores.
// Só responde para usuários que estão em public.cloud_admins.
import { corsHeaders, fail, getCaller, isAdmin, json, serviceClient, UUID_RE } from "../_shared/common.ts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STATUS = ["active", "suspended", "expired", "provisioning"];
const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const intIn = (v: unknown, min: number, max: number, d: number) => {
  const n = Math.round(Number(v)); return isFinite(n) && n >= min && n <= max ? n : d;
};

function serverFields(b: any, partial = false) {
  const f: Record<string, unknown> = {};
  const set = (k: string, v: unknown) => { if (!partial || b[k] !== undefined) f[k] = v; };
  set("name", str(b.name, 120));
  set("plan_name", str(b.plan_name, 80) || "Cloud Start");
  set("region_label", str(b.region_label, 80) || "Brasil");
  set("os_label", str(b.os_label, 80) || "Ubuntu 24.04 LTS");
  set("vcpu", intIn(b.vcpu, 1, 256, 1));
  set("ram_gb", Math.min(2048, Math.max(0.5, Number(b.ram_gb) || 1)));
  set("disk_gb", intIn(b.disk_gb, 1, 100000, 25));
  set("traffic_gb", intIn(b.traffic_gb, 0, 1000000, 1000));
  set("public_address", str(b.public_address, 255) || null);
  set("notes", str(b.notes, 1000) || null);
  if (!partial || b.status !== undefined) f.status = STATUS.includes(b.status) ? b.status : "active";
  if (!partial || b.expires_at !== undefined) {
    const d = new Date(b.expires_at);
    if (isNaN(d.getTime())) throw new Error("Prazo (expires_at) inválido.");
    f.expires_at = d.toISOString();
  }
  if (b.starts_at) { const s = new Date(b.starts_at); if (!isNaN(s.getTime())) f.starts_at = s.toISOString(); }
  if (f.name === "") throw new Error("Informe o nome do servidor.");
  return f;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  if (req.method !== "POST") return fail(req, 405, "Método não permitido.");

  const caller = await getCaller(req);
  if (!caller) return fail(req, 401, "Sessão expirada.");
  if (!(await isAdmin(caller.id))) return fail(req, 403, "Acesso restrito à equipe Branapi.");

  let b: any;
  try { b = await req.json(); } catch { return fail(req, 400, "Requisição inválida."); }
  const db = serviceClient();
  const log = (server_id: string | null, user_id: string | null, action: string, detail?: string) =>
    db.from("cloud_events").insert({ server_id, user_id, actor: "admin", action, detail: detail ?? null });

  try {
    switch (b.action) {
      case "overview": {
        const [{ data: customers }, { data: servers }, { data: backends }] = await Promise.all([
          db.from("cloud_profiles").select("*").order("created_at", { ascending: false }),
          db.from("cloud_servers").select("*").order("expires_at", { ascending: true }),
          db.from("cloud_server_backend").select("server_id,provider_ref,internal_note"),
        ]);
        const map = new Map((backends ?? []).map((x) => [x.server_id, x]));
        return json(req, {
          ok: true,
          customers: customers ?? [],
          servers: (servers ?? []).map((s) => ({
            ...s, provider_ref: map.get(s.id)?.provider_ref ?? "", internal_note: map.get(s.id)?.internal_note ?? "",
          })),
        });
      }

      case "create_customer": {
        const email = str(b.email, 255).toLowerCase();
        const password = String(b.password ?? "");
        if (!EMAIL_RE.test(email)) return fail(req, 400, "E-mail inválido.");
        if (password.length < 10) return fail(req, 400, "A senha precisa ter pelo menos 10 caracteres.");
        const { data, error } = await db.auth.admin.createUser({
          email, password, email_confirm: true,
          user_metadata: { full_name: str(b.full_name, 160), phone: str(b.phone, 40), company: str(b.company, 160) },
          app_metadata: { created_by: "branapi_admin" },
        });
        if (error) return fail(req, 400, /already|registered/i.test(error.message) ? "Este e-mail já tem cadastro." : "Não foi possível criar o acesso.");
        await log(null, data.user.id, "customer_created", email);
        return json(req, { ok: true, user_id: data.user.id });
      }

      case "reset_password": {
        if (!UUID_RE.test(b.user_id)) return fail(req, 400, "Cliente inválido.");
        const password = String(b.password ?? "");
        if (password.length < 10) return fail(req, 400, "A senha precisa ter pelo menos 10 caracteres.");
        const { error } = await db.auth.admin.updateUserById(b.user_id, { password });
        if (error) return fail(req, 400, "Não foi possível trocar a senha.");
        await log(null, b.user_id, "password_reset");
        return json(req, { ok: true });
      }

      case "delete_customer": {
        if (!UUID_RE.test(b.user_id)) return fail(req, 400, "Cliente inválido.");
        if (b.user_id === caller.id) return fail(req, 400, "Você não pode excluir o próprio acesso.");
        const { error } = await db.auth.admin.deleteUser(b.user_id);
        if (error) return fail(req, 400, "Não foi possível excluir o cliente.");
        return json(req, { ok: true });
      }

      case "create_server": {
        if (!UUID_RE.test(b.user_id)) return fail(req, 400, "Escolha o cliente.");
        const fields = serverFields(b);
        const { data: server, error } = await db.from("cloud_servers")
          .insert({ ...fields, user_id: b.user_id }).select().single();
        if (error) return fail(req, 400, "Não foi possível criar o servidor.");
        const ref = str(b.provider_ref, 255);
        if (ref) await db.from("cloud_server_backend").insert({ server_id: server.id, provider_ref: ref, internal_note: str(b.internal_note, 1000) || null });
        await log(server.id, b.user_id, "server_assigned", `${server.name} até ${server.expires_at}`);
        return json(req, { ok: true, server_id: server.id });
      }

      case "update_server": {
        if (!UUID_RE.test(b.id)) return fail(req, 400, "Servidor inválido.");
        const fields = serverFields(b, true);
        if (Object.keys(fields).length) {
          const { error } = await db.from("cloud_servers").update(fields).eq("id", b.id);
          if (error) return fail(req, 400, "Não foi possível salvar.");
        }
        if (b.provider_ref !== undefined || b.internal_note !== undefined) {
          const ref = str(b.provider_ref, 255);
          if (ref) {
            await db.from("cloud_server_backend").upsert({ server_id: b.id, provider_ref: ref, internal_note: str(b.internal_note, 1000) || null });
          } else if (b.provider_ref === "") {
            await db.from("cloud_server_backend").delete().eq("server_id", b.id);
          }
        }
        await log(b.id, null, "server_updated");
        return json(req, { ok: true });
      }

      case "renew_server": {
        if (!UUID_RE.test(b.id)) return fail(req, 400, "Servidor inválido.");
        const days = intIn(b.days, 1, 3650, 30);
        const { data: s } = await db.from("cloud_servers").select("expires_at").eq("id", b.id).single();
        if (!s) return fail(req, 404, "Servidor não encontrado.");
        const base = Math.max(Date.now(), new Date(s.expires_at).getTime());
        const next = new Date(base + days * 86_400_000).toISOString();
        await db.from("cloud_servers").update({ expires_at: next, status: "active" }).eq("id", b.id);
        await log(b.id, null, "server_renewed", `+${days} dias`);
        return json(req, { ok: true, expires_at: next });
      }

      case "delete_server": {
        if (!UUID_RE.test(b.id)) return fail(req, 400, "Servidor inválido.");
        await db.from("cloud_servers").delete().eq("id", b.id);
        return json(req, { ok: true });
      }

      default:
        return fail(req, 400, "Ação inválida.");
    }
  } catch (e) {
    return fail(req, 400, e instanceof Error ? e.message : "Erro inesperado.");
  }
});
