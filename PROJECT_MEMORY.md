# PROJECT_MEMORY.md — ความจำหลักของโปรเจกต์ (Game Dev Partner)

> ไฟล์นี้เก็บความจำถาวรของโปรเจกต์และข้อมูลผู้ใช้งานของคุณ **game** โดย **Game Dev Partner** จะอ่านไฟล์นี้ทุกครั้งที่เริ่มเซสชัน และอัปเดตหลังจบทุกงานเพื่อไม่ให้คุณ **game** ต้องอธิบายเรื่องเดิมซ้ำ

---

## 1. ข้อมูลผู้ใช้และเป้าหมายหลัก (User Profile & Goals)
- **ชื่อผู้ใช้:** `game` (นักศึกษา พัฒนาเกมเดี่ยว ระดับเริ่มต้น-ปานกลาง มีพื้นฐาน `HTML/JS` และ `Python`)
- **แพลตฟอร์มหลัก:** Windows 11 PC เน้น **Web First** (`HTML/JS/CSS — Canvas/WebGL`)
- **เวลาทำงานหลัก:** ช่วงเย็นหลัง `18:00 น.` (วันมีเรียน 4–5 ชม. / วันหยุด 7+ ชม.)
- **ความชอบด้านเกม:** ชอบ `FPS` (Valorant), `FiveM / GTA 5`, และเกม `Roblox` เปิดรับทั้ง 2D และ 3D ทุกสไตล์ภาพ ให้ความสำคัญกับ **ระบบการเล่น (`Game Mechanics`)** และ **งานภาพ (`Visuals`)** มากที่สุด
- **เป้าหมายทั้ง 4 ด้าน:** ความสนุก (`Fun`), พอร์ตโฟลิโอ (`Portfolio`), หารายได้ (`Income`), และการเรียนรู้ (`Learning`) *(ต้องถามลำดับความสำคัญอันดับ 1 ทุกครั้งเมื่อเริ่มเกมใหม่)*

---

## 2. การตัดสินใจสำคัญที่อนุมัติแล้ว (Approved Decisions)
- **[2026-11-21] รูปแบบระบบผู้ช่วยส่วนตัว:** ใช้โครงสร้างไฟล์ Markdown (`.md`) ในโปรเจกต์ โดยเรียกใช้งานผ่านคำสั่ง `/game-development` ยังไม่สร้างหน้าเว็บ Dashboard
- **[2026-11-21] ขอบเขตสกิล `/game-development`:** สร้างไว้ที่ `.agents/skills/game-development/SKILL.md` ภายในโปรเจกต์นี้ โดยเชื่อมโยง (Bridge) ไปยังคู่มือเกมย่อยใน `~/.gemini/config/skills/game-development` เพื่อปกป้องไฟล์ระบบเดิมของเครื่อง 100%
- **[2026-11-21] โครงสร้างโฟลเดอร์หลัก:** ใช้โฟลเดอร์ชั้นนอกสุด `โฟลเดอร์โปรเจกต์นี้` เป็นโฟลเดอร์โปรเจกต์หลัก (`Agent ai game`) โดยตรง ไม่ซ้อนโฟลเดอร์ย่อย `Agent ai game`
- **[2026-11-21] รูปแบบคำสั่งเดียวและสายบังคับบัญชา 7 ขั้น (`v1.1.0`):**
  - ใช้คำสั่งเดียว `/game-development <คำสั่ง>` ได้เลยโดยไม่ต้องพิมพ์คำสั่งย่อยตามหลัง
  - ผสานบทบาทเดิมทั้ง 6 ตำแหน่ง (`Lead/Producer`, `Gameplay Programmer`, `Game Designer`, `Technical Artist & Asset Scout`, `QA Tester`, `Teacher`) เข้ากับสายบังคับบัญชา 7 ขั้น: `1. Lead > 2. Deputy Lead > 3. Task Delegation > 4. Frontend/Backend Development > 5. UX/UI Design > 6. Bug Testing & Fixing > 7. Final Quality Assurance`
  - สำรองไฟล์เดิมไว้ที่ `backups/20261121-2041/` ก่อนอัปเดตและรักษาเนื้อหาเดิมไว้ครบ 100%
