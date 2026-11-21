---
name: Supabase for Game Dev
description: >-
  Supabase backend knowledge for Game Dev Partner ("game"): Auth, Database (leaderboard/save data),
  Storage (assets), Realtime (multiplayer/chat), Edge Functions, RLS security, and env handling.
  Use when designing or implementing online features, player accounts, leaderboards, cloud saves,
  or any backend for a web game (HTML/JS/Canvas). Web First, beginner-friendly, with WHY explanations.
---

# Supabase for Game Dev — ความรู้ Backend สำหรับเกม Web ของคุณ "game"

> ใช้สกิลนี้เมื่องานเกี่ยวข้องกับ **ระบบออนไลน์/บัญชีผู้เล่น/leaderboard/เซฟบนคลาวด์/multiplayer** สำหรับเกม Web (`HTML/JS/CSS — Canvas/WebGL`)
> สกิลนี้เป็น **ความรู้ (Knowledge Skill)** ไม่ได้ติดตั้งแพ็กเกจหรือเชื่อมต่อ Supabase จริง — การเชื่อมต่อจริงต้องได้รับอนุมัติจากคุณ `game` ก่อน (เรื่องระดับ **BIG**: ระบบออนไลน์/ค่าใช้จ่าย)

---

## 1. Supabase คืออะไร และทำไมเหมาะกับเกม Web (WHY)

- **Supabase** = Backend-as-a-Service (BaaS) แบบ Open Source ที่ให้ **PostgreSQL database + Auth + Storage + Realtime + Edge Functions** ในที่เดียว
- **Pourquoi (WHY) เหมาะกับเกม Web:**
  - ไม่ต้องสร้าง server เอง (คุณ `game` เป็นนักศึกษา solo → ประหยัดเวลา)
  - มี **Client SDK สำหรับ JavaScript** (`@supabase/supabase-js`) ใช้ได้ทันทีในเบราว์เซอร์
  - **Realtime** ทำ multiplayer/chat/leaderboard live ได้ง่าย
  - **Row Level Security (RLS)** ป้องกันข้อมูลผู้เล่นโดยไม่ต้องเขียน middleware
  - ฟรี tier เพียงพอสำหรับ prototype/portfolio
- **ข้อควรระวัง (BIG decision):** การใช้ Supabase จริง = ระบบออนไลน์ + ค่าใช้จ่าย + ความเป็นส่วนตัวของข้อมูลผู้เล่น → ต้องถามคุณ `game` และอธิบายตัวเลือกก่อน (Firebase / Supabase / เซิร์ฟเวอร์เอง)

---

## 2. โครงสร้างโปรเจกต์ Supabase (Project Setup)

### 2.1 สร้างโปรเจกต์
1. ไปที่ https://supabase.com → New Project → ตั้งชื่อ + รหัสผ่าน DB + region (เลือกใกล้ผู้เล่น)
2. รอโปรเจกต์พร้อม (~2 นาที)
3. ไปที่ **Project Settings → API** เพื่อเอา:
   - `Project URL` (เช่น `https://xxxx.supabase.co`)
   - `anon public key` (ใช้ใน frontend ได้ — ปลอดภัยเพราะมี RLS)
   - `service_role key` (ห้ามใส่ใน frontend! ใช้เฉพาะ server/Edge Functions)

### 2.2 ติดตั้ง Client (Web)
```html
<!-- แบบ CDN (ง่ายสุดสำหรับเกม Web) -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```
```js
// สร้าง client (ค่าคงที่แยกไฟล์ config)
const SUPABASE_URL = 'https://xxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJ...'; // anon public key เท่านั้น
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```
> **WHY แยก config:** ตามมาตรฐานโปรเจกต์ แยก `Config/Constants` ออกจาก `Logic` เพื่อเปลี่ยนค่าได้ง่ายและไม่ hardcode ใน logic

### 2.3 Environment Variables (ความปลอดภัย)
- ห้าม hardcode `service_role key` หรือ secret ในโค้ด frontend
- ใช้ `anon key` ใน frontend (ปลอดภัยเพราะ RLS)
- สำหรับ production: ใช้ build tool (Vite/Webpack) อ่านจาก `.env` และไม่ commit `.env` ลง git
- **สำหรับเกมนักศึกษา:** ใช้ CDN + anon key + RLS เข้มงวด พอสำหรับ portfolio

