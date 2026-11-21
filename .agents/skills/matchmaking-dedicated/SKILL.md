---
name: Matchmaking Dedicated
description: >-
  Dedicated-server matchmaking for web games: Colyseus, Photon, or custom Node.js game server.
  Covers authoritative rooms, skill-based matching, scaling, and when to migrate from Supabase
  Realtime. Use when a game needs competitive/authoritative multiplayer beyond Supabase Realtime.
---

# Matchmaking Dedicated — การจับคู่ด้วย Dedicated Game Server

> ใช้เมื่อเกมต้องการ **authoritative multiplayer** ที่ Supabase Realtime ไม่พอ (competitive, anti-cheat เข้ม, ผู้เล่นจำนวนมาก)
> โหลดสกิล `supabase` และ `supabase-matchmaking` ก่อน แล้วใช้สกิลนี้เมื่อต้อง migrate ไป dedicated server

---

## 1. เมื่อไหร่ควรใช้ Dedicated Server (WHY)

| เงื่อนไข | Supabase Realtime | Dedicated Server |
|---|---|---|
| ผู้เล่นพร้อมกัน ≤ 6 | ✅ | ไม่จำเป็น |
| Casual/co-op | ✅ | ไม่จำเป็น |
| Competitive/FPS (Valorant-style) | ❌ latency สูง | ✅ |
| Anti-cheat เข้ม (server-authoritative) | ⚠️ Edge Function ช้า | ✅ |
| ผู้เล่นพร้อมกัน > 50 | ❌ | ✅ |
| Custom physics/simulation | ❌ | ✅ |

> **Recommended Default:** เริ่มจาก Supabase Realtime สำหรับ portfolio/casual; migrate ไป dedicated server เมื่อเกมจริงจัง/รายได้ (BIG decision + ต้นทุนสูง)

---

## 2. ตัวเลือก Dedicated Server

| บริการ | ประเภท | จุดเด่น | จุดด้อย | เหมาะกับ |
|---|---|---|---|---|
| **Colyseus** | Open source (Node.js) | authoritative, rooms, matchmaking ในตัว, ฟรี | ต้อง host เอง | indie/portfolio, Node.js dev |
| **Photon** | Managed (PUN/Fusion) | ฮิต, Unity/Unreal, managed | ค่าใช้จ่าย, vendor lock-in | Unity/Unreal, commercial |
| **Nakama** | Open source (Go) | backend ครบ (auth, leaderboard, matchmaking) | ต้อง host, learning curve | indie ที่ต้องการ backend ครบ |
| **PlayFab** | Managed (Microsoft) | backend ครบ, analytics | ค่าใช้จ่าย, complexity | commercial, live ops |
| **AWS GameLift** | Managed | scaling อัตโนมัติ | แพง, ซับซ้อน | large-scale commercial |
| **Custom (Node + Socket.io)** | Self-built | ควบคุมเต็มที่ | ต้อง maintain ทุกอย่าง | learning, full control |

> **Recommended Default สำหรับคุณ `game`:** **Colyseus** สำหรับ portfolio/indie (Node.js, open source, ฟรี); **Photon** ถ้าใช้ Unity และต้องการ managed; **Nakama** ถ้าต้องการ backend ครบ (auth+leaderboard+matchmaking)

---

## 3. Colyseus — ตัวอย่าง (Node.js)

### 3.1 ติดตั้ง
```bash
npm init -y
npm install colyseus @colyseus/monitor
```

### 3.2 Server (index.js)
```js
const { Server, Room } = require('colyseus');
const http = require('http');

class GameRoom extends Room {
  onCreate(options) {
    this.setState({ players: {} });
    this.onMessage('move', (client, data) => {
      // server-authoritative: ตรวจสอบ + อัปเดต state
      this.state.players[client.sessionId].x = data.x;
      this.state.players[client.sessionId].y = data.y;
    });
  }
  onJoin(client, options) {
    this.state.players[client.sessionId] = { x: 0, y: 0 };
  }
  onLeave(client) {
    delete this.state.players[client.sessionId];
  }
}

const server = new Server({
  server: http.createServer(),
});
server.define('game', GameRoom);
server.listen(2567);
console.log('Colyseus listening on 2567');
```

### 3.3 Client (Web)
```js
import { Client } from 'colyseus.js';
const client = new Client('ws://localhost:2567');
const room = await client.joinOrCreate('game', { username: 'player1' });

room.onStateChange((state) => {
  renderPlayers(state.players);
});

room.send('move', { x: 100, y: 200 });
```

---

## 4. Matchmaking ด้วย Dedicated Server

