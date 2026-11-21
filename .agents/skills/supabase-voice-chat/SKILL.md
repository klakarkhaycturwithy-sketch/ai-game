---
name: Supabase Voice Chat
description: >-
  Realtime voice chat for web games using WebRTC with Supabase Realtime as signaling server.
  Covers peer connections, signaling (offer/answer/ICE), audio capture, mute/deafen, push-to-talk,
  and quality settings. Use when adding voice chat to a multiplayer web game (HTML/JS).
---

# Supabase Voice Chat — เสียงสนทนาแบบ Realtime สำหรับเกม Web

> ใช้เมื่อเกม multiplayer ต้องการ **voice chat** โดยใช้ Supabase Realtime เป็น signaling server + WebRTC สำหรับ audio stream
> โหลดสกิล `supabase` และ `supabase-realtime` (reference) ก่อน แล้วใช้สกิลนี้เมื่อต้องทำ voice chat

---

## 1. สถาปัตยกรรม (WHY)

- **WebRTC** ส่ง audio แบบ peer-to-peer → latency ต่ำ, ไม่ผ่าน server (ประหยัด bandwidth/cost)
- **Supabase Realtime (Broadcast)** ใช้เป็น **signaling server** (แลกเปลี่ยน offer/answer/ICE candidates) — ไม่ส่ง audio ผ่าน Supabase
- **Pourquoi (WHY) ไม่ส่ง audio ผ่าน Supabase:** Supabase Realtime ไม่รองรับ media stream; WebRTC ออกแบบมาสำหรับ real-time media โดยเฉพาะ

### องค์ประกอบ
```
Player A ──(WebRTC audio)──► Player B
   │                              │
   └──(signaling via Supabase)────┘
```

---

## 2. ขั้นตอน Signaling (Offer/Answer/ICE)

### 2.1 สร้าง Peer Connection
```js
const pc = new RTCPeerConnection({
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // STUN server ฟรี
});

// รับ audio จาก peer
pc.ontrack = (event) => {
  const audio = new Audio();
  audio.srcObject = event.streams[0];
  audio.play();
};

// ส่ง ICE candidates ผ่าน Supabase
pc.onicecandidate = (event) => {
  if (event.candidate) {
    channel.send({
      type: 'broadcast',
      event: 'ice',
      payload: { from: myId, to: peerId, candidate: event.candidate }
    });
  }
};
```

### 2.2 จับ Microphone
```js
async function startMic() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream.getTracks().forEach(track => pc.addTrack(track, stream));
  localStream = stream;
  return stream;
}
```

### 2.3 Signaling Flow (ผ่าน Supabase channel)
```js
const channel = supabase.channel('voice-room-' + roomId);

// Caller: สร้าง offer
async function callPeer(peerId) {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  channel.send({
    type: 'broadcast',
    event: 'offer',
    payload: { from: myId, to: peerId, sdp: offer }
  });
}

// Callee: รับ offer → สร้าง answer
channel.on('broadcast', { event: 'offer' }, async ({ payload }) => {
  if (payload.to !== myId) return;
  await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  channel.send({
    type: 'broadcast',
    event: 'answer',
    payload: { from: myId, to: payload.from, sdp: answer }
  });
});

// Caller: รับ answer
channel.on('broadcast', { event: 'answer' }, async ({ payload }) => {
  if (payload.to !== myId) return;
  await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
});

// ทั้งสองฝ่าย: รับ ICE
channel.on('broadcast', { event: 'ice' }, async ({ payload }) => {
  if (payload.to !== myId) return;
  await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
});

channel.subscribe();
```

---

## 3. Mute / Deafen / Push-to-Talk

```js
// Mute (ปิด mic แต่ยังได้ยิน)
function toggleMute() {
  localStream.getAudioTracks().forEach(t => t.enabled = !t.enabled);
  isMuted = !isMuted;
}

// Deafen (ปิดเสียงทั้งหมด)
function toggleDeafen() {
  document.querySelectorAll('audio').forEach(a => a.muted = !a.muted);
  isDeafened = !isDeafened;
}

// Push-to-talk (กด space เพื่อพูด)
let pttActive = false;
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !pttActive) {
    pttActive = true;
    localStream.getAudioTracks().forEach(t => t.enabled = true);
  }
});
window.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    pttActive = false;
    localStream.getAudioTracks().forEach(t => t.enabled = false);
  }
});
```

---

## 4. Quality Settings (สำคัญสำหรับเกม)

```js
// ลด bandwidth สำหรับเครื่องสเปกต่ำ
const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    channelCount: 1,        // mono (ประหยัด bandwidth)
    sampleRate: 24000,     // ลด sample rate
  }
});
```

- มี **Quality Settings** ปิด/เปิด voice chat ได้
- **Push-to-talk** ดีกว่า always-on สำหรับเครื่องสเปกต่ำ (ลด bandwidth)
- จำกัดจำนวน peer ต่อห้อง (mesh topology: ~4-6 คน max; มากกว่านั้นใช้ SFU)

---

## 5. Topology (Mesh vs SFU)

| ประเภท | เหมาะกับ | ข้อดี | ข้อเสีย |
|---|---|---|---|
| **Mesh (P2P)** | 2-6 คน | ง่าย, ไม่ต้อง server | bandwidth ผู้เล่น = (n-1) streams |
| **SFU (Selective Forwarding Unit)** | 6+ คน | ประหยัด bandwidth ผู้เล่น | ต้องมี server (mediasoup, Janus) |

> **Recommended Default สำหรับคุณ `game`:** Mesh (P2P) สำหรับ party ขนาดเล็ก (2-6 คน) ใน portfolio; SFU เฉพาะเมื่อเกมต้องการ lobby ใหญ่ (BIG decision + ต้นทุน)

---

## 6. Common Pitfalls

1. **ไม่ cleanup PeerConnection** → memory leak, mic ค้าง
2. **ไม่ handle ICE failure** → connection ไม่สำเร็จ (ต้องมี TURN server สำหรับ NAT บางแบบ)
3. **ไม่ปิด mic เมื่อออกห้อง** → mic ค้าง, privacy issue
4. **ไม่มี permission handling** → getUserMedia reject ต้อง handle error
5. **ไม่มี quality settings** → เครื่องสเปกต่ำ lag
6. **ไม่ sync mute state ให้ peer รู้** → peer ไม่รู้ว่าเรา mute

## 7. TURN Server (เมื่อ STUN ไม่พอ)

- STUN ฟรี (Google) ใช้ได้ ~80% ของกรณี
- กรณี NAT ซับซ้อน (symmetric NAT) → ต้องใช้ TURN server
- ตัวเลือก: Twilio (ฟรี tier), Cloudflare Calls, coturn (self-host)
- **Recommended Default:** เริ่มจาก STUN ฟรี; เพิ่ม TURN เมื่อพบ connection failure จริง

## 8. Checklist สำหรับ Voice Chat

- [ ] getUserMedia permission handling
- [ ] Signaling ผ่าน Supabase Broadcast
- [ ] PeerConnection cleanup เมื่อออกห้อง
- [ ] Mute/deafen/push-to-talk
- [ ] Quality settings (sample rate, channel count)
- [ ] Mute state sync ให้ peer
- [ ] ทดสอบบนเครื่องสเปกต่ำ + เครือข่ายจริง
- [ ] (ถ้า Income) TURN server + privacy policy

## 9. แหล่งเรียนรู้

- WebRTC API: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
- Supabase Realtime: https://supabase.com/docs/guides/realtime
- simple-peer (library ช่วย): https://github.com/feross/simple-peer
- PeerJS: https://peerjs.com/