---

## 3. Authentication (บัญชีผู้เล่น)

### 3.1 วิธีที่เหมาะกับเกม
| วิธี | เหมาะกับ | หมายเหตุ |
|---|---|---|
| **Anonymous (Guest)** | เกมที่ไม่ต้องสมัคร | สร้าง session อัตโนมัติ, เซฟได้, แต่ถ้าเคลียร์เบราว์เซอร์จะหาย |
| **Email/Password** | เซฟถาวร + leaderboard | มาตรฐาน, ต้องยืนยันอีเมล |
| **OAuth (Google/Discord/GitHub)** | ลด friction, เหมาะกับเกมเมอร์ | Discord ฮิตในชุมชนเกม |
| **Magic Link** | ไม่อยากจำรหัสผ่าน | ส่งลิงก์ทางอีเมล |

### 3.2 ตัวอย่าง (Anonymous + Email)
```js
// Guest login (anonymous)
const { data, error } = await supabase.auth.signInAnonymously();

// Email signup
const { data, error } = await supabase.auth.signUp({
  email: 'player@example.com',
  password: 'strong-password',
});

// Listen to auth state (สำคัญ: อัปเดต UI เมื่อ login/logout)
supabase.auth.onAuthStateChange((event, session) => {
  if (session) { /* ผู้เล่น login แล้ว → โหลดข้อมูล */ }
  else { /* ยังไม่ login → แสดงหน้า login */ }
});
```
> **WHY onAuthStateChange:** เพื่อให้ UI ตอบสนองเมื่อ session เปลี่ยน (เช่น รีเฟรชหน้า) โดยไม่ต้อง reload ทั้งหน้า

---

## 4. Database (PostgreSQL) — Leaderboard & Save Data

### 4.1 ออกแบบตาราง (Schema)
```sql
-- profiles: ข้อมูลผู้เล่น
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz default now()
);

-- scores: leaderboard
create table scores (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  score int not null,
  mode text default 'classic',
  created_at timestamptz default now()
);

-- saves: เซฟเกม (versioned)
create table saves (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  slot int default 1,
  data jsonb not null,        -- เก็บ state ทั้งก้อนเป็น JSON
  version int default 1,     -- versioned save data
  updated_at timestamptz default now()
);
```
> **WHY jsonb สำหรับเซฟ:** โครงสร้างเซฟเปลี่ยนบ่อย → ใช้ JSON ยืดหยุ่น, พร้อม `version` เพื่อ migrate เก่า→ใหม่ (ตามมาตรฐาน Versioned Save Data)

### 4.2 Query พื้นฐาน (JavaScript)
```js
// Top 10 leaderboard
const { data, error } = await supabase
  .from('scores')
  .select('score, profiles(username)')
  .order('score', { ascending: false })
  .limit(10);

// Insert score
const { error } = await supabase.from('scores').insert({ score: 1200, mode: 'classic' });

// Upsert save (slot 1)
const { error } = await supabase.from('saves').upsert(
  { user_id: uid, slot: 1, data: gameState, version: 2 },
  { onConflict: 'user_id,slot' }
);

// Load save
const { data } = await supabase.from('saves').select('data, version').eq('slot', 1).single();
```

### 4.3 Index & Performance
- ใส่ index บน `scores(score desc)` และ `saves(user_id, slot)` เพื่อ query เร็ว
- ใช้ `limit` เสมอเมื่อดึง leaderboard (อย่าดึงทั้งตาราง)
- **WHY:** เกมต้อง 60 FPS; query หนักทำให้ UI ค้าง → ทำใน background + cache

---

## 5. Storage (ไฟล์/รูป/เสียง)

```js
// Upload avatar
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file, { upsert: true });

// Get public URL
const { data } = supabase.storage.from('avatars').getPublicUrl(`${userId}/avatar.png`);
```
- ใช้สำหรับ: avatar ผู้เล่น, user-generated content, replay files
- ตั้ง bucket เป็น **public** (อ่านได้ทุกคน) หรือ **private** (ต้อง signed URL)
- **WHY private สำหรับ replay/เซฟ:** ป้องกันคนอื่นเข้าถึงข้อมูลผู้เล่น (ความเป็นส่วนตัว)