### 4.1 Colyseus Matchmaking (built-in)
```js
// Server: filter ห้องตาม skill rating
server.define('ranked', GameRoom, {
  filterBy: ['mode', 'region'],
  sortOptions: { clients: -1 } // ห้องที่มีคนน้อยสุดก่อน
});

// Client: joinOrCreate จะหาห้องที่ match filter
const room = await client.joinOrCreate('ranked', {
  mode: 'classic', region: 'asia', rating: 1200
});
```

### 4.2 Custom Matchmaking (ELO-based)
- ใช้ Redis/DB เก็บ queue
- Edge/Server จับคู่ตาม rating ± range
- สร้าง room เมื่อมีผู้เล่นพอ (เช่น 4 คน)
- ถ้ารอเกิน 30s → ขยาย rating range

---

## 5. Server-Authoritative (Anti-Cheat)

- **Client ส่ง input** (ไม่ส่งผลลัพธ์) → Server คำนวณผล
- **Server ตรวจสอบ** movement speed, fire rate, damage
- **Client prediction** สำหรับ responsiveness → Server reconcile ภายหลัง
- **Reconciliation:** ถ้า client คาดเดาผิด → ดึงกลับ (snap to server position)

> **WHY server-authoritative:** ป้องกันโกง (client ไม่สามารถแก้ memory/network ได้) — จำเป็นสำหรับเกม competitive/รายได้

---

## 6. Scaling (สำหรับเกมที่เติบโต)

| ระดับ | ผู้เล่นพร้อมกัน | วิธี |
|---|---|---|
| Small | < 100 | single server |
| Medium | 100-1000 | load balancer + multiple instances |
| Large | 1000+ | auto-scaling (AWS GameLift, Kubernetes), region-based |

- **Region-based:** deploy server ใน region ที่ใกล้ผู้เล่น (Asia, EU, US)
- **Matchmaking cross-region:** จับคู่ภายใน region ก่อน ถ้ารอเกิน threshold → cross-region

---

## 7. Migration Path: Supabase → Dedicated

1. **Phase 1:** Supabase Realtime (casual, portfolio) — ใช้ Presence/Broadcast
2. **Phase 2:** เพิ่ม Edge Function สำหรับ anti-cheat (score validation)
3. **Phase 3:** Migrate ไป Colyseus/Photon สำหรับ competitive mode (BIG decision)
4. **Phase 4:** Hybrid: Supabase สำหรับ auth/leaderboard/save, Dedicated สำหรับ gameplay

> **WHY hybrid:** Supabase เก่ง auth/DB/leaderboard; Dedicated เก่ง real-time gameplay → ใช้จุดแข็งของแต่ละตัว

---

## 8. Common Pitfalls

1. **เริ่มด้วย dedicated server ทันที** → over-engineering; เริ่มจาก Supabase ก่อน
2. **ไม่มี server-authoritative** → โกงง่าย
3. **ไม่มี reconciliation** → client/server desync
4. **ไม่ scale** → server ล่มเมื่อมีผู้เล่นมาก
5. **ไม่มี region selection** → latency สูงสำหรับผู้เล่นไกล
6. **ไม่ monitor** → ไม่รู้ว่า server มีปัญหา (ใช้ Grafana/Prometheus)

## 9. Checklist ก่อน Migrate

- [ ] เกมมี competitive mode หรือผู้เล่น > 50 พร้อมกัน
- [ ] Supabase Realtime ไม่พอ (latency/anti-cheat)
- [ ] ได้อนุมัติจากคุณ `game` (BIG decision: ค่าใช้จ่าย/hosting)
- [ ] เลือก platform (Colyseus/Photon/Nakama)
- [ ] ออกแบบ server-authoritative logic
- [ ] วางแผน scaling + monitoring
- [ ] ทดสอบ latency บนเครื่องเป้าหมาย

## 10. ทางเลือก (Alternatives)

| บริการ | จุดเด่น | จุดด้อย |
|---|---|---|
| **Supabase Realtime** | ฟรี, integrated | ไม่เหมาะ competitive |
| **Colyseus** | open source, Node.js | ต้อง host |
| **Photon** | managed, Unity/Unreal | ค่าใช้จ่าย |
| **Nakama** | backend ครบ | learning curve |
| **AWS GameLift** | auto-scale | แพง, ซับซ้อน |

> **Recommended Default:** Colyseus สำหรับ portfolio/indie Node.js; Photon สำหรับ Unity commercial; อย่า migrate ถ้า Supabase Realtime ยังพอ (YAGNI)

## 11. แหล่งเรียนรู้

- Colyseus: https://colyseus.io/
- Photon: https://www.photonengine.com/
- Nakama: https://heroiclabs.com/nakama/
- GameLift: https://aws.amazon.com/gamelift/
- Netcode (Unity): https://docs.unity3d.com/Packages/com.unity.netcode.gameobjects@latest