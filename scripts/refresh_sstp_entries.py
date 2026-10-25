#!/usr/bin/env python3
"""Daily China-preferred CF entry IP refresh for the MS-SSTP Worker.

Does NOT change the subscription URL or token. Writes preferred entry IPs
into Worker KV via PUT /entries-<YOUR_SUB_TOKEN> (same idea as a daily
cf-node PINNED list ~08:00 Asia/Shanghai).

When auto-picking from a probe directory, prefer PINNED.after.txt
(post China-probe) over PINNED.txt — using the pre-probe list alone has
caused China 5G all-Timeout.

Usage:
  export SSTP_HOST="<YOUR_CUSTOM_DOMAIN>"
  export SSTP_SUB_TOKEN="<YOUR_SUB_TOKEN>"
  # explicit file (or "-" for stdin):
  python3 scripts/refresh_sstp_entries.py path/to/PINNED.after.txt
  # auto-pick newest daily-*/PINNED.after.txt then PINNED.txt:
  export SSTP_PINNED_DIR="/path/to/probe-root"   # contains daily-YYYY-MM-DD/
  python3 scripts/refresh_sstp_entries.py
  # or pipe lines of ip:port:
  printf "104.17.122.29:443\n172.66.44.98:2083\n" | \
    python3 scripts/refresh_sstp_entries.py -
"""
from __future__ import annotations
import json, os, subprocess, sys
from pathlib import Path
from datetime import datetime, timezone, timedelta
from urllib.parse import quote

SH = timezone(timedelta(hours=8))
DOMAIN = os.environ.get("SSTP_HOST") or "<YOUR_CUSTOM_DOMAIN>"
TOKEN = os.environ.get("SSTP_SUB_TOKEN") or "<YOUR_SUB_TOKEN>"
PINNED_DIR = os.environ.get("SSTP_PINNED_DIR") or ""

def newest_pinned(root: Path) -> Path:
  """Prefer daily-*/PINNED.after.txt (post China-probe); else PINNED.txt."""
  after = sorted(root.glob("daily-*/PINNED.after.txt"), reverse=True)
  if after:
    return after[0]
  days = sorted(root.glob("daily-*/PINNED.txt"), reverse=True)
  if not days:
    raise SystemExit(
      f"no daily-*/PINNED.after.txt or PINNED.txt under {root} "
      "(set SSTP_PINNED_DIR or pass a file path)"
    )
  return days[0]

def load_entries(path: Path | None, stdin: bool) -> list[str]:
  text = sys.stdin.read() if stdin else path.read_text()
  out = []
  for line in text.splitlines():
    s = line.strip().split("#", 1)[0].strip()
    if not s:
      continue
    if ":" not in s:
      s = s + ":443"
    ip, _, port = s.partition(":")
    if port not in ("443", "2053", "2083", "8443", "2096"):
      continue
    out.append(f"{ip}:{port}")
  seen, uniq = set(), []
  for e in out:
    if e not in seen:
      seen.add(e); uniq.append(e)
  if len(uniq) < 3:
    raise SystemExit(f"too few entries: {uniq}")
  return uniq

def curl_json(method: str, url: str, data: bytes | None = None) -> dict:
  cmd = ["curl", "-sS", "-X", method,
         "-H", "User-Agent: cf-sstp-home-refresh/1.0",
         "-H", "Content-Type: application/json",
         "--max-time", "30", url]
  if data is not None:
    cmd += ["--data-binary", "@-"]
  r = subprocess.run(cmd, input=data, capture_output=True)
  if r.returncode != 0:
    raise SystemExit(f"curl fail: {r.stderr.decode()}")
  try:
    return json.loads(r.stdout.decode())
  except Exception:
    raise SystemExit(f"bad response: {r.stdout[:400]!r}")

def main():
  if DOMAIN.startswith("<") or TOKEN.startswith("<"):
    raise SystemExit("Set SSTP_HOST and SSTP_SUB_TOKEN env vars (placeholders not allowed).")
  if len(sys.argv) >= 2 and sys.argv[1] != "-":
    path = Path(sys.argv[1])
    stdin = False
  elif len(sys.argv) >= 2 and sys.argv[1] == "-":
    path = None
    stdin = True
  elif PINNED_DIR:
    path = newest_pinned(Path(PINNED_DIR))
    stdin = False
  else:
    raise SystemExit(
      "Pass a PINNED file path, '-', or set SSTP_PINNED_DIR "
      "(auto-picks daily-*/PINNED.after.txt then PINNED.txt)."
    )
  entries = load_entries(path, stdin)
  if stdin:
    note = "PINNED-stdin"
  elif path is not None and path.name == "PINNED.after.txt":
    note = f"PINNED.after-{path.parent.name.replace('daily-', '')}"
  elif path is not None and "daily-" in str(path):
    note = f"PINNED-{path.parent.name.replace('daily-', '')}"
  else:
    note = path.name if path else "PINNED"
  now = datetime.now(SH).strftime("%Y-%m-%d %H:%M Asia/Shanghai")
  src = "stdin" if stdin else str(path)
  print(f"[{now}] refreshing {len(entries)} entries from {src} -> https://{DOMAIN}/entries-***")
  url = f"https://{DOMAIN}/entries-{TOKEN}?note={quote(note)}"
  res = curl_json("PUT", url, json.dumps({"entries": entries, "note": note}).encode())
  print("put", {k: res.get(k) for k in ("ok", "saved", "count")})
  j = curl_json("GET", f"https://{DOMAIN}/json-{TOKEN}")
  print("live entry count", len(j.get("entries") or []))
  print("meta", j.get("entriesMeta"))
  if set(j.get("entries") or []) != set(entries):
    raise SystemExit("VERIFY FAIL: live entries mismatch")
  print("OK — subscription URL unchanged; entries hot-updated in KV")

if __name__ == "__main__":
  main()