- **[2026-11-21] จัดตั้งทีมค้นคว้าหาภาพอ้างอิงและ Asset เฉพาะทาง (`Stage 3.5: Elite Asset & Reference Research Team` — `v1.2.0`):**
  - ทำงานต่อจาก `Stage 3: Task Delegation` ร่วมกับ `Technical Artist & Asset Scout` + `Subagent` เพื่อค้นหาและคัดกรองทั้งภาพอ้างอิง (`Reference Only`) และไฟล์ใช้งานจริง (`In-Game Asset`) ครบทั้ง 6 หมวด: `1) Illustrations & Characters`, `2) Backgrounds & Environments`, `3) Visual Effects (VFX)`, `4) Weapons & Props`, `5) UI Icons & HUD Elements`, `6) Other Game Assets (Audio & Fonts)`
  - คัดกรองความเข้ากันของโทนสีและสไตล์ภาพ (`Art Direction Consistency`), ตรวจข้อความ License จริงจากเว็บต้นทาง, ขออนุมัติคุณ `game` ก่อนนำมาใช้ และบันทึกลงในตาราง `ASSETS.md` (ที่เพิ่มคอลัมน์ `Category` และ `Usage Type` แล้ว)
  - สร้างคู่มือเฉพาะทาง `asset-and-reference-research.md` และสำรองไฟล์เดิมทั้งหมดไว้ที่ `backups/20261121-2056/`
- **[2026-11-21] นำผู้ช่วยส่วนตัวเข้าสู่ OpenCode (`v1.3.0`):**
  - สร้าง `opencode.jsonc` ที่ root ของโปรเจกต์ โดยกำหนด `instructions` ให้โหลด `.agents/rules/game-dev-partner.md` (กฎ `always_on`) ทุกเซสชันใน OpenCode
  - สร้างคำสั่ง Slash `/game-development` สำหรับ OpenCode ที่ `.opencode/commands/game-development.md` ซึ่งเรียกใช้สกิล `game-development` และโหลดไฟล์ความจำโปรเจกต์ (`AGENTS.md`, `PROJECT_MEMORY.md`, `CHANGELOG.md`, `ASSETS.md`) อัตโนมัติ
  - สกิล `/game-development` ถูกค้นพบโดย OpenCode ผ่าน compatibility source `.agents/skills` (ไม่ต้องย้ายไฟล์)
  - ไฟล์ `AGENTS.md` ที่ root ถูก OpenCode โหลดอัตโนมัติเป็น Project Instructions อยู่แล้ว ทำให้ Persona ทำงานได้ทันทีเมื่อเปิดโฟลเดอร์นี้ใน OpenCode
- **[2026-11-21] เพิ่มความรู้ Supabase สำหรับ Game Dev Partner (`v1.4.0`):**
  - สร้างสกิลใหม่ `.agents/skills/supabase/SKILL.md` ให้ผู้ช่วยส่วนตัวโหลดได้เมื่องานเกี่ยวข้องกับระบบออนไลน์/บัญชีผู้เล่น/leaderboard/เซฟบนคลาวด์/multiplayer
  - ครอบคลุม: Auth (Guest/Email/OAuth), Database (leaderboard/save versioned), Storage, Realtime, Edge Functions, RLS security, env handling, alternatives, common pitfalls
  - สกิลถูก OpenCode ค้นพบอัตโนมัติผ่าน compatibility source `.agents/skills` (ID: `supabase`)
  - ยังไม่ได้เชื่อมต่อ Supabase จริง — การเชื่อมต่อเป็นเรื่องระดับ BIG ต้องได้รับอนุมัติจากคุณ `game` ก่อน
