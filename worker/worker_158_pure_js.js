import { connect } from 'cloudflare:sockets';
const uuid = '2523c510-9ff0-415b-9582-93949bfae7e3', maxED = 8192, MSS = 1400;
export default { fetch: req => req.headers.get('Upgrade') === 'websocket' ? ws(req) : new Response('ok') };
const idB = Uint8Array.fromHex(uuid.replaceAll('-', '')), dec = new TextDecoder(), enc = s => new TextEncoder().encode(s), E = new Uint8Array(0);
const cat = (...a) => { const r = new Uint8Array(a.reduce((s, x) => s + x.length, 0)); a.reduce((o, x) => (r.set(x, o), o + x.length), 0); return r; };
const u16 = (b, o) => b[o] << 8 | b[o + 1], u32 = (b, o) => (b[o] << 24 | b[o + 1] << 16 | b[o + 2] << 8 | b[o + 3]) >>> 0;
const rng = n => crypto.getRandomValues(new Uint8Array(n)), rng16 = () => { const r = rng(2); return u16(r, 0); }, rng32 = () => { const r = rng(4); return u32(r, 0); };
const ipB = ip => new Uint8Array(ip.split('.').map(Number)), papCred = enc(atob('dnBu'));
const cksum = (d, o, n) => { let s = 0; for (let i = o; i < o + n - 1; i += 2) s += u16(d, i); if (n & 1) s += d[o + n - 1] << 8; while (s >> 16) s = (s & 0xFFFF) + (s >> 16); return (~s) & 0xFFFF; };
const addr = (t, b) => t === 3 ? dec.decode(b) : t === 1 ? `${b[0]}.${b[1]}.${b[2]}.${b[3]}` : `[${Array.from({ length: 8 }, (_, i) => u16(b, i * 2).toString(16)).join(':')}]`;
const parseAddr = (b, o, t) => { const l = t === 3 ? b[o++] : t === 1 ? 4 : t === 4 ? 16 : 0; return l && o + l <= b.length ? { addrBytes: b.subarray(o, o + l), dataOffset: o + l } : null; };
const vless = c => { for (let i = 0; i < 16; i++) if (c[i + 1] !== idB[i]) return null; const o = 19 + c[17], p = u16(c, o), t = c[o + 2] === 1 ? 1 : c[o + 2] + 1, a = parseAddr(c, o + 3, t); return a ? { addrType: t, ...a, port: p } : null; };
const resolveIP = async h => /^\d+\.\d+\.\d+\.\d+$/.test(h) ? h : (await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(h)}&type=A`, { headers: { Accept: 'application/dns-json' } }).then(r => r.json()).catch(() => ({}))).Answer?.find(a => a.type === 1)?.data ?? null;
const getSstp = url => { const m = decodeURIComponent(url).match(/\/sstp:\/\/([^?&#\s]*)/i); if (!m) return null; const [host, p] = m[1].split(':'); return p ? { host, port: +p } : null; };
const relay = async (rd, send, close) => { try { for (;;) { const { done, value } = await rd.read(); if (done) break; value?.byteLength && send(value); } } catch {} finally { rd.releaseLock(); close(); } };
const createSstp = () => {
  let buf = E, pppId = 1, sock, rd, wr, host, rb = new ArrayBuffer(65536);
  const readBytes = async n => {
    if (buf.length >= n) { const r = buf.subarray(0, n); buf = buf.subarray(n); return r; }
    const saved = buf.length > 0 ? new Uint8Array(buf) : null, need = n - buf.length;
    const { value, done } = await rd.readAtLeast(need, new Uint8Array(rb, 0, 65536));
    if (done) throw 0; rb = value.buffer;
    if (saved) { const t = cat(saved, value); buf = t.subarray(n); return t.subarray(0, n); }
    buf = value.subarray(n); return value.subarray(0, n);
  };
  const readLine = async () => {
    for (;;) {
      const i = buf.indexOf(10);
      if (i >= 0) { let l = dec.decode(buf.subarray(0, i)); buf = buf.subarray(i + 1); return l.replace(/\r$/, ''); }
      const saved = buf.length > 0 ? new Uint8Array(buf) : null;
      const { value, done } = await rd.readAtLeast(1, new Uint8Array(rb, 0, 65536));
      if (done) throw 0; rb = value.buffer; buf = saved ? cat(saved, value) : value;
    }
  };
  const readPkt = async (ms = 10000) => {
    let t; const to = new Promise((_, r) => { t = setTimeout(() => r('T'), ms); });
    try { const h = await Promise.race([readBytes(4), to]); clearTimeout(t); const len = u16(h, 2) & 0xFFF;
      return { ctrl: (h[1] & 1) !== 0, body: len > 4 ? await readBytes(len - 4) : E }; } catch (e) { clearTimeout(t); throw e; }
  };
  const sstpData = f => { const n = 6 + f.length, p = new Uint8Array(n); p.set([0x10, 0, ((n >> 8) & 0xF) | 0x80, n & 0xFF, 0xFF, 0x03]); p.set(f, 6); return p; };
  const sstpCtrl = (mt, attrs = []) => {
    const al = attrs.reduce((s, a) => s + 4 + a.data.length, 0), p = new Uint8Array(8 + al), v = new DataView(p.buffer);
    p[0] = 0x10; p[1] = 0x01; v.setUint16(2, (8 + al) | 0x8000); v.setUint16(4, mt); v.setUint16(6, attrs.length);
    attrs.reduce((o, a) => (p[o + 1] = a.id, v.setUint16(o + 2, 4 + a.data.length), p.set(a.data, o + 4), o + 4 + a.data.length), 8);
    return p;
  };
  const ppp = (proto, code, id, opts = []) => {
    const ol = opts.reduce((s, o) => s + 2 + o.data.length, 0), f = new Uint8Array(6 + ol), v = new DataView(f.buffer);
    v.setUint16(0, proto); f[2] = code; f[3] = id; v.setUint16(4, 4 + ol);
    opts.reduce((o, x) => (f[o] = x.type, f[o + 1] = 2 + x.data.length, f.set(x.data, o + 2), o + 2 + x.data.length), 6);
    return f;
  };
  const pap = id => { const ul = papCred.length, tl = 6 + ul * 2, f = new Uint8Array(2 + tl), v = new DataView(f.buffer);
    v.setUint16(0, 0xc023); f[2] = 1; f[3] = id; v.setUint16(4, tl); f[6] = ul; f.set(papCred, 7); f[7 + ul] = ul; f.set(papCred, 8 + ul); return f; };
  const parsePPP = d => { let o = d.length >= 2 && d[0] === 0xFF && d[1] === 0x03 ? 2 : 0; if (d.length - o < 4) return null;
    const p = u16(d, o); return p === 0x0021 ? { protocol: p, ip: d.subarray(o + 2) } : d.length - o >= 6 ? { protocol: p, code: d[o + 2], id: d[o + 3], payload: d.subarray(o + 6), raw: d.subarray(o) } : null; };
  const parseOpts = d => { const r = []; for (let i = 0; i + 2 <= d.length;) { const t = d[i], l = d[i + 1]; if (l < 2 || i + l > d.length) break; r.push({ type: t, data: d.subarray(i + 2, i + l) }); i += l; } return r; };
  const connect_ = async (h, p) => { sock = connect({ hostname: h, port: p }, { secureTransport: 'on' }); await sock.opened;
    rd = sock.readable.getReader({ mode: 'byob' }); wr = sock.writable.getWriter(); host = h; };
  const establish = async () => {
    const http = enc(`SSTP_DUPLEX_POST /sra_{BA195980-CD49-458b-9E23-C84EE0ADCD75}/ HTTP/1.1\r\nHost: ${host}\r\nContent-Length: 18446744073709551615\r\nSSTPCORRELATIONID: {${crypto.randomUUID()}}\r\n\r\n`);
    const pa = new Uint8Array(2); new DataView(pa.buffer).setUint16(0, 1); const mru = new Uint8Array(2); new DataView(mru.buffer).setUint16(0, 1500);
    await wr.write(cat(http, sstpCtrl(0x0001, [{ id: 1, data: pa }]), sstpData(ppp(0xc021, 1, pppId++, [{ type: 1, data: mru }]))));
    const st = await readLine(); while ((await readLine()) !== ''); if (!st.includes('200')) throw 0;
    let sa = false, ld = false, auth = false, done = false, myIp = null;
    for (let r = 0; r < 25 && !done; r++) {
      const pk = await readPkt(); if (pk.ctrl) { if (!sa && pk.body.length >= 2 && u16(pk.body, 0) === 2) sa = true; continue; }
      const pp = parsePPP(pk.body); if (!pp) continue;
      if (pp.protocol === 0xc021) {
        if (pp.code === 1) { const a = new Uint8Array(pp.raw); a[2] = 2;
          await wr.write(ld && !auth ? cat(sstpData(a), sstpData(pap(pppId++))) : sstpData(a)); if (ld) auth = true;
        } else if (pp.code === 2) { ld = true; if (!auth) { await wr.write(sstpData(pap(pppId++))); auth = true; } }
      } else if (pp.protocol === 0xc023 && pp.code === 2) await wr.write(sstpData(ppp(0x8021, 1, pppId++, [{ type: 3, data: new Uint8Array(4) }])));
      else if (pp.protocol === 0x8021) {
        if (pp.code === 1) { const a = new Uint8Array(pp.raw); a[2] = 2; await wr.write(sstpData(a)); }
        else if (pp.code === 3) { const o = parseOpts(pp.payload).find(x => x.type === 3); if (o) { myIp = [...o.data].join('.'); await wr.write(sstpData(ppp(0x8021, 1, pppId++, [{ type: 3, data: o.data }]))); } }
        else if (pp.code === 2) { const o = parseOpts(pp.payload).find(x => x.type === 3); if (o) myIp = [...o.data].join('.'); done = true; }
      }
    }
    if (!myIp) throw 0; return myIp;
  };
  const close = () => { [rd, wr, sock].forEach(x => { try { x?.cancel?.() ?? x?.close?.(); } catch {} }); };
  return { connect: connect_, establish, readPkt, parsePPP, get buf() { return buf; }, get wr() { return wr; }, close };
};
const createTcp = (sstp, srcIp, dstIp, dstPort) => {
  const srcPort = 10000 + (rng16() % 50000), srcB = ipB(srcIp), dstB = ipB(dstIp);
  let seq = rng32(), ack = 0;
  const ipTpl = new Uint8Array(20); ipTpl.set([0x45, 0, 0, 0, 0, 0, 0x40, 0, 64, 6]); ipTpl.set(srcB, 12); ipTpl.set(dstB, 16);
  const pseudo = new Uint8Array(1432); pseudo.set(srcB); pseudo.set(dstB, 4); pseudo[9] = 6;
  const frame = (flags, data = E) => {
    const pl = data.length, tl = 20 + pl, il = 20 + tl, st = 8 + il, f = new Uint8Array(st), v = new DataView(f.buffer);
    f.set([0x10, 0, ((st >> 8) & 0xF) | 0x80, st & 0xFF, 0xFF, 0x03, 0, 0x21]); f.set(ipTpl, 8);
    v.setUint16(10, il); v.setUint16(12, rng16()); v.setUint16(18, cksum(f, 8, 20));
    v.setUint16(28, srcPort); v.setUint16(30, dstPort); v.setUint32(32, seq); v.setUint32(36, ack);
    f[40] = 0x50; f[41] = flags; v.setUint16(42, 65535); if (pl) f.set(data, 48);
    pseudo[10] = tl >> 8; pseudo[11] = tl & 0xFF; pseudo.set(f.subarray(28, 28 + tl), 12);
    v.setUint16(44, cksum(pseudo, 0, 12 + tl)); return f;
  };
  const match = ip => { if (ip.length < 40 || ip[9] !== 6) return null; const ihl = (ip[0] & 0xF) * 4;
    if (u16(ip, ihl) !== dstPort || u16(ip, ihl + 2) !== srcPort) return null;
    return { flags: ip[ihl + 13], seq: u32(ip, ihl + 4), off: ihl + ((ip[ihl + 12] >> 4) & 0xF) * 4 }; };
  const handshake = async () => {
    await sstp.wr.write(frame(0x02)); seq++;
    for (let i = 0; i < 30; i++) { const pk = await sstp.readPkt(); if (pk.ctrl) continue;
      const pp = sstp.parsePPP(pk.body); if (!pp || pp.protocol !== 0x0021) continue;
      const m = match(pp.ip); if (!m || (m.flags & 0x12) !== 0x12) continue;
      ack = (m.seq + 1) >>> 0; sstp.wr.write(frame(0x10)); return true; }
    throw 0;
  };
  return { frame, match, handshake, get seq() { return seq; }, set seq(v) { seq = v; }, get ack() { return ack; }, set ack(v) { ack = v; } };
};
const sstpConn = async ({ host, port }, ipP, targetPort) => {
  const sstp = createSstp(), close = () => sstp.close();
  try {
    await sstp.connect(host, port);
    const [myIp, targetIp] = await Promise.all([sstp.establish(), ipP]); if (!targetIp) { close(); return null; }
    const tcp = createTcp(sstp, myIp, targetIp, targetPort); await tcp.handshake();
    let ctrl = null;
    const readable = new ReadableStream({ start: c => { ctrl = c; }, cancel: close });
    (async () => {
      try { let pend = [], pLen = 0;
        const flush = () => { if (!pLen) return; ctrl.enqueue(pend.length === 1 ? pend[0] : cat(...pend)); pend = []; pLen = 0; sstp.wr.write(tcp.frame(0x10)).catch(() => {}); };
        for (;;) { const pk = await sstp.readPkt(60000); if (pk.ctrl) continue;
          const pp = sstp.parsePPP(pk.body); if (!pp || pp.protocol !== 0x0021) continue;
          const m = tcp.match(pp.ip); if (!m) continue;
          if (m.off < pp.ip.length) { const d = pp.ip.subarray(m.off); if (d.length) { tcp.ack = (m.seq + d.length) >>> 0; pend.push(new Uint8Array(d)); pLen += d.length; } }
          if (m.flags & 0x01) { flush(); tcp.ack = (tcp.ack + 1) >>> 0; sstp.wr.write(tcp.frame(0x11)).catch(() => {}); ctrl.close(); return; }
          if (sstp.buf.length < 4 || pLen >= 32768) flush();
        }
      } catch { try { ctrl.close(); } catch {} }
    })();
    const writable = new WritableStream({
      async write(chunk) { const d = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
        if (d.length <= MSS) { await sstp.wr.write(tcp.frame(0x18, d)); tcp.seq = (tcp.seq + d.length) >>> 0; return; }
        const frames = []; for (let o = 0; o < d.length; o += MSS) { const seg = d.subarray(o, Math.min(o + MSS, d.length)); frames.push(tcp.frame(0x18, seg)); tcp.seq = (tcp.seq + seg.length) >>> 0; }
        await sstp.wr.write(cat(...frames));
      }, close: () => sstp.wr.write(tcp.frame(0x11)).catch(() => {}), abort: close
    });
    return { readable, writable, close };
  } catch { close(); return null; }
};
const ws = async req => {
  const [client, server] = Object.values(new WebSocketPair()); server.accept();
  const ed = req.headers.get('sec-websocket-protocol'), ep = getSstp(req.url);
  let w = null, sock = null, chain = Promise.resolve();
  const close = () => { try { sock?.close(); } catch {} try { server.close(); } catch {} }, send = d => { try { server.send(d); } catch {} };
  const process = async chunk => {
    if (w) return w.write(chunk);
    const v = vless(chunk); if (!v) return close(); send(new Uint8Array([chunk[0], 0]));
    const { addrType, addrBytes, dataOffset, port } = v, host = addr(addrType, addrBytes), payload = chunk.subarray(dataOffset);
    if (!ep) return close();
    sock = await sstpConn(ep, addrType === 1 ? host : resolveIP(host), port); if (!sock) return close();
    w = sock.writable.getWriter(); payload.byteLength && await w.write(payload); relay(sock.readable.getReader(), send, close);
  };
  if (ed?.length <= maxED) chain = chain.then(() => process(Uint8Array.fromBase64(ed, { alphabet: 'base64url' }))).catch(close);
  server.addEventListener('message', e => { chain = chain.then(() => process(new Uint8Array(e.data instanceof ArrayBuffer ? e.data : e.data.buffer ?? e.data))).catch(close); });
  server.addEventListener('close', close); server.addEventListener('error', close);
  return new Response(null, { status: 101, webSocket: client, headers: ed ? { 'sec-websocket-protocol': ed } : {} });
};