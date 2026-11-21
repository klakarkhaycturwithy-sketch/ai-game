---
name: Supabase Matchmaking
description: >-
  Matchmaking and lobby system for web games using Supabase (presence, rooms, queue, ELO/rating).
  Covers lobby creation, join/leave, ready state, room lifecycle, matchmaking queue, and
  realtime sync. Use when adding multiplayer matchmaking or lobbies to a web game (HTML/JS).
---

# Supabase Matchmaking — ระบบจับคู่และห้อง (Lobby) สำหรับเกม Web

> ใช้เมื่อเกม multiplayer ต้องการ **lobby, matchmaking, ready state, room lifecycle**
> โหลดสกิล `supabase` และ reference `realtime-multiplayer` ก่อน แล้วใช้สกิลนี้เมื่อต้องทำ matchmaking/lobby

---

## 1. แนวคิด (WHY)

- **Lobby** = ห้องที่ผู้เล่นรวมตัวก่อนเริ่มเกม (เลือก map, mode, ready)
- **Matchmaking** = จับคู่ผู้เล่นอัตโนมัติตาม skill/rating/region
- **Pourquoi (WHY) ใช้ Supabase:** Presence + Broadcast + Database รวมกันทำ lobby ได้โดยไม่ต้องเขียน server เอง (เหมาะกับ indie/portfolio)

---

## 2. Lobby ด้วย Presence (Realtime)

### 2.1 สร้าง Lobby Room
```js
const lobbyChannel = supabase.channel('lobby-' + lobbyId, {
  config: { presence: { key: userId } }
});

lobbyChannel.on('presence', { event: 'sync' }, () => {
  const state = lobbyChannel.presenceState();
  // state = { userId: [{ username, ready, team, joinedAt }] }
  renderPlayerList(state);
  checkAllReady(state);
});

lobbyChannel.on('presence', { event: 'join' }, ({ newPresences }) => {
  showNotification(`${newPresences[0].username} joined`);
});

lobbyChannel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
  showNotification(`${leftPresences[0].username} left`);
});

lobbyChannel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await lobbyChannel.track({
      username, ready: false, team: null, joinedAt: Date.now()
    });
  }
});
```

### 2.2 Ready State
```js
async function setReady(ready) {
  await lobbyChannel.track({ username, ready, team: myTeam, joinedAt });
  // broadcast ready change ให้ทุกคนทราบ
  lobbyChannel.send({
    type: 'broadcast', event: 'ready-change',
    payload: { userId, ready }
  });
}

function checkAllReady(state) {
  const players = Object.values(state).flat();
  const allReady = players.length >= minPlayers && players.every(p => p.ready);
  if (allReady) enableStartButton();
}
```

### 2.3 เริ่มเกม (Host only)
```js
async function startGame() {
  // เฉพาะ host (ผู้สร้างห้อง) ที่กด start
  lobbyChannel.send({
    type: 'broadcast', event: 'game-start',
    payload: { roomId: lobbyId, map: selectedMap, mode: selectedMode }
  });
  // ทุก client รับ event → ไปหน้าเกม
}

lobbyChannel.on('broadcast', { event: 'game-start' }, ({ payload }) => {
  redirectToGame(payload.roomId, payload.map, payload.mode);
});
```

---

## 3. Room Lifecycle (Database)

### 3.1 Schema
```sql
create table rooms (
  id uuid primary key default gen_random_uuid(),
  name text,
  host_id uuid references auth.users(id),
  mode text default 'classic',
  map text,
  max_players int default 4,
  status text default 'waiting', -- waiting | playing | finished
  created_at timestamptz default now()
);

create table room_members (
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (room_id, user_id)
);

alter table rooms enable row level security;
alter table room_members enable row level security;

create policy "rooms readable by all" on rooms for select using (true);
create policy "host manages room" on rooms for all using (auth.uid() = host_id);
create policy "members readable by all" on room_members for select using (true);
create policy "users join rooms" on room_members for insert with check (auth.uid() = user_id);
create policy "users leave rooms" on room_members for delete using (auth.uid() = user_id);
```

### 3.2 สร้าง/เข้า/ออกจากห้อง
```js
// สร้างห้อง
const { data: room } = await supabase
  .from('rooms')
  .insert({ name: 'My Room', host_id: userId, mode: 'classic', max_players: 4 })
  .select().single();

// เข้าห้อง
await supabase.from('room_members').insert({ room_id: roomId, user_id: userId });

// ออกจากห้อง
await supabase.from('room_members').delete().eq('room_id', roomId).eq('user_id', userId);

// ลบห้องเมื่อ host ออก (หรือใช้ cron cleanup)
```

### 3.3 Cleanup ห้องร้าง
- ใช้ Supabase Edge Function + cron (pg_cron) ลบห้องที่ status='waiting' และไม่มี member เกิน 10 นาที
- หรือ client-side: host ส่ง heartbeat, ถ้าไม่มี heartbeat 5 นาที → ลบห้อง

---

## 4. Matchmaking Queue (Auto-match)