- **[2026-11-21] เพิ่ม Supabase References & Integration Playbook (`v1.5.0`):**
  - เพิ่มคู่มือเฉพาะด้านใน `.agents/skills/supabase/references/`: `realtime-multiplayer.md`, `anti-cheat.md`, `auth-patterns.md`
  - สร้างเทมเพลตเตรียมเชื่อมต่อ Supabase ที่ `templates/supabase/` (README playbook, supabaseClient.example.js, schema.sql, .env.example) — ยังไม่สร้างโปรเจกต์จริง
  - Recommended Default เป้าหมาย #1 สำหรับเกมที่ใช้ Supabase: **Portfolio** (ถ้ายังไม่ได้ระบุ)
- **[2026-11-21] เพิ่ม Supabase Skill ย่อย (`v1.6.0`):**
  - สร้างสกิล `supabase-voice-chat` (Realtime voice chat ผ่าน WebRTC + Supabase signaling) และ `supabase-matchmaking` (Lobby/Matchmaking/Queue/ELO) ให้ผู้ช่วยโหลดเมื่อต้องทำ multiplayer ขั้นสูง
  - สกิลถูก OpenCode ค้นพบอัตโนมัติผ่าน compatibility source `.agents/skills` (ID: `supabase-voice-chat`, `supabase-matchmaking`)
  - ยังไม่ได้เชื่อมต่อ Supabase จริง — การเชื่อมต่อเป็นเรื่องระดับ BIG ต้องได้รับอนุมัติจากคุณ `game` ก่อน
- **[2026-11-21] เพิ่ม Supabase Skill ย่อยขั้นสูง (`v1.7.0`):**
  - สร้างสกิล `matchmaking-dedicated` (Colyseus/Photon/Nakama/AWS GameLift, server-authoritative, scaling) และ `voice-chat-sfu` (LiveKit/mediasoup/Janus, simulcast, scaling/cost)
  - สกิลถูก OpenCode ค้นพบอัตโนมัติผ่าน compatibility source `.agents/skills` (ID: `matchmaking-dedicated`, `voice-chat-sfu`)
  - ยังไม่ได้เชื่อมต่อ dedicated server จริง — เป็นเรื่องระดับ BIG (ค่าใช้จ่าย/hosting) ต้องได้รับอนุมัติจากคุณ `game` ก่อน
- **[2026-11-21] เผยแพร่โปรเจกต์ขึ้น GitHub (`v1.8.0`):**
  - สร้าง repository สาธารณะ `klakarkhaycturwithy-sketch/ai-game` บน GitHub และ push ขึ้นไป (branch `main`)
  - ตั้งค่า git author name เป็น `Game` (local) ตามที่คุณ `game` ระบุ
  - เพิ่ม `.gitignore` เพื่อไม่ push โฟลเดอร์ `backups/` ขึ้น repository
- **[2026-11-21] ลบ path เครื่อง local ออกจากเอกสาร (`v1.9.0`):**
  - ลบ path `c:\Users\klaka\Code Antigravity\ai game` และ `file:///c:/Users/klaka/...` ออกจากเอกสารทั้งหมดเพื่อไม่ให้แสดงบน GitHub
  - เปลี่ยนลิงก์ภายในโปรเจกต์เป็น root-relative (เช่น `/ASSETS.md`) และ path ระดับเครื่อง (`.gemini/...`) เป็นข้อความ code (`~/.gemini/...`)
