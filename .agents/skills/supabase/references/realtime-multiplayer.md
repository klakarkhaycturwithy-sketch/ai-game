# Supabase Realtime Multiplayer — คู่มือทำ Multiplayer/Chat ด้วย Supabase Realtime

> ใช้เมื่อเกมต้องการ **multiplayer, chat, presence, live leaderboard** ผ่าน Supabase Realtime (WebSocket)
> โหลดสกิลหลัก `supabase` ก่อน แล้วอ่านไฟล์นี้เมื่อต้องทำ realtime

## 1. ประเภท Realtime ที่ Supabase ให้

| ประเภท | ใช้ทำ | ตัวอย่างเกม |
|---|---|---|
| **Postgres Changes** | ฟังการเปลี่ยนแปลงในตาราง (INSERT/UPDATE/DELETE) | Live leaderboard, chat messages |
| **Broadcast** | ส่งข้อความระหว่าง client โดยไม่บันทึก DB | ตำแหน่งผู้เล่น, input, voice chat signaling |
| **Presence** | ติดตามใครออนไลน์ (state sync) | รายชื่อผู้เล่นในห้อง, lobby |

## 2. Broadcast — ส่งตำแหน่งผู้เล่น (Game State Sync)

```js
const channel = supabase.channel('room-1', {
  config: { broadcast: { self: false } } // ไม่รับข้อความของตัวเอง
});

// ส่งตำแหน่ง (ส่งเฉพาะ delta, ไม่ส่ง state ทั้งก้อน)
function sendPosition(x, y, vx, vy) {
  channel.send({
    type: 'broadcast',
    event: 'pos',
    payload: { id: myId, x, y, vx, vy, t: Date.now() }
  });
}

// รับตำแหน่ง
channel.on('broadcast', { event: 'pos' }, ({ payload }) => {
  // interpolate ตำแหน่งผู้เล่นอื่น (lerp) เพื่อลด jitter
  remotePlayers[payload.id] = { ...payload };
});

channel.subscribe();
```

### หลักการ Sync ที่ดี (WHY)
- **ส่งเฉพาะ delta** (การเปลี่ยนแปลง) ไม่ส่ง state ทั้งก้อน → ประหยัด bandwidth
- **Interpolation (lerp)** ระหว่าง snapshot → ลด jitter/กระตุก
- **Tick rate ต่ำ** (10-20 Hz) สำหรับตำแหน่ง; **event-based** สำหรับ action (ยิง, เก็บไอเทม)
- **Client-side prediction** สำหรับผู้เล่นตัวเอง → responsive; server/peer reconcile ภายหลัง

## 3. Presence — ใครออนไลน์

```js
const room = supabase.channel('lobby', {
  config: { presence: { key: userId } }
});

room.on('presence', { event: 'sync' }, () => {
  const state = room.presenceState();
  // state = { userId: [{ username, x, y, ... }] }
  updatePlayerList(state);
});

room.on('presence', { event: 'join' }, ({ key, newPresences }) => {
  console.log('joined:', key, newPresences);
});
room.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
  console.log('left:', key, leftPresences);
});

room.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await room.track({ username, x: 0, y: 0, joinedAt: Date.now() });
  }
});

// อัปเดต state (เช่น เปลี่ยนตำแหน่ง) → track อีกครั้ง
room.track({ username, x: newX, y: newY });
```

## 4. Postgres Changes — Live Leaderboard / Chat

```js
// Live leaderboard (ฟัง INSERT ใหม่)
const lb = supabase
  .channel('scores-live')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scores' }, (payload) => {
    prependToLeaderboard(payload.new);
  })
  .subscribe();

// Chat messages
const chat = supabase
  .channel('chat-room-1')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'room_id=eq.1' }, (payload) => {
    appendMessage(payload.new);
  })
  .subscribe();
```

## 5. ห้อง (Rooms) & การจัดการ

- สร้าง channel ต่อห้อง: `supabase.channel('room-' + roomId)`
- **Cleanup เมื่อออกจากห้อง/หน้า:** `supabase.removeChannel(channel)` (ป้องกัน memory leak + connection ค้าง)
- **Reconnect:** Supabase client reconnect อัตโนมัติ; ฟัง `channel.subscribe((status) => ...)` เพื่อ re-track presence
- **Heartbeat:** Presence มี heartbeat อัตโนมัติ (~25s) — อย่า track ถี่เกินไป

## 6. ข้อจำกัด & Performance (สำคัญสำหรับเกม)

| ข้อจำกัด | ผลกระทบ | ทางแก้ |
|---|---|---|
| Latency ~50-150ms | ไม่เหมาะกับ FPS จริงจัง (Valorant-style) | ใช้ dedicated game server (Colyseus/Photon) สำหรับ competitive |
| Broadcast ไม่ persistent | ถ้า client หลุด จะหาย | ใช้ Postgres Changes สำหรับข้อมูลสำคัญ |
| Connection limit (free tier) | ผู้เล่นพร้อมกันจำกัด | อัปเกรด plan หรือใช้ dedicated server |
| Bandwidth | ส่ง state ถี่ → หนัก | ลด tick rate, ส่ง delta, ใช้ binary (ArrayBuffer) ถ้าจำเป็น |

## 7. Anti-Cheat ใน Multiplayer (เบื้องต้น)

- **อย่าเชื่อ client** สำหรับ score/ผลลัพธ์สำคัญ → ใช้ Edge Function ตรวจสอบ
- **Server-authoritative** สำหรับ action สำคัญ (ยิงโดน, เก็บไอเทม) → client ส่ง input, server คำนวณผล
- **Rate limiting** บน broadcast (ป้องกัน spam)
- **Validate payload** ใน Edge Function (schema, range, type)

## 8. Checklist สำหรับเกม Multiplayer

- [ ] เลือกประเภท Realtime ให้เหมาะ (Broadcast/Presence/Postgres Changes)
- [ ] Tick rate เหมาะสม (10-20 Hz สำหรับตำแหน่ง)
- [ ] Interpolation + client prediction
- [ ] Cleanup channel เมื่อออกจากหน้า
- [ ] Reconnect + re-track presence
- [ ] Anti-cheat สำหรับ action สำคัญ
- [ ] Quality Settings ปิด/เปิด realtime ได้ (เครื่องสเปกต่ำ)
- [ ] ทดสอบ latency บนเครื่องเป้าหมาย

## 9. Alternatives เมื่อ Supabase Realtime ไม่พอ

| บริการ | เหมาะกับ |
|---|---|
| **Colyseus** | Node.js game server, authoritative, open source |
| **Photon** | Unity/Unreal, managed, ฮิตในเกม |
| **Socket.io + Node** | Custom, เต็มที่แต่ต้อง maintain |
| **WebRTC (PeerJS)** | P2P, latency ต่ำ แต่ NAT traversal |

> **Recommended Default:** เริ่มจาก Supabase Realtime สำหรับ casual/co-op/portfolio; ถ้าเกม competitive จริงจัง ค่อย migrate ไป Colyseus/Photon (BIG decision)