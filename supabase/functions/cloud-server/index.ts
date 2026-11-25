// CLIENTE: métricas e energia do próprio servidor.
// POST { action: "metrics" | "power", server_id, power?: "start"|"stop"|"reboot" }
import { corsHeaders, fail, getCaller, json, serviceClient, userClient, UUID_RE } from "../_shared/common.ts";
import { getMetrics, powerAction, providerConfigured, ProviderError } from "../_shared/provider.ts";

const POWER_COOLDOWN_MS = 30_000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  if (req.method !== "POST") return fail(req, 405, "Método não permitido.");

  const user = await getCaller(req);
  if (!user) return fail(req, 401, "Sessão expirada. Entre novamente.");

  let body: any;
  try { body = await req.json(); } catch { return fail(req, 400, "Requisição inválida."); }
  const serverId = String(body.server_id ?? "");
  if (!UUID_RE.test(serverId)) return fail(req, 400, "Servidor inválido.");

  // Quem decide se o servidor é do usuário é a RLS (cliente le proprios servidores).
  const { data: server } = await userClient(req)
    .from("cloud_servers").select("id,user_id,status,expires_at").eq("id", serverId).maybeSingle();
  if (!server || server.user_id !== user.id) return fail(req, 404, "Servidor não encontrado.");

  const admin = serviceClient();
  const { data: backend } = await admin
    .from("cloud_server_backend").select("provider_ref").eq("server_id", serverId).maybeSingle();

  const expired = new Date(server.expires_at).getTime() < Date.now() || server.status === "expired";

  if (body.action === "metrics") {
    if (!backend || !providerConfigured()) return json(req, { ok: true, available: false, reason: "pending" });
    if (server.status === "provisioning") return json(req, { ok: true, available: false, reason: "provisioning" });
    try {
      const m = await getMetrics(backend.provider_ref);
      return json(req, { ok: true, available: true, metrics: m });
    } catch (e) {
      console.error("provider metrics", e instanceof ProviderError ? e.message : e);
      return json(req, { ok: true, available: false, reason: "unreachable" });
    }
  }

  if (body.action === "power") {
    const power = String(body.power ?? "");
    if (!["start", "stop", "reboot"].includes(power)) return fail(req, 400, "Ação inválida.");
    if (server.status !== "active" || expired) return fail(req, 403, "Este servidor não está ativo. Renove o plano para usar este comando.");
    if (!backend || !providerConfigured()) return fail(req, 503, "Comandos indisponíveis no momento.");

    const since = new Date(Date.now() - POWER_COOLDOWN_MS).toISOString();
    const { count } = await admin.from("cloud_events").select("id", { count: "exact", head: true })
      .eq("server_id", serverId).eq("actor", "client").like("action", "power_%").gte("created_at", since);
    if ((count ?? 0) > 0) return fail(req, 429, "Aguarde alguns segundos antes de enviar outro comando.");

    try {
      await powerAction(backend.provider_ref, power as "start" | "stop" | "reboot");
    } catch (e) {
      console.error("provider power", e instanceof ProviderError ? e.message : e);
      return fail(req, 502, "Não foi possível executar o comando agora. Tente de novo em instantes.");
    }
    await admin.from("cloud_events").insert({ server_id: serverId, user_id: user.id, actor: "client", action: `power_${power}` });
    return json(req, { ok: true });
  }

  return fail(req, 400, "Ação inválida.");
});
