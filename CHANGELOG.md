# CHANGELOG.md — ประวัติการเปลี่ยนแปลงโปรเจกต์ (Game Dev Partner)

บันทึกการเปลี่ยนแปลงทุกเซสชันของโปรเจกต์ `โฟลเดอร์โปรเจกต์นี้` โดยเรียงจากล่าสุดลงไปเก่าสุด

---

## [v2.0.1] — 2026-11-21 (Short CLI Command `npx-ai-game-init` & Global Link)
### Changed & Added (สิ่งที่ปรับปรุง)
- สำรองไฟล์เดิมลงใน `backups/20261121-2238/` ก่อนแก้ไขตามกฎ File Safety
- ปรับปรุง [package.json](/package.json) และ [bin/cli.js](/bin/cli.js) พร้อมทำ `npm link` ระดับเครื่อง (เหมือน `nongton`) เพื่อให้เรียกใช้งานด้วยชื่อสั้นๆ `npx-ai-game-init` หรือ `npx ai-game-init` ได้จากทุกโฟลเดอร์ในเครื่องทันทีโดยไม่ต้องพิมพ์ URL ของ GitHub

---

## [v2.0.0] — 2026-11-21 (Add `npx` Single-Command GitHub CLI Installer)
### Added & Updated (สิ่งที่เพิ่มและอัปเดต)
- สำรองไฟล์เดิมลงใน `backups/20261121-2234/` ก่อนทำการแก้ไขตามกฎ File Safety
- สร้าง [package.json](/package.json) และสคริปต์ CLI [bin/cli.js](/bin/cli.js) สำหรับติดตั้งผู้ช่วยส่วนตัว `/game-development` ด้วยคำสั่งเดียว `npx github:klakarkhaycturwithy-sketch/ai-game` (หรือ `npx ai-game`) เหมือนโปรเจกต์ `nongton`
- รองรับการสำรองไฟล์เดิมอัตโนมัติลง `backups/YYYYMMDD-HHMM/` การปกป้องไฟล์ความจำไม่ให้ถูกเขียนทับ และคำสั่งตรวจสถานะ `npx ai-game status` (ตรวจเช็กความพร้อมของไฟล์และสกิลทั้งหมด 17 รายการ)
- อัปเดต [README.md](/README.md) และ [PROJECT_MEMORY.md](/PROJECT_MEMORY.md) และซิงก์ขึ้น GitHub Repository `klakarkhaycturwithy-sketch/ai-game`

---

## [v1.9.0] — 2026-11-21 (Remove Local Absolute Paths from Docs)
### Changed (สิ่งที่เปลี่ยน)
- ลบ path เครื่อง local (เช่น `c:\Users\klaka\Code Antigravity\ai game` และ `file:///c:/Users/klaka/...`) ออกจากเอกสารทั้งหมดเพื่อไม่ให้แสดงบน GitHub และให้ลิงก์ relative ทำงานได้
- เปลี่ยนลิงก์ภายในโปรเจกต์เป็น root-relative (เช่น `/ASSETS.md`) และ path ระดับเครื่อง (`.gemini/...`) เป็นข้อความ code (`~/.gemini/...`)

---

## [v1.7.0] — 2026-11-21 (Supabase Advanced Sub-Skills: Dedicated Matchmaking & SFU Voice Chat)
### Added (สิ่งที่เพิ่ม)
- สำรองไฟล์เดิมที่ได้รับผลกระทบลงใน `backups/20261121-2133/` ก่อนทำการอัปเดตตามกฎ File Safety
- สร้างสกิลย่อย [.agents/skills/matchmaking-dedicated/SKILL.md](/.agents/skills/matchmaking-dedicated/SKILL.md) — Dedicated-server matchmaking (Colyseus/Photon/Nakama/AWS GameLift, server-authoritative, scaling, migration path)
- สร้างสกิลย่อย [.agents/skills/voice-chat-sfu/SKILL.md](/.agents/skills/voice-chat-sfu/SKILL.md) — SFU voice chat (LiveKit/mediasoup/Janus, simulcast, scaling/cost)
- อัปเดต [PROJECT_MEMORY.md](/PROJECT_MEMORY.md) (การตัดสินใจ v1.7.0, โครงสร้างโฟลเดอร์, ก้าวถัดไป)