- **[2026-11-21] สร้างระบบตัวติดตั้ง `npx ai-game-init` คำสั่งเดียว (`v2.0.0` -> `v2.0.2`):**
  - สร้าง `package.json` และสคริปต์ CLI `bin/cli.js` พร้อมเชื่อม Global Link (`npm link`) เพื่อให้พิมพ์คำสั่งเดียว `npx ai-game-init` ดึงผู้ช่วยส่วนตัว `/game-development` ไปติดตั้งในโฟลเดอร์โปรเจกต์เกมใหม่ๆ ได้ทันทีผ่าน Terminal
  - มีระบบสำรองไฟล์อัตโนมัติลง `backups/YYYYMMDD-HHMM/` ก่อนอัปเดต และปกป้องไฟล์ความจำ (`PROJECT_MEMORY.md`, `CHANGELOG.md`, `ASSETS.md`) ไม่ให้ถูกเขียนทับ
  - สำรองไฟล์เดิมก่อนแก้ไขไว้ที่ `backups/20261121-2234/`, `backups/20261121-2238/` และ `backups/20261121-2241/` และอัปเดตขึ้น GitHub Repository `klakarkhaycturwithy-sketch/ai-game` เรียบร้อย
- **[2026-11-21] เพิ่มสกิลช่วยวางแผนก่อนเริ่มงานแบบละเอียด (`game-planning` — `v2.1.0`):**
  - สร้างสกิล `.agents/skills/game-planning/SKILL.md`, คำสั่ง OpenCode `.opencode/commands/game-planning.md`, และแม่แบบ `templates/planning/GAME_PLAN_TEMPLATE.md`
  - ครอบคลุมโครงสร้างแผนงาน 5 มิติหลัก (`5-Pillar Master Game Plan`: 1. Goal/Platform/Hardware Lock, 2. One-Page GDD & Core Loop/Juice, 3. Visual Direction & 6-Category Asset Blueprint, 4. Technical Architecture & UX/UI Wireframe, 5. Step-by-Step Milestone Roadmap & Scope Creep Guard)
  - กฎการเรียกใช้: **เรียกใช้เฉพาะตอนที่คุณ `game` พิมพ์สั่งให้วางแผนแยกต่างหากเท่านั้น** (เช่น พิมพ์ `/game-planning` หรือ `@game-planning`) โดยรองรับทั้งการสรุปแผนให้ดูในแชทและการสร้างบันทึกเป็นไฟล์ `GAME_PLAN.md` ในโปรเจกต์เมื่ออนุมัติแผน
  - สำรองไฟล์เดิมไว้ที่ `backups/20261121-2257/` และเพิ่มเข้าใน `npx ai-game-init` (`v2.1.0`) พร้อมซิงก์ขึ้น GitHub Repository `klakarkhaycturwithy-sketch/ai-game`

---

## 3. กฎสไตล์โค้ดและโครงสร้างโฟลเดอร์ (Style Rules, Folder Structure & Naming Conventions)
- **เทคโนโลยีเริ่มต้น (`Default Stack`):** `HTML/JS/CSS (Canvas/WebGL)`
- **กฎการเขียนโค้ด:**
  - แยกไฟล์ค่าคงที่และการตั้งค่า (`config` / `constants`) ออกจาก `logic` เสมอ
  - ใช้ `Frame-Rate-Independent Game Loop` (`deltaTime` / `Fixed Timestep`)
  - ใช้ `Object Pooling` และห้ามจองหน่วยความจำใหม่ทุกเฟรม (`No Per-Frame Allocations`)
  - ข้อมูลเซฟต้องมีเลขเวอร์ชัน (`Versioned Save Data`)
  - คอมเมนต์และชื่อตัวแปรเป็นภาษาอังกฤษ โดยคอมเมนต์อธิบายเหตุผลว่า **"ทำไม (WHY)"**
- **รูปแบบการตั้งชื่อ (`Naming Conventions`):**
  - ไฟล์เอกสารระบบ: `SCREAMING_SNAKE_CASE.md` (เช่น `PROJECT_MEMORY.md`, `CHANGELOG.md`, `ASSETS.md`)
  - ไฟล์สกิลและคู่มืออ้างอิง: `kebab-case.md` (เช่น `team-roles-and-workflow.md`)
  - โค้ด JavaScript: ตัวแปรและฟังก์ชันใช้ `camelCase`, คลาสใช้ `PascalCase`, ค่าคงที่ใช้ `UPPER_SNAKE_CASE`
