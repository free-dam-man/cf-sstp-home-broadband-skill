# 入口 IP 自动刷新 / Preferred Entry IP Auto-Refresh

## Why China shows all-Timeout

On China Mobile / Unicom / Telecom 5G, a subscription that suddenly shows **全部 Timeout** is usually **stale Cloudflare preferred entry IPs** baked into `buildSub` — **not** a dead SoftEther / VPNGate residential pool.

Raw custom-domain resolution (`*.workers.dev` / your SNI host → `104.21.x` / `172.67.x`) is often blocked or throttled. You need a rotating set of China-reachable CF edge `ip:port` pairs (443 / 2083 / 2053).

## What this package does

1. Worker keeps a live `preferred_entries` list in **Workers KV** (`ENTRIES_KV` binding, key `preferred_entries`).
2. `buildSub` rotates VLESS URIs across that list. **Subscription URL never changes.**
3. Soft cron inside the Worker (`scheduled`, typically `0 0 * * *` UTC = **08:00 Asia/Shanghai**) pulls a community preferred-IP top list when KV is older than ~20h.
4. Hard refresh (recommended): PUT China-verified PINNED IPs from your own probe (same idea as a cf-node daily PINNED list) via:

```text
PUT https://<YOUR_CUSTOM_DOMAIN>/entries-<YOUR_SUB_TOKEN>
Content-Type: application/json

{"entries":["104.17.122.29:443","172.66.44.98:2083","162.159.128.253:2053", ...], "note":"PINNED-YYYY-MM-DD"}
```

5. User only **pull-to-refresh** the same Shadowrocket / v2rayN subscription URL.

Helper script (placeholders via env):

```bash
export SSTP_HOST="<YOUR_CUSTOM_DOMAIN>"
export SSTP_SUB_TOKEN="<YOUR_SUB_TOKEN>"
python3 scripts/refresh_sstp_entries.py path/to/PINNED.txt
```

## wrangler / dashboard setup

- Bind a KV namespace to the Worker as `ENTRIES_KV`.
- Enable a cron trigger, e.g. `0 0 * * *` (UTC) ≈ 08:00 Asia/Shanghai.
- Optional: run an agent / cron job after your China preferred-IP probe writes a PINNED file, calling `refresh_sstp_entries.py`.

## Verify

```bash
curl -s "https://<YOUR_CUSTOM_DOMAIN>/json-<YOUR_SUB_TOKEN>" | jq '{countries,count,entries,entriesMeta}'
```

`entriesMeta.source` should be `kv` after a successful PUT. Spot-check 1–2 nodes with a real local VLESS client (`xray` SOCKS → `generate_204`), never from Worker logs alone.

## Honest limits

Entry-IP refresh fixes **China 5G all-Timeout caused by stale CF edges**. It does **not** make volunteer SoftEther exits as stable as a VPS Mihomo hot-standby. See [`STABILITY.md`](STABILITY.md).