### Notes
- สกิลถูก OpenCode ค้นพบอัตโนมัติผ่าน compatibility source `.agents/skills` (ID: `matchmaking-dedicated`, `voice-chat-sfu`)
- ยังไม่ได้เชื่อมต่อ dedicated server จริง — เป็นเรื่องระดับ BIG (ค่าใช้จ่าย/hosting) ต้องได้รับอนุมัติจากคุณ `game` ก่อน

---

## [v1.6.0] — 2026-11-21 (Supabase Sub-Skills: Voice Chat & Matchmaking)
### Added (สิ่งที่เพิ่ม)
- สำรองไฟล์เดิมที่ได้รับผลกระทบลงใน `backups/20261121-2130/` ก่อนทำการอัปเดตตามกฎ File Safety
- สร้างสกิลย่อย [.agents/skills/supabase-voice-chat/SKILL.md](/.agents/skills/supabase-voice-chat/SKILL.md) — Realtime voice chat ผ่าน WebRTC + Supabase signaling (peer connection, offer/answer/ICE, mute/deafen/push-to-talk, quality settings, mesh vs SFU)
- สร้างสกิลย่อย [.agents/skills/supabase-matchmaking/SKILL.md](/.agents/skills/supabase-matchmaking/SKILL.md) — Lobby/Matchmaking/Queue/ELO (presence, room lifecycle, matchmaking queue, Edge Function, UI checklist)
- อัปเดต [PROJECT_MEMORY.md](/PROJECT_MEMORY.md) (การตัดสินใจ v1.6.0, โครงสร้างโฟลเดอร์, ก้าวถัดไป)

### Notes
- สกิลถูก OpenCode ค้นพบอัตโนมัติผ่าน compatibility source `.agents/skills` (ID: `supabase-voice-chat`, `supabase-matchmaking`)
- ยังไม่ได้เชื่อมต่อ Supabase จริง — การเชื่อมต่อเป็นเรื่องระดับ BIG ต้องได้รับอนุมัติจากคุณ `game` ก่อน

---

## [v1.5.0] — 2026-11-21 (Supabase References & Integration Playbook)
### Added (สิ่งที่เพิ่ม)
- สำรองไฟล์เดิมที่ได้รับผลกระทบลงใน `backups/20261121-2124/` ก่อนทำการอัปเดตตามกฎ File Safety
- เพิ่มคู่มือเฉพาะด้านใน [.agents/skills/supabase/references/](/.agents/skills/supabase/references/): `realtime-multiplayer.md`, `anti-cheat.md`, `auth-patterns.md`
- อัปเดต [.agents/skills/supabase/SKILL.md](/.agents/skills/supabase/SKILL.md) ให้เชื่อมโยงกับ references ใหม่
- สร้างเทมเพลตเตรียมเชื่อมต่อ Supabase ที่ [templates/supabase/](/templates/supabase/): `README.md` (playbook), `supabaseClient.example.js`, `schema.sql`, `.env.example`
- อัปเดต [PROJECT_MEMORY.md](/PROJECT_MEMORY.md) (การตัดสินใจ v1.5.0, โครงสร้างโฟลเดอร์, ก้าวถัดไป)

### Notes
- ยังไม่ได้สร้างโปรเจกต์ Supabase จริง — การเชื่อมต่อจริงเป็นเรื่องระดับ BIG ต้องได้รับอนุมัติจากคุณ `game` และระบุเป้าหมาย #1 ก่อน

---