- **โครงสร้างโฟลเดอร์ปัจจุบัน:**
  ```text
  โฟลเดอร์โปรเจกต์นี้\
  ├── AGENTS.md
  ├── PROJECT_MEMORY.md
  ├── CHANGELOG.md
  ├── ASSETS.md
  ├── README.md
  ├── package.json
  ├── bin/
  │   └── cli.js
  ├── opencode.jsonc
  ├── backups/
  ├── .opencode/
  │   └── commands/
  │       ├── game-development.md
  │       └── game-planning.md
  └── .agents/
      ├── rules/
      │   └── game-dev-partner.md
      └── skills/
          ├── game-development/
          │   ├── SKILL.md
          │   └── references/
          │       ├── asset-and-reference-research.md
          │       ├── team-roles-and-workflow.md
          │       └── engineering-and-design-standards.md
          ├── game-planning/
          │   └── SKILL.md
          ├── supabase/
          │   ├── SKILL.md
          │   └── references/
          │       ├── realtime-multiplayer.md
          │       ├── anti-cheat.md
          │       └── auth-patterns.md
          ├── supabase-voice-chat/
          │   └── SKILL.md
          ├── supabase-matchmaking/
          │   └── SKILL.md
          ├── matchmaking-dedicated/
          │   └── SKILL.md
          └── voice-chat-sfu/
              └── SKILL.md
  ├── templates/
  │   ├── planning/
  │   │   └── GAME_PLAN_TEMPLATE.md
  │   └── supabase/
  │       ├── README.md
  │       ├── supabaseClient.example.js
  │       ├── schema.sql
  │       └── .env.example
  ```
  ```

---

## 4. สถานะโปรเจกต์เกมปัจจุบัน (Current Game Project Status)
- **โปรเจกต์เกมปัจจุบัน:** ยังไม่ได้เลือกแนวเกมหรือเริ่มสร้างเกม (รอคำสั่งจากคุณ `game`)
- **รายการ Asset (`Asset List`):** ดูรายละเอียดทั้งหมดใน [ASSETS.md](/ASSETS.md) (ปัจจุบันยังไม่มี Asset ภายนอก)
- **บั๊กที่พบ (`Known Bugs`):** ไม่มี

---

## 5. ก้าวถัดไป (Next Steps)
1. เปิดโฟลเดอร์นี้ใน OpenCode แล้วพิมพ์ `/game-development` (หรือ `/game-development เริ่มเซสชัน`) เพื่อทดสอบผู้ช่วยส่วนตัวใน OpenCode
2. เลือกแนวเกมโปรเจกต์แรก และระบุว่าโปรเจกต์แรกต้องการเน้นเป้าหมายข้อใดเป็นอันดับ 1 (`Fun`, `Portfolio`, `Income`, หรือ `Learning`)
3. (ถ้าต้องการ) ตั้งค่าผู้ช่วยส่วนตัวให้เป็นเอเจนต์หลักของเซสชันด้วย `default_agent` ใน `opencode.jsonc` (ปัจจุบันใช้ Persona ผ่าน `AGENTS.md` + `instructions` แล้ว)
4. เมื่อเริ่มเกมที่ต้องการระบบออนไลน์ ให้โหลดสกิล `supabase` (`@supabase`) เพื่อออกแบบ Auth/DB/Realtime พร้อม RLS security
5. สำหรับเกม multiplayer ขั้นสูง ให้โหลด `@supabase-voice-chat` (voice chat) และ `@supabase-matchmaking` (lobby/matchmaking) ตามต้องการ
6. สำหรับเกม competitive/ผู้เล่นจำนวนมาก ให้โหลด `@matchmaking-dedicated` (dedicated server) และ `@voice-chat-sfu` (SFU voice chat) ตามต้องการ (BIG decision: ค่าใช้จ่าย/hosting)
7. Repository บน GitHub: https://github.com/klakarkhaycturwithy-sketch/ai-game (public, branch main) — ใช้สำหรับ portfolio/showcase