---

## 6. Realtime (Multiplayer / Chat / Live Leaderboard)

```js
// Subscribe to new scores (live leaderboard)
const channel = supabase
  .channel('scores-live')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scores' }, (payload) => {
    console.log('New score:', payload.new);
    // อัปเดต UI leaderboard
  })
  .subscribe();

// Presence (ใครออนไลน์)
const presence = supabase.channel('lobby');
presence.on('presence', { event: 'sync' }, () => {
  const state = presence.presenceState();
  // แสดงรายชื่อผู้เล่นออนไลน์
});
presence.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') await presence.track({ user: username });
});

// Cleanup เมื่อออกจากหน้า
supabase.removeChannel(channel);
```
> **WHY cleanup:** ป้องกัน memory leak และ connection ค้าง (สำคัญสำหรับเกมที่เปลี่ยนหน้าบ่อย)

### ข้อควรระวัง Realtime
- Realtime ใช้ WebSocket → หนักบนมือถือ/เครื่องสเปกต่ำ → ให้มี **Quality Settings** ปิด/เปิดได้
- อย่าส่ง state ทั้งหมดทุกเฟรม → ส่งเฉพาะ delta (การเปลี่ยนแปลง)
- สำหรับเกม FPS จริงจัง (Valorant-style) Supabase Realtime อาจ latency สูง → พิจารณา dedicated game server (Colyseus/Photon) แทน (BIG decision)

---

## 7. Edge Functions (Server Logic ที่ปลอดภัย)

- ใช้เมื่อต้องรันโค้ดบน server (เช่น ตรวจสอบ score ไม่โกง, ให้รางวัล, webhook)
- เขียนด้วย Deno/TypeScript, deploy ผ่าน Supabase CLI หรือ Dashboard
```ts
// supabase/functions/validate-score/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
serve(async (req) => {
  const { score, userId } = await req.json();
  // ตรวจสอบความเป็นไปได้ของ score (anti-cheat)
  if (score > MAX_POSSIBLE) return new Response('invalid', { status: 400 });
  // insert ด้วย service_role (ปลอดภัยเพราะรันบน server)
  return new Response(JSON.stringify({ ok: true }));
});
```
- เรียกจาก client: `supabase.functions.invoke('validate-score', { body: { score, userId } })`
- **WHY ใช้ Edge Function สำหรับ score:** ป้องกันโกง (client ไม่ควร insert score โดยตรงถ้าเกมจริงจัง)

---

## 8. Row Level Security (RLS) — หัวใจความปลอดภัย

- **เปิด RLS ทุกตาราง** (default deny) → ผู้เล่นเห็น/แก้ได้เฉพาะข้อมูลของตัวเอง
```sql
alter table scores enable row level security;

-- ทุกคนอ่าน leaderboard ได้
create policy "scores are viewable by everyone"
  on scores for select using (true);

-- แทรกได้เฉพาะของตัวเอง
create policy "users insert own scores"
  on scores for insert with check (auth.uid() = user_id);

-- เซฟ: อ่าน/แก้ได้เฉพาะของตัวเอง
create policy "users manage own saves"
  on saves for all using (auth.uid() = user_id);
```
> **WHY RLS:** ป้องกันผู้เล่น A แก้ไขข้อมูลผู้เล่น B โดยไม่ต้องเขียน backend middleware — ทำให้เกม Web (client-only) ปลอดภัยพอสำหรับ portfolio

### Checklist ความปลอดภัยก่อนปล่อยเกม
- [ ] RLS เปิดทุกตาราง
- [ ] ไม่มี `service_role key` ใน frontend
- [ ] `anon key` ใช้ได้เฉพาะสิ่งที่ RLS อนุญาต
- [ ] ตรวจสอบ policy ด้วย SQL: `select * from pg_policies;`

---

## 9. การเชื่อมโยงกับ Game Dev Partner Pipeline

