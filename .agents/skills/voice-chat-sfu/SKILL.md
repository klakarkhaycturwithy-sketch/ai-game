---
name: Voice Chat SFU
description: >-
  SFU (Selective Forwarding Unit) voice chat for web games: mediasoup, Janus, or LiveKit.
  Covers when to migrate from P2P mesh, server setup, client integration, scaling, and cost.
  Use when a multiplayer web game needs voice chat for 6+ players or low-bandwidth clients.
---

# Voice Chat SFU — เสียงสนทนาแบบ SFU สำหรับเกม Web

> ใช้เมื่อเกมต้องการ **voice chat สำหรับผู้เล่น > 6 คน** หรือ **ผู้เล่นบนมือถือ/เครื่องสเปกต่ำ** ที่ P2P mesh ไม่ไหว
> โหลดสกิล `supabase-voice-chat` ก่อน แล้วใช้สกิลนี้เมื่อต้อง migrate ไป SFU

---

## 1. Mesh vs SFU (WHY)

| ประเภท | ผู้เล่น max | Bandwidth ต่อผู้เล่น | ความซับซ้อน | เหมาะกับ |
|---|---|---|---|---|
| **Mesh (P2P)** | 2-6 คน | (n-1) streams (สูง) | ต่ำ (ไม่ต้อง server) | party ขนาดเล็ก, portfolio |
| **SFU (Selective Forwarding Unit)** | 6-100+ คน | 1 stream up + (n-1) down (ต่ำ) | กลาง (ต้องมี server) | lobby ใหญ่, competitive, มือถือ |

> **Pourquoi (WHY) SFU ดีกว่า Mesh สำหรับผู้เล่นจำนวนมาก:** Mesh ต้องให้ทุก peer ส่ง audio ให้ทุก peer → bandwidth ผู้เล่น = (n-1) streams; SFU ให้ทุก peer ส่ง 1 stream ไป server → server forward ให้ทุกคน → bandwidth ผู้เล่น = 1 up + (n-1) down (แต่ down ถูก compress/limit ได้)

---

## 2. เมื่อไหร่ควร Migrate (Decision Gate)

Migrate จาก P2P mesh ไป SFU เมื่อ:
- [ ] ผู้เล่น > 6 คนพร้อมกันในห้องเดียว
- [ ] ผู้เล่นใช้มือถือ/เครื่องสเปกต่ำ (bandwidth จำกัด)
- [ ] ต้องการ simulcast (ส่งหลาย quality พร้อมกัน)
- [ ] ต้องการ recording/mixing (server-side)
- [ ] มีรายได้รองรับค่า server

> **Recommended Default:** เริ่มจาก P2P mesh (ฟรี, ง่าย); migrate ไป SFU เมื่อพบปัญหา bandwidth/quality จริง (YAGNI)

---

## 3. ตัวเลือก SFU

| บริการ | ประเภท | จุดเด่น | จุดด้อย | เหมาะกับ |
|---|---|---|---|---|
| **LiveKit** | Open source + Cloud | modern, SDK ดี, WebRTC, ฟรี self-host | ต้อง host หรือจ่าย cloud | indie/portfolio, modern stack |
| **mediasoup** | Open source (Node.js) | high performance, flexible | learning curve สูง | advanced, custom |
| **Janus** | Open source (C) | mature, plugins | ซับซ้อน, C codebase | advanced, legacy |
| **Twilio (Video)** | Managed | managed, ง่าย | แพง | commercial, ไม่อยาก maintain |
| **Cloudflare Calls** | Managed (WebRTC) | edge, low latency | ใหม่, จำกัด | edge-first apps |
| **Jitsi** | Open source | ครบ, UI พร้อม | หนัก, ซับซ้อน | conference-style |

> **Recommended Default สำหรับคุณ `game`:** **LiveKit** (open source + cloud, SDK ดี, ฟรี self-host, modern) สำหรับ portfolio/indie; **mediasoup** ถ้าต้องการ performance สูงและควบคุมเต็มที่; **Twilio** ถ้ามีรายได้และไม่อยาก maintain

---

## 4. LiveKit — ตัวอย่าง (Web)

### 4.1 ติดตั้ง
```bash
npm install livekit-client
```

### 4.2 Client
```js
import { Room, RoomEvent } from 'livekit-client';

const room = new Room({
  adaptiveStream: true,        // ปรับ quality อัตโนมัติ
  dynacast: true,             // ส่งเฉพาะ track ที่จำเป็น
});

// เชื่อมต่อ (token ได้จาก server)
await room.connect('wss://your-livekit-server', token);

// เปิด mic
await room.localParticipant.setMicrophoneEnabled(true);

// รับ audio จาก peer
room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
  if (track.kind === 'audio') {
    const audio = new Audio();
    track.attach(audio);
    audio.play();
  }
});

// Mute
await room.localParticipant.setMicrophoneEnabled(false);
```

