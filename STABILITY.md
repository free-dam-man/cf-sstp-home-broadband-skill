# Stability / 稳定性（必读）

This zero-VPS Cloudflare Worker + MS-SSTP path is **less stable** than the VPS Mihomo hot-standby residential exit skill:

→ https://github.com/free-dam-man/homeline-residential-exit-skill

## Why (plain language)

- SoftEther / VPNGate **volunteer** residential routers go offline without notice.
- Country / ISP labels on volunteer nodes can be **wrong or stale**.
- Cloudflare Workers can hit **cold starts**, edge **error 1101**, or **China 5G timeouts**.
- Concurrent Shadowrocket connectivity tests across many nodes often **fail over** or time out even when a single node works.
- China 5G **all-Timeout** is often **stale CF preferred entry IPs** — fix with daily entry refresh (see [`AUTO_REFRESH.md`](AUTO_REFRESH.md)); that still does not equal VPS uptime.

## Who this is for

- **适合零成本尝鲜** / a free no-VPS trial.
- **没有 VPS 时的备选**.

## Who should use the other repo

- Want something closer to **always-on / production-ish** residential exits → use the **家宽 VPS Mihomo 热备** skill above.
- Do **not** treat this Worker package as production-grade always-on infrastructure.