### 4.1 Schema
```sql
create table matchmaking_queue (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  mode text default 'classic',
  region text default 'asia',
  rating int default 1000,
  joined_at timestamptz default now()
);

alter table matchmaking_queue enable row level security;
create policy "users manage own queue" on matchmaking_queue for all using (auth.uid() = user_id);
```

### 4.2 เข้าคิว
```js
// เข้าคิว
await supabase.from('matchmaking_queue').insert({
  user_id: userId, mode: 'classic', region: 'asia', rating: myRating
});

// ฟังการ match (เมื่อมีห้องถูกสร้าง)
const matchChannel = supabase
  .channel('matchmaking')
  .on('postgres_changes', {
    event: 'INSERT', schema: 'public', table: 'rooms',
    filter: `mode=eq.classic`
  }, (payload) => {
    // ตรวจสอบว่า room นี้ match กับเรา (rating ใกล้เคียง, region เดียวกัน)
    if (isMatch(payload.new, myProfile)) {
      joinRoom(payload.new.id);
    }
  })
  .subscribe();
```

### 4.3 Matchmaking Logic (Edge Function)
สำหรับ matchmaking จริงจัง ใช้ Edge Function จับคู่:
```ts
// supabase/functions/matchmake/index.ts
serve(async (req) => {
  const { mode, region, rating } = await req.json();
  // 1) ดึง queue ที่รอ (rating ใกล้เคียง ±200)
  // 2) ถ้ามีผู้เล่นพอ (เช่น 4 คน) → สร้าง room + ลบออกจาก queue
  // 3) return roomId
  // 4) ถ้ายังไม่พอ → return { status: 'waiting' }
});
```

> **WHY Edge Function:** Matchmaking logic ต้องรันบน server (ป้องกันโกง + จับคู่ได้แม่นยำ) — client ไม่ควรสร้าง room เอง

---

## 5. Matchmaking Algorithms

| Algorithm | ใช้เมื่อ | จุดเด่น | จุดด้อย |
|---|---|---|---|
| **FIFO (First In First Out)** | casual game | ง่าย, ยุติธรรม | อาจจับคู่ skill ไม่เท่ากัน |
| **ELO/Skill-based** | competitive | สมดุล | ต้องมี rating data |
| **Region-based** | multiplayer ทั่วโลก | latency ต่ำ | คิวยาวถ้า region เล็ก |
| **Hybrid (Skill + Region + Time)** | เกมจริงจัง | ดีที่สุด | ซับซ้อน |

> **Recommended Default:** FIFO สำหรับ portfolio/casual; ELO-based สำหรับ competitive (BIG decision: ต้องมี rating system + ข้อมูลผู้เล่น)

---

## 6. Lobby UI (UX/UI Design)

- **Player list** พร้อม avatar, username, ready status
- **Ready button** (toggle)
- **Chat** (text) ใน lobby
- **Map/mode selector** (host only)
- **Countdown** เมื่อทุกคน ready
- **Loading state** ขณะรอผู้เล่น

> **WHY countdown:** ให้เวลาผู้เล่นเตรียมตัว + ลดปัญหา "กด ready แล้วเริ่มทันที" ที่ทำให้ lag

---

## 7. Common Pitfalls

1. **ไม่ cleanup presence** → ผู้เล่น "ผี" ค้างใน lobby
2. **Race condition ในการสร้าง room** → ห้องซ้ำ; ใช้ transaction/unique constraint
3. **ไม่ handle disconnect** → ห้องค้าง; ใช้ heartbeat + cleanup
4. **ไม่มี min/max players** → เกมเริ่มด้วยผู้เล่นไม่พอ
5. **Matchmaking ไม่มี timeout** → ผู้เล่นรอไม่รู้จบ; ตั้ง timeout 30-60s
6. **ไม่ sync ready state** → UI ไม่อัปเดต

## 8. Checklist สำหรับ Lobby/Matchmaking

- [ ] Lobby สร้าง/เข้า/ออกจากห้องได้
- [ ] Presence sync (join/leave/ready)
- [ ] Ready state + all-ready check
- [ ] Host start game + broadcast
- [ ] Room cleanup (ร้าง/disconnect)
- [ ] Matchmaking queue + timeout
- [ ] (ถ้า competitive) ELO rating + skill-based matching
- [ ] ทดสอบ reconnect + disconnect

## 9. ทางเลือก (Alternatives)

| บริการ | จุดเด่น | จุดด้อย |
|---|---|---|
| **Supabase (Presence+DB)** | integrated, ฟรี tier | ต้องเขียน logic เอง |
| **Colyseus** | game server ครบ, authoritative | ต้อง host server |
| **Photon** | managed, ฮิตในเกม | ค่าใช้จ่าย, vendor lock-in |
| **PlayFab** | backend ครบ (auth, matchmaking, economy) | overkill, ค่าใช้จ่าย |

> **Recommended Default:** Supabase สำหรับ portfolio/casual lobby; Colyseus/Photon สำหรับเกม competitive จริงจัง (BIG decision)