## [v1.4.0] — 2026-11-21 (Add Supabase Knowledge Skill for Game Dev Partner)
### Added (สิ่งที่เพิ่ม)
- สำรองไฟล์เดิมที่ได้รับผลกระทบลงใน `backups/20261121-2110/` ก่อนทำการอัปเดตตามกฎ File Safety
- สร้างสกิลใหม่ [.agents/skills/supabase/SKILL.md](/.agents/skills/supabase/SKILL.md) ให้ผู้ช่วยส่วนตัว Game Dev Partner โหลดได้เมื่องานเกี่ยวข้องกับระบบออนไลน์/บัญชีผู้เล่น/leaderboard/เซฟบนคลาวด์/multiplayer
- ครอบคลุม: Auth (Guest/Email/OAuth), Database (leaderboard + versioned save data), Storage, Realtime (multiplayer/chat/presence), Edge Functions (anti-cheat), RLS security, env handling, alternatives (Firebase/PocketBase/own server), common pitfalls
- อัปเดต [PROJECT_MEMORY.md](/PROJECT_MEMORY.md) (การตัดสินใจ v1.4.0, โครงสร้างโฟลเดอร์, ก้าวถัดไป)

### Notes
- สกิลถูก OpenCode ค้นพบอัตโนมัติผ่าน compatibility source `.agents/skills` (ID: `supabase`) ไม่ต้องย้ายไฟล์
- ยังไม่ได้เชื่อมต่อ Supabase จริง — การเชื่อมต่อเป็นเรื่องระดับ BIG (ระบบออนไลน์/ค่าใช้จ่าย) ต้องได้รับอนุมัติจากคุณ `game` ก่อน

---

## [v1.3.0] — 2026-11-21 (Bring Game Dev Partner into OpenCode)
### Added (สิ่งที่เพิ่ม)
- สำรองไฟล์เดิมที่ได้รับผลกระทบลงใน `backups/20261121-2107/` ก่อนทำการอัปเดตตามกฎ File Safety
- สร้างไฟล์ตั้งค่า OpenCode ระดับโปรเจกต์ [opencode.jsonc](/opencode.jsonc) ที่กำหนด `instructions` ให้โหลดกฎ `always_on` จาก `.agents/rules/game-dev-partner.md` ทุกเซสชันใน OpenCode
- สร้างคำสั่ง Slash สำหรับ OpenCode ที่ [.opencode/commands/game-development.md](/.opencode/commands/game-development.md) เพื่อให้พิมพ์ `/game-development` ใน OpenCode ได้โดยตรง (เรียกใช้สกิล `game-development` และโหลดไฟล์ความจำโปรเจกต์อัตโนมัติ)
- อัปเดต [PROJECT_MEMORY.md](/PROJECT_MEMORY.md) และ [README.md](/README.md) ให้สะท้อนโครงสร้างใหม่ (`opencode.jsonc`, `.opencode/commands/`) และการนำผู้ช่วยส่วนตัวเข้าสู่ OpenCode

### Notes
- สกิล `/game-development` ถูก OpenCode ค้นพบอัตโนมัติผ่าน compatibility source `.agents/skills` ไม่จำเป็นต้องย้ายไฟล์
- `AGENTS.md` ที่ root ถูก OpenCode โหลดอัตโนมัติเป็น Project Instructions อยู่แล้ว ทำให้ Persona ทำงานได้ทันทีเมื่อเปิดโฟลเดอร์นี้ใน OpenCode

## [v1.2.0] — 2026-11-21 (Elite Asset & Reference Research Team & 6-Category Curation System)

### Added & Updated (สิ่งที่เพิ่มและอัปเดตโดยไม่ลบเนื้อหาเดิม)
- สำรองไฟล์เดิมทั้งหมดลงใน `backups/20261121-2056/` ก่อนทำการอัปเดตตามกฎ File Safety
- สร้างคู่มือเฉพาะทาง [asset-and-reference-research.md](/.agents/skills/game-development/references/asset-and-reference-research.md) สำหรับ **`Stage 3.5: Elite Asset & Reference Research Team`** ครอบคลุมการค้นหา คัดกรองโทนสี/สไตล์ภาพ (`Art Direction Consistency`) และตรวจลิขสิทธิ์ครบทั้ง 6 หมวดหลัก (`Illustrations & Characters`, `Backgrounds & Environments`, `Visual Effects (VFX)`, `Weapons & Props`, `UI Icons & HUD Elements`, `Other Game Assets: Audio & Fonts`)
- อัปเกรดตารางใน [ASSETS.md](/ASSETS.md) ให้มีคอลัมน์ `Category` (หมวดหมู่ทั้ง 6 หมวด) และ `Usage Type` (`Reference Only` vs `In-Game Asset`) คู่กับข้อมูลลิขสิทธิ์เดิมทั้ง 7 ช่อง
- อัปเดต [AGENTS.md](/AGENTS.md), [game-dev-partner.md](/.agents/rules/game-dev-partner.md), [SKILL.md](/.agents/skills/game-development/SKILL.md), [team-roles-and-workflow.md](/.agents/skills/game-development/references/team-roles-and-workflow.md), [README.md](/README.md), และ [PROJECT_MEMORY.md](/PROJECT_MEMORY.md) ให้เชื่อมโยงกับ `Stage 3.5: Elite Asset & Reference Research Team` ก่อนส่งงานต่อให้ทีม `Frontend/Backend Development` และ `UX/UI Design`

