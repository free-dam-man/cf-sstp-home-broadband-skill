# CF Worker 免VPS · 22国真家宽 (MS-SSTP)

> Cloudflare Worker · zero VPS · pure-JS MS-SSTP → SoftEther/VPNGate residential broadband (`真家宽`) across **22 countries** (28 example volunteer nodes in `worker/worker_stealth_sub.js`).

**English:** Deploy one Cloudflare Worker that accepts `VLESS + WebSocket + TLS` and exits through multi-country native residential fiber via an in-Worker MS-SSTP + PPP + IPv4 + TCP stack — **no VPS required**.

---

## ⚠️ Stability / 稳定性（必读）

**This path is LESS stable than the VPS Mihomo hot-standby residential skill.**

Sibling (more reliable / 更稳):  
**https://github.com/free-dam-man/homeline-residential-exit-skill**

Honest caveats:

| Reality | What it means |
|---|---|
| Volunteer SoftEther / VPNGate home routers | Nodes go **offline** without notice |
| Country / ISP labels | Can be **wrong or stale** |
| Cloudflare Worker | **Cold starts**, edge **1101**, **China 5G timeouts** can bite |
| Concurrent Shadowrocket tests | Many nodes at once often **fail over / time out** |
| Stale CF preferred entry IPs | China often shows **all-Timeout** until entries are refreshed (see below) |

**适合零成本尝鲜 / 没有 VPS 时的备选。**  
**要稳定请用家宽 VPS 那套 Mihomo 热备**（上面的 sibling 仓库）。  
Do **not** mistake this for production-grade always-on. See also [`STABILITY.md`](STABILITY.md).

---

## 入口 IP 自动刷新 / Entry IP auto-refresh（新）

China 5G **全部 Timeout** is usually **stale Cloudflare preferred entry IPs**, not a dead SSTP pool.

This Worker stores preferred `ip:port` pairs in **KV**, rotates them in `buildSub`, and can soft-refresh on a daily cron (**~08:00 Asia/Shanghai**). Hard-refresh from a China-verified PINNED list: **prefer `PINNED.after.txt` (post China-probe) over `PINNED.txt`**. **The subscription URL never changes** — clients only pull-to-refresh. Each deployer's Worker cron + KV is independent.

Full write-up: [`AUTO_REFRESH.md`](AUTO_REFRESH.md) · helper: `scripts/refresh_sstp_entries.py`

---

## What it is / 这是什么

One-liner architecture:

```text
Shadowrocket / v2rayN / Clash Meta / Xray
   │  VLESS + WS + TLS  (China-5G preferred CF entry IP:port)
   ▼
Cloudflare Worker  (worker_stealth_sub.js / worker_158_pure_js.js)
   ├─ DoH (1.1.1.1) + user-space TCP/IPv4
   ├─ PPP (LCP + PAP + IPCP)
   ├─ preferred_entries in Workers KV (+ optional cron soft-refresh)
   └─ MS-SSTP over TLS  (cloudflare:sockets)
   ▼
SoftEther / VPNGate residential volunteers  (vpn*.opengw.net)
   → exit IP ≈ home broadband  (isResidential: true, low fraudScore when the node is healthy)
```

Bundled example CFG covers **22 countries / 28 nodes**, including JP SoftBank/KDDI, KR KT/SKB/LGU+, US Charter/Comcast/Verizon, HK HKT, AU Telstra, VN FPT/VNPT, plus CA / UK / DE / FR / NL / BE / NO / IT / MX / RU / UA / LT / CO / HU / AE / TH (volunteer pool — availability varies day to day).

Unlike a normal CF Worker proxy (exit = Cloudflare `AS13335` datacenter), healthy SSTP exits can show `isResidential: true` on checkers such as `my.ippure.com`.

---

## Quick start（占位符 only）

1. Copy `worker/worker_stealth_sub.js` (recommended) or the minimal `worker/worker_158_pure_js.js`.
2. Replace placeholders at the top of the stealth Worker:
   - `ID = '<YOUR_UUID>'`
   - `SUB_TOKEN = '<YOUR_SUB_TOKEN>'`
   - `HOST_DOMAIN = '<YOUR_CUSTOM_DOMAIN>'`
3. Deploy to Cloudflare Workers (see `SKILL.md` for anti-`1101` upload rules: `rawBody: true`, Base64 protocol literals).
4. Bind a custom domain → `<YOUR_CUSTOM_DOMAIN>`.
5. Bind Workers KV as `ENTRIES_KV`, enable cron `0 0 * * *` (UTC ≈ 08:00 Asia/Shanghai). See [`AUTO_REFRESH.md`](AUTO_REFRESH.md).
6. Open subscription (placeholders only):

```text
https://<YOUR_CUSTOM_DOMAIN>/sub-<YOUR_SUB_TOKEN>
```

7. Import into Shadowrocket / v2rayN. Prefer China-5G entry IPs + empty `alpn=` + TLS `fragment` (details in `SKILL.md`).
8. Verify with a real client — never claim a node works from Worker logs alone.

Optional probe (no CF account needed):

```bash
python3 scripts/probe_vpngate_sstp.py --host vpn*.opengw.net --port 995
```

---

## Directory

| Path | Role |
|---|---|
| `SKILL.md` | Deploy / anti-1101 / China-5G / E2E checklist (for AI or humans) |
| `STABILITY.md` | Short stability caveats |
| `AUTO_REFRESH.md` | Entry-IP KV + cron + PINNED hard refresh |
| `worker/worker_stealth_sub.js` | Production stealth Worker + `/sub-` `/json-` `/entries-` `/probe-` + cron |
| `worker/worker_158_pure_js.js` | Minimal ~158-line reference stack |
| `scripts/probe_vpngate_sstp.py` | Standalone MS-SSTP handshake + residential IP check |
| `scripts/refresh_sstp_entries.py` | Hot-update preferred entries (env placeholders) |
| `LICENSE` | MIT |

---

## Sibling: more stable VPS path

If you have a VPS and want hotter standby / better uptime:

→ **[free-dam-man/homeline-residential-exit-skill](https://github.com/free-dam-man/homeline-residential-exit-skill)** (Mihomo / 家宽 VPS 热备)

---

## License

MIT © 2026 free-dam-man / 思索者 — see [`LICENSE`](LICENSE).

## Disclaimer

For learning and network research only. Obey local laws and Cloudflare / SoftEther / VPNGate terms. Volunteer exits are unaudited; residential IP ≠ anonymity. No warranty.
