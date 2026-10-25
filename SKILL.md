---
name: cf-sstp-home-broadband
description: "Use when someone wants to deploy a Cloudflare Worker that connects directly to multi-country native residential broadband nodes (真家宽 / MS-SSTP / VPNGate) using a pure-JS user-space SSTP + PPP + IPv4 + TCP stack, bypass Cloudflare AS13335 datacenter exit detection (achieving isResidential: true and FraudScore 0~6 on JP SoftBank/KDDI, KR KT/SKB/LGU+, US Charter/Comcast, HK HKT, AU Telstra, VN FPT, MX Telmex, BE Proximus, NO NextGenTel, TH 3BB), generate a one-click Shadowrocket/v2rayN subscription QR code, fix Cloudflare Worker 1101 / Shadowrocket China 5G Timeout (including stale preferred entry IPs via daily KV refresh), or compare against a more stable VPS path. Prefer free-dam-man/homeline-residential-exit-skill when the user has a VPS and needs better stability."
---

# CF Worker 免VPS · 22国真家宽 (MS-SSTP)

`cf-sstp-home-broadband` — Cloudflare Worker pure-JS MS-SSTP residential broadband gateway (**22 countries** in the bundled example CFG).

## Stability / 稳定性（必读）

**This zero-VPS path is LESS stable than the VPS Mihomo hot-standby skill.**

- More reliable sibling: https://github.com/free-dam-man/homeline-residential-exit-skill
- SoftEther / VPNGate **volunteer** residential exits go offline; country labels can be wrong.
- CF Worker **cold starts / 1101 / China 5G timeouts** happen; concurrent Shadowrocket tests often fail over.
- **适合零成本尝鲜 / 没有 VPS 时的备选；要稳定请用家宽 VPS 那套 Mihomo 热备。**
- Do not present this as production-grade always-on. See `STABILITY.md` / README.

## 入口 IP 自动刷新（China all-Timeout 急救）

China 5G **全部 Timeout** is usually **stale Cloudflare preferred entry IPs**, not a dead SoftEther pool.

1. Bind Workers KV as `ENTRIES_KV`; enable Worker cron `0 0 * * *` UTC (= **08:00 Asia/Shanghai**).
2. Soft refresh: Worker `scheduled` pulls a community preferred-IP list when KV is older than ~20h.
3. Hard refresh (recommended after a China probe): `PUT /entries-<YOUR_SUB_TOKEN>` with `{"entries":["ip:port",...]}` or run `scripts/refresh_sstp_entries.py` with `SSTP_HOST` / `SSTP_SUB_TOKEN` env vars.
4. Clients keep the same `https://<YOUR_CUSTOM_DOMAIN>/sub-<YOUR_SUB_TOKEN>` URL and only pull-to-refresh.
5. Confirm via `/json-<YOUR_SUB_TOKEN>` → `entriesMeta.source=kv`.

Full notes: [`AUTO_REFRESH.md`](AUTO_REFRESH.md). Still less stable than the VPS Mihomo sibling.

---

Turn a single Cloudflare Worker into a **multi-country native residential broadband (`真家宽`) gateway** without buying a VPS or paid residential proxy.