### 4.3 Server (Node.js) — สร้าง token
```js
import { AccessToken } from 'livekit-server-sdk';

const token = new AccessToken(apiKey, apiSecret, {
  identity: userId,
  ttl: '1h',
});
token.addGrant({ roomJoin: true, room: roomId });
const jwt = await token.toJwt();
// ส่ง jwt ให้ client
```

---

## 5. mediasoup — ตัวอย่าง (Node.js, Advanced)

### 5.1 Server
```js
const mediasoup = require('mediasoup');
const worker = await mediasoup.createWorker();
const router = await worker.createRouter({ mediaCodecs: [...] });
const transport = await router.createWebRtcTransport({ listenIps: [...] });
// client สร้าง producer (send audio) และ consumer (receive audio)
```

### 5.2 Client (mediasoup-client)
```js
import { Device } from 'mediasoup-client';
const device = new Device();
await device.load({ routerRtpCapabilities });
const transport = device.createSendTransport({ ... });
const producer = await transport.produce({ track: audioTrack });
```

> **WHY mediasoup ซับซ้อน:** ต้องจัดการ transport/producer/consumer เอง → ยืดหยุ่นสูงแต่ learning curve สูง; ใช้เมื่อต้องการ performance สูงหรือ custom logic

---

## 6. Simulcast (หลาย quality พร้อมกัน)

- **Simulcast** = ส่ง audio/video หลาย resolution/bitrate พร้อมกัน
- SFU เลือก forward quality ที่เหมาะกับ bandwidth ของผู้รับ
- **WHY:** ผู้เล่นบนมือถือได้ quality ต่ำ (ประหยัด bandwidth), ผู้เล่นบน PC ได้ quality สูง

```js
// LiveKit: เปิด simulcast
const room = new Room({
  adaptiveStream: true,  // auto-select quality
  dynacast: true,       // stop sending unused tracks
});
```

---

## 7. Scaling & Cost

| ระดับ | ผู้เล่นพร้อมกัน | วิธี | ต้นทุน |
|---|---|---|---|
| Small | < 50 | single SFU instance | ฟรี (self-host) |
| Medium | 50-500 | load balancer + multiple SFU | ปานกลาง |
| Large | 500+ | auto-scaling, region-based, managed (LiveKit Cloud/Twilio) | สูง |

- **Region-based:** deploy SFU ใน region ที่ใกล้ผู้เล่น
- **Cost optimization:** ใช้ simulcast + adaptive stream ลด bandwidth

---

## 8. Common Pitfalls

1. **เริ่มด้วย SFU ทันที** → over-engineering; P2P mesh พอสำหรับ party เล็ก
2. **ไม่มี adaptive stream** → ผู้เล่น bandwidth ต่ำ lag
3. **ไม่ cleanup connection** → memory leak, mic ค้าง
4. **ไม่มี TURN server** → connection failure บน NAT บางแบบ
5. **ไม่ monitor** → ไม่รู้ว่า server มีปัญหา
6. **ไม่ handle reconnect** → ผู้เล่นหลุดแล้วเข้าไม่ได้

## 9. Checklist สำหรับ SFU Voice Chat

- [ ] เลือก SFU platform (LiveKit/mediasoup/Janus)
- [ ] Server setup + token generation
- [ ] Client integration (connect, mic, track subscribe)
- [ ] Mute/deafen/push-to-talk
- [ ] Simulcast + adaptive stream
- [ ] Quality settings (ปิด/เปิด voice chat)
- [ ] TURN server (สำหรับ NAT ซับซ้อน)
- [ ] Cleanup + reconnect handling
- [ ] ทดสอบบนเครื่องสเปกต่ำ + เครือข่ายจริง
- [ ] (ถ้า Income) Cost monitoring + scaling plan

## 10. ทางเลือก (Alternatives)

| บริการ | จุดเด่น | จุดด้อย |
|---|---|---|
| **P2P Mesh (WebRTC)** | ฟรี, ง่าย | max 6 คน, bandwidth สูง |
| **LiveKit** | modern, SDK ดี, ฟรี self-host | ต้อง host หรือจ่าย cloud |
| **mediasoup** | performance สูง, flexible | learning curve |
| **Twilio Video** | managed, ง่าย | แพง |
| **Cloudflare Calls** | edge, low latency | ใหม่ |

> **Recommended Default:** P2P mesh สำหรับ party ≤ 6 คน (ฟรี, ง่าย); LiveKit สำหรับ > 6 คน หรือมือถือ; อย่า migrate ถ้า mesh ยังพอ (YAGNI)

## 11. แหล่งเรียนรู้

- LiveKit: https://docs.livekit.io/
- mediasoup: https://mediasoup.org/
- Janus: https://janus.conf.meetecho.com/
- WebRTC SFU concepts: https://webrtc.org/getting-started/peer-connections
- Cloudflare Calls: https://developers.cloudflare.com/calls/