---

## [v1.1.0] — 2026-11-21 (7-Stage Hierarchical Game Dev Pipeline & Single-Command Trigger)

### Added & Updated (สิ่งที่เพิ่มและอัปเดตโดยไม่ลบเนื้อหาเดิม)
- สำรองไฟล์เดิมทั้งหมดลงใน `backups/20261121-2041/` ก่อนทำการอัปเดตตามกฎ File Safety
- อัปเดต [AGENTS.md](/AGENTS.md), [game-dev-partner.md](/.agents/rules/game-dev-partner.md), [SKILL.md](/.agents/skills/game-development/SKILL.md), [team-roles-and-workflow.md](/.agents/skills/game-development/references/team-roles-and-workflow.md), และ [README.md](/README.md) ให้รองรับการเรียกใช้งานด้วยคำสั่งเดียว `/game-development <คำสั่ง>` โดยไม่ต้องพิมพ์คำสั่งย่อยตามหลัง
- ผสานทีมเสมือน 6 บทบาทเดิมเข้ากับสายบังคับบัญชา 7 ขั้น (`1. Lead > 2. Deputy Lead > 3. Task Delegation > 4. Frontend/Backend Development > 5. UX/UI Design > 6. Bug Testing & Fixing > 7. Final Quality Assurance`)
- บันทึกการตัดสินใจลงใน [PROJECT_MEMORY.md](/PROJECT_MEMORY.md)

---

## [v1.0.0] — 2026-11-21 (Initial Setup: Game Dev Partner & `/game-development`)

### Added (สิ่งที่สร้างใหม่)
- สร้างไฟล์กฎหลักของโปรเจกต์ [AGENTS.md](/AGENTS.md) กำหนดบทบาท **"Game Dev Partner"** และทีมเสมือน 6 บทบาท (`Lead/Producer`, `Gameplay Programmer`, `Game Designer`, `Technical Artist & Asset Scout`, `QA Tester`, `Teacher`)
- สร้างกฎประจำโปรเจกต์ [game-dev-partner.md](/.agents/rules/game-dev-partner.md) (`trigger: always_on`) เพื่อให้เอเจนต์จำโปรไฟล์คุณ `game` และกฎการทำงานอัตโนมัติทุกเซสชัน
- สร้างสกิลคำสั่งลัด `/game-development` ที่ [SKILL.md](/.agents/skills/game-development/SKILL.md) พร้อมเชื่อมโยง (Bridge) ไปยังคลังสกิลเกมย่อยระดับเครื่องโดยไม่แก้ไขไฟล์เดิมของระบบ
- สร้างคู่มือปฏิบัติการของทีม 6 บทบาท [team-roles-and-workflow.md](/.agents/skills/game-development/references/team-roles-and-workflow.md) และมาตรฐานวิศวกรรมเกม [engineering-and-design-standards.md](/.agents/skills/game-development/references/engineering-and-design-standards.md)
- สร้างไฟล์ความจำและทะเบียนระบบครบชุดที่โฟลเดอร์หลัก: [PROJECT_MEMORY.md](/PROJECT_MEMORY.md), [CHANGELOG.md](/CHANGELOG.md), [ASSETS.md](/ASSETS.md), และ [README.md](/README.md)
- สร้างโฟลเดอร์สำรองไฟล์อัตโนมัติ `backups/` สำหรับสำรองไฟล์ก่อนแก้ไขทุกครั้ง