Unlike standard Cloudflare Workers proxies (whose outbound traffic exits from Cloudflare's `AS13335` datacenter IP and gets flagged by `my.ippure.com` / `ipinfo.io` as `isResidential: false`), this architecture implements a **pure-JavaScript user-space network stack** inside the Worker:
1. **Inbound**: Accepts standard `VLESS + WebSocket + TLS` from Shadowrocket / v2rayN / Clash Meta / Xray.
2. **DoH Pre-Resolution & TCP State Machine**: Resolves domain targets (`atyp=2`) to IPv4 via Cloudflare DoH (`1.1.1.1/dns-query`) in parallel with SSTP tunnel establishment, and encapsulates outbound TCP streams into raw IPv4 + TCP (`SYN` -> `SYN-ACK` -> `PSH-ACK` -> `FIN-ACK`) packets with hardware-accurate IPv4 and TCP pseudo-header checksums.
3. **MS-SSTP + PPP Framing over TLS (`cloudflare:sockets`)**: Connects to upstream SoftEther / MS-SSTP residential volunteer gateways (`vpn*.opengw.net:<port>`) over TLS (`secureTransport: "on"`), negotiates `SSTP_DUPLEX_POST`, `LCP`, and `IPCP` to obtain a local residential LAN IPv4 address (`vip`), and tunnels the user's TCP connections out through the residential home fiber connection (`SoftBank`, `KDDI`, `Korea Telecom`, `SK Broadband`, `LG U+`, `Charter Spectrum`, `Comcast`, `HKT`, `Telstra`, `FPT`, `Telmex`, `Proximus`, `NextGenTel`, `3BB`).

---

## 1. Critical Deployment Rules (Avoiding Cloudflare Error `1101`)

When deploying a VLESS + MS-SSTP Worker to Cloudflare Workers, two pitfalls cause immediate `error code: 1101` crashes:

### Pitfall A: Multipart Upload Corruption in Cloudflare MCP `execute`
When uploading a Worker via `cloudflare.request` in the Cloudflare MCP tool, you **MUST** pass `rawBody: true` alongside `contentType: 'multipart/form-data; boundary=' + b`.
- Without `rawBody: true`, the SDK runs `JSON.stringify(body)` on the multipart string, corrupting the Worker module on Cloudflare's edge and permanently tainting that Worker script name (`1101`).
- If a script name is already tainted by a non-`rawBody` upload, **delete it and deploy under a brand-new Worker name** (e.g., `home-edge-gw`).

### Pitfall B: Static Signature Scanning (`1101` Runtime Block)
Cloudflare's static scanner flags plain-text protocol literals such as `vless://`, `SSTP_DUPLEX_POST`, `/sra_{BA195980-CD49-458b-9E23-C84EE0ADCD75}/`, `SSTPCORRELATIONID`, `opengw.net`, and `sstp://`.
- **Solution**: Store sensitive protocol strings as Base64 constants and decode them at runtime via a helper `decStr(b64)`.

---

## 2. Four Mandatory Rules to Prevent Shadowrocket `Timeout` on China 5G

When importing a VLESS+WS+TLS subscription into Shadowrocket on China Mobile / Unicom / Telecom 5G, four subtle bugs will cause 100% `Timeout` during Connectivity Test unless fixed:

1. **Never set `alpn=h2,http/1.1` on `type=ws` + Include TLS `fragment`**:
   - Setting `alpn=h2,http/1.1` causes Shadowrocket to negotiate HTTP/2 (`h2`) during TLS handshake with Cloudflare, which breaks RFC 6455 HTTP/1.1 `Upgrade: websocket`.
   - Always use `&alpn=` (empty) and include `&fragment=1%2C40-60%2C30-50%2Ctlshello` to split the TLS ClientHello across GFW DPI (SNI = `<YOUR_CUSTOM_DOMAIN>`):
     ```text
     vless://<UUID>@<ENTRY_IP>:<PORT>?security=tls&type=ws&host=<HOST>&fp=chrome&sni=<HOST>&path=%2Fs%2F<SSTP_HOST>%3A<SSTP_PORT>%3Fed%3D2560&fragment=1%2C40-60%2C30-50%2Ctlshello&encryption=none&alpn=#<NAME>
     ```
2. **Use Verified China-5G Cloudflare Preferred Entry IPs & Matching Ports**:
   - Raw custom domains (`<YOUR_CUSTOM_DOMAIN>:443`) resolve to default `104.21.x.x` / `172.67.x.x` IPs that are blocked or throttled on China Mobile 5G.
   - Rotate across verified Cloudflare official entry IP:port pairs in `buildSub`:
     - Port `443`: `104.17.122.29:443`, `104.17.185.68:443`, `104.17.162.3:443`, `104.16.151.5:443`, `104.17.48.235:443`, `104.17.100.215:443`, `104.17.115.188:443`, `104.16.145.59:443`
     - Port `2083`: `172.66.44.98:2083`, `162.159.140.116:2083` (Note: `172.66.44.98` must use `2083`, not `443`)
     - Port `2053`: `162.159.128.253:2053`, `104.31.16.158:2053`
   - Use clean paths `/s/<host>:<port>?ed=2560` in `buildSub` while supporting `/s/...`, `/?sstp=...`, `/?sstp://...`, and `/sstp://...` in `getTun(req.url)`.
3. **Zero-Latency TCP `flush()` + Pre-Started SSTP Handshake + Pipelined `initData`**:
   - Never buffer incoming TCP packets in `pend` waiting for `pLen >= 32768` or `FIN`! Shadowrocket's connectivity check (`GET http://www.gstatic.com/generate_204` or `http://cp.cloudflare.com/generate_204` with `Connection: keep-alive`) returns a ~100-byte `HTTP/1.1 204 No Content` response without `FIN`. Always call `flush()` **immediately** after every TCP data packet (`if (pLen) { tun.wr.write(tcp.frame(0x10)).catch(() => {}); flush(); }`).
   - Start `openTun(host, port).establish()` immediately on WebSocket `Upgrade` inside `fetch()` (before waiting for the first WebSocket message if Early Data is omitted), and pipeline `ACK + initData` inside `tcp.handshake(initData)` as soon as `SYN-ACK` arrives.
4. **Per-Country Backup SSTP Gateway Racing (`BACKUPS`)**:
   - Volunteer residential routers can occasionally be busy when Shadowrocket tests 16 nodes simultaneously. Maintain a `BACKUPS` map per gateway and race/fail over automatically if the primary gateway fails or takes `> 2200ms`.

---

## 3. End-to-End Verification Checklist (Mandatory)

Never claim a residential node works without testing through a real local VLESS client (`xray`):

1. **Verify Subscription Format**:
   - `curl -s "https://<YOUR_CUSTOM_DOMAIN>/sub-<YOUR_SUB_TOKEN>" | base64 -d`
   - Confirm every URI has `alpn=`, `fragment=1%2C40-60%2C30-50%2Ctlshello`, and China-5G preferred entry IP:ports.
2. **Run Local Xray -> Preferred Entry IP (`104.17.122.29:443` / `172.66.44.98:2083`) -> Residential Exit**:
   - Test Shadowrocket's exact keep-alive connectivity check:
     `curl -i -x socks5h://127.0.0.1:10808 http://www.gstatic.com/generate_204` and `http://cp.cloudflare.com/generate_204` -> must return `HTTP/1.1 204 No Content` in `< 2.5s`.
   - Query `curl -s -x socks5h://127.0.0.1:10808 https://my.ippure.com/v1/info` across all nodes -> must return `isResidential: true` and low `fraudScore` (`0~6`).