#!/usr/bin/env python3
"""Daily China-preferred CF entry IP refresh for the MS-SSTP Worker.

Does NOT change the subscription URL or token. Writes preferred entry IPs
into Worker KV via PUT /entries-<YOUR_SUB_TOKEN> (same idea as a daily
cf-node PINNED list ~08:00 Asia/Shanghai).

Usage:
  export SSTP_HOST="<YOUR_CUSTOM_DOMAIN>"
  export SSTP_SUB_TOKEN="<YOUR_SUB_TOKEN>"
  python3 scripts/refresh_sstp_entries.py path/to/PINNED.txt
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
  stdin = len(sys.argv) < 2 or sys.argv[1] == "-"
  path = None if stdin else Path(sys.argv[1])
  entries = load_entries(path, stdin)
  note = "PINNED-stdin" if stdin else path.name
  now = datetime.now(SH).strftime("%Y-%m-%d %H:%M Asia/Shanghai")
  print(f"[{now}] refreshing {len(entries)} entries -> https://{DOMAIN}/entries-***")
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
