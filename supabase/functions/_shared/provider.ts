// ADAPTADOR DO FORNECEDOR DE VPS
// ---------------------------------------------------------------------------
// Tudo que fala com a VPS por trás fica SÓ neste arquivo. O cliente nunca recebe
// a resposta crua do fornecedor, nem nome, nem erro dele: a gente normaliza tudo
// para o formato "Branapi Cloud" abaixo.
//
// Configure em Supabase > Edge Functions > Secrets:
//   PROVIDER_API_URL    ex: https://api.seu-fornecedor.com/v1
//   PROVIDER_API_TOKEN  token da API do fornecedor
//   CLOUD_DEMO_METRICS  "true" só para testar a tela sem fornecedor ligado
//
// Cada fornecedor tem rotas diferentes. Ajuste SÓ as 3 funções marcadas
// "AJUSTE AQUI" (rota e nomes de campos) quando souber qual API vai usar.

export type Sample = { t: number; cpu: number; ram: number; net_in: number; net_out: number };

export type Metrics = {
  power: "running" | "stopped" | "unknown";
  uptime_s: number | null;
  cpu_pct: number | null;
  ram_used_mb: number | null;
  ram_total_mb: number | null;
  disk_used_gb: number | null;
  disk_total_gb: number | null;
  traffic_used_gb: number | null;
  net_in_mbps: number | null;
  net_out_mbps: number | null;
  series: Sample[];
  demo?: boolean;
};

export class ProviderError extends Error {}

const BASE = (Deno.env.get("PROVIDER_API_URL") ?? "").replace(/\/+$/, "");
const TOKEN = Deno.env.get("PROVIDER_API_TOKEN") ?? "";
const DEMO = Deno.env.get("CLOUD_DEMO_METRICS") === "true";

export const providerConfigured = () => DEMO || (!!BASE && !!TOKEN);

async function call(path: string, init: RequestInit = {}) {
  if (!BASE || !TOKEN) throw new ProviderError("not_configured");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12_000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      signal: ctrl.signal,
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
    });
    if (!res.ok) throw new ProviderError(`upstream_${res.status}`);
    return await res.json();
  } catch (e) {
    if (e instanceof ProviderError) throw e;
    throw new ProviderError("upstream_unreachable");
  } finally {
    clearTimeout(timer);
  }
}

const num = (v: unknown): number | null => (typeof v === "number" && isFinite(v) ? v : null);
const clamp = (v: number | null, a: number, b: number) => (v === null ? null : Math.min(b, Math.max(a, v)));

function demoMetrics(ref: string): Metrics {
  const seed = [...ref].reduce((a, c) => a + c.charCodeAt(0), 0);
  const now = Date.now();
  const series: Sample[] = Array.from({ length: 48 }, (_, i) => {
    const t = now - (47 - i) * 30 * 60_000;
    const w = Math.sin((i + seed) / 5);
    return {
      t,
      cpu: Math.round(18 + 14 * w + ((i * 7 + seed) % 9)),
      ram: Math.round(46 + 8 * Math.cos((i + seed) / 8)),
      net_in: +(1.2 + 0.8 * Math.abs(w)).toFixed(2),
      net_out: +(0.6 + 0.5 * Math.abs(Math.cos(i / 4))).toFixed(2),
    };
  });
  const last = series[series.length - 1];
  return {
    power: "running", uptime_s: 86_400 * 12 + (seed % 5000), cpu_pct: last.cpu,
    ram_used_mb: Math.round(2048 * last.ram / 100), ram_total_mb: 2048,
    disk_used_gb: 9.4, disk_total_gb: 25, traffic_used_gb: 41.7,
    net_in_mbps: last.net_in, net_out_mbps: last.net_out, series, demo: true,
  };
}

/** AJUSTE AQUI: rota e nomes dos campos do fornecedor. */
export async function getMetrics(ref: string): Promise<Metrics> {
  if (DEMO && (!BASE || !TOKEN)) return demoMetrics(ref);
  const raw = await call(`/instances/${encodeURIComponent(ref)}/metrics?range=24h`);

  const series: Sample[] = (Array.isArray(raw.series) ? raw.series : []).slice(-288).map((p: any) => ({
    t: Number(p.t ?? p.timestamp ?? 0) * (Number(p.t ?? p.timestamp) < 1e12 ? 1000 : 1),
    cpu: clamp(num(p.cpu ?? p.cpu_pct), 0, 100) ?? 0,
    ram: clamp(num(p.ram ?? p.mem_pct), 0, 100) ?? 0,
    net_in: Math.max(0, num(p.net_in) ?? 0),
    net_out: Math.max(0, num(p.net_out) ?? 0),
  }));

  const state = String(raw.status ?? raw.state ?? "").toLowerCase();
  return {
    power: ["running", "active", "on"].includes(state) ? "running"
      : ["stopped", "off", "shutoff"].includes(state) ? "stopped" : "unknown",
    uptime_s: num(raw.uptime_s ?? raw.uptime),
    cpu_pct: clamp(num(raw.cpu_pct ?? raw.cpu), 0, 100),
    ram_used_mb: num(raw.ram_used_mb ?? raw.mem_used_mb),
    ram_total_mb: num(raw.ram_total_mb ?? raw.mem_total_mb),
    disk_used_gb: num(raw.disk_used_gb),
    disk_total_gb: num(raw.disk_total_gb),
    traffic_used_gb: num(raw.traffic_used_gb ?? raw.bandwidth_used_gb),
    net_in_mbps: num(raw.net_in_mbps),
    net_out_mbps: num(raw.net_out_mbps),
    series,
  };
}

/** AJUSTE AQUI: rota de ação de energia do fornecedor. */
export async function powerAction(ref: string, action: "start" | "stop" | "reboot"): Promise<void> {
  if (DEMO && (!BASE || !TOKEN)) return;
  await call(`/instances/${encodeURIComponent(ref)}/actions`, {
    method: "POST",
    body: JSON.stringify({ type: action }),
  });
}