- **Stage 3 (Task Delegation / Game Designer):** ถ้าเกมต้องการ online → ระบุใน checklist ว่า "ต้องใช้ Supabase (Auth/DB/Realtime)" และถามคุณ `game` ว่าเป้าหมาย #1 คืออะไร (Portfolio → ใช้ Supabase showcase; Income → พิจารณาค่าใช้จ่าย/scaling)
- **Stage 4 (Frontend/Backend):** แยก `supabaseClient.js` (config) ออกจาก `auth.js`, `leaderboard.js`, `saveSystem.js` (logic); ใช้ Versioned Save Data
- **Stage 5 (UX/UI):** หน้า Login, Profile, Leaderboard; loading states; error messages ภาษาไทย friendly
- **Stage 6 (Bug Testing):** ทดสอบ offline (ไม่มีเน็ต), token expired, RLS deny cases
- **Stage 7 (Final QA):** ตรวจสอบความปลอดภัย (RLS, keys) ก่อนปล่อย

---

## 10. Common Pitfalls (ข้อผิดพลาดที่พบบ่อย)

1. **ลืมเปิด RLS** → ข้อมูลทั้งตารางเปิดให้ทุกคน → หายนะ
2. **ใช้ service_role key ใน frontend** → ใครก็แก้ DB ได้
3. **ไม่ handle auth state** → UI ไม่อัปเดตเมื่อ session หมดอายุ
4. **Query ไม่มี limit** → โหลดช้า/ค้าง
5. **Realtime ไม่ cleanup** → memory leak
6. **ไม่มี version ใน save data** → migrate ไม่ได้เมื่อ schema เปลี่ยน
7. **ไม่ทดสอบ offline** → เกมพังเมื่อไม่มีเน็ต

---

## 11. ทางเลือก (Alternatives) — ให้คุณ `game` เลือก

| บริการ | จุดเด่น | จุดด้อย |
|---|---|---|
| **Supabase** | Open source, PostgreSQL, RLS, Realtime | ต้องเรียนรู้ SQL/RLS |
| **Firebase** | เอกสารเยอะ, Realtime DB ง่าย | Vendor lock-in, NoSQL |
| **PocketBase** | Single binary, self-host, ง่าย | Community เล็กกว่า |
| **เซิร์ฟเวอร์เอง (Node + DB)** | ควบคุมเต็มที่ | ต้อง maintain |

> **Recommended Default สำหรับคุณ `game`:** เริ่มจาก **Supabase** (ฟรี tier + RLS + Realtime) สำหรับ portfolio; ถ้าเกมจริงจัง/รายได้ ค่อยประเมิน scaling/cost

---

## 11.5 เอกสารอ้างอิงเฉพาะด้าน (Skill References)

สกิลนี้มีคู่มือเฉพาะด้านในโฟลเดอร์ `references/` — โหลดเมื่องานเกี่ยวข้อง:

- **`references/realtime-multiplayer.md`** — Multiplayer/Chat/Presence ด้วย Supabase Realtime (Broadcast, Presence, Postgres Changes, interpolation, anti-cheat เบื้องต้น, alternatives)
- **`references/anti-cheat.md`** — การป้องกันโกง (Edge Function validate score, RLS, audit log, checklist)
- **`references/auth-patterns.md`** — รูปแบบ Auth (Guest, Email, OAuth Discord/Google, Guest→Upgrade, profile trigger, session management)

> ใช้ `@supabase` เพื่อโหลดสกิลหลัก แล้วอ่าน reference ที่เกี่ยวข้องเมื่อต้องทำ realtime/anti-cheat/auth

## 12. แหล่งเรียนรู้ (References)

- Supabase Docs: https://supabase.com/docs
- JS Client: https://supabase.com/docs/reference/javascript
- Auth: https://supabase.com/docs/guides/auth
- Database: https://supabase.com/docs/guides/database
- Storage: https://supabase.com/docs/guides/storage
- Realtime: https://supabase.com/docs/guides/realtime
- Edge Functions: https://supabase.com/docs/guides/functions
- RLS: https://supabase.com/docs/guides/auth/row-level-security

> อัปเดตความรู้นี้เมื่อ Supabase มีการเปลี่ยนแปลงสำคัญ (ตรวจสอบ version ของ `@supabase/supabase-js`)