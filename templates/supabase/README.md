# Supabase Integration Playbook — เตรียมเชื่อมต่อ Supabase สำหรับเกม Web

> **สถานะ:** เตรียมพร้อม (Prepared) — ยังไม่ได้สร้างโปรเจกต์ Supabase จริง
> การสร้างโปรเจกต์/ตาราง/RLS จริงเป็นเรื่องระดับ **BIG** (ระบบออนไลน์/ค่าใช้จ่าย) → ต้องได้รับอนุมัติจากคุณ `game` และระบุเป้าหมาย #1 ก่อน
>
> Recommended Default (ถ้ายังไม่ได้ระบุ): **Portfolio** (showcase ทักษะ backend สำหรับผู้ตรวจงาน/นายจ้าง)

---

## 1. เมื่อไหร่ควรเชื่อมต่อจริง (Decision Gate)

เชื่อมต่อ Supabase จริงเมื่อ:
- [ ] มีโปรเจกต์เกมที่ต้องการระบบออนไลน์ (auth/leaderboard/save/multiplayer)
- [ ] คุณ `game` ระบุเป้าหมาย #1 (Fun/Portfolio/Income/Learning) แล้ว
- [ ] คุณ `game` อนุมัติค่าใช้จ่าย (free tier เพียงพอสำหรับ prototype)
- [ ] มีแผน RLS security (ดู skill `supabase` section 8)

**ถ้ายังไม่ครบ → ใช้ mock/localStorage ไปก่อน (offline-first)**

## 2. ขั้นตอนสร้างโปรเจกต์ (เมื่ออนุมัติแล้ว)

1. ไปที่ https://supabase.com → New Project
2. ตั้งชื่อ + รหัสผ่าน DB + region (เลือกใกล้ผู้เล่นเป้าหมาย)
3. รอ ~2 นาที → ไป Project Settings → API → เก็บ:
   - `Project URL`
   - `anon public key`
   - `service_role key` (เก็บในที่ปลอดภัย, ห้ามใส่ frontend)
4. เปิด Authentication → ตั้งค่า provider ที่ต้องการ (Email, Discord, Google)
5. สร้างตาราง (ดู `schema.sql` ในโฟลเดอร์นี้)
6. เปิด RLS ทุกตาราง + สร้าง policy (ดู `schema.sql`)
7. ตั้งค่า Storage buckets (avatars, assets) ถ้าต้องการ
8. Deploy Edge Functions (ถ้าต้องการ anti-cheat) ผ่าน Supabase CLI

## 3. โครงสร้างไฟล์ที่แนะนำ (Project Structure)

```
your-game/
├── index.html
├── src/
│   ├── config/
│   │   └── supabaseClient.js   ← สร้างจาก supabaseClient.example.js
│   ├── auth/
│   │   └── authManager.js
│   ├── data/
│   │   ├── leaderboard.js
│   │   └── saveSystem.js
│   └── game.js
├── .env.example                ← คัดลอกเป็น .env (ห้าม commit .env)
└── supabase/
    └── schema.sql              ← รันใน SQL Editor
```

## 4. Environment Variables

คัดลอก `.env.example` → `.env` และใส่ค่าจริง (ห้าม commit `.env` ลง git):

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

> **WHY .env:** แยก secret/config ออกจากโค้ด → เปลี่ยน environment (dev/prod) ได้ง่าย และไม่ leak ลง git

## 5. Client Initialization (ตัวอย่าง)

ดู `supabaseClient.example.js` — ใช้ anon key เท่านั้น, แยก config ออกจาก logic

## 6. Schema (ตัวอย่าง)

ดู `schema.sql` — ประกอบด้วย profiles, scores, saves + RLS policies

## 7. Checklist ก่อนปล่อย (Pre-launch)

- [ ] RLS เปิดทุกตาราง
- [ ] ไม่มี service_role key ใน frontend
- [ ] Auth flow ทดสอบ (guest, email, OAuth ถ้ามี)
- [ ] Leaderboard query มี limit + index
- [ ] Save data มี version
- [ ] ทดสอบ offline (ไม่มีเน็ต)
- [ ] ทดสอบ token expired
- [ ] HTTPS ใน production

## 8. ทางเลือก (ถ้าไม่ใช้ Supabase)

- **Firebase** — เอกสารเยอะ, Realtime DB ง่าย, vendor lock-in
- **PocketBase** — single binary, self-host, ง่าย
- **เซิร์ฟเวอร์เอง (Node + DB)** — ควบคุมเต็มที่, ต้นทุนสูง

> **Recommended Default:** Supabase (free tier + RLS + Realtime) สำหรับ portfolio/indie

## 9. แหล่งเรียนรู้

- Supabase Docs: https://supabase.com/docs
- JS Client: https://supabase.com/docs/reference/javascript
- RLS: https://supabase.com/docs/guides/auth/row-level-security