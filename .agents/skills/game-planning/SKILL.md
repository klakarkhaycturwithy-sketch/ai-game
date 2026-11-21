---
name: game-planning
description: >-
  Detailed Pre-Production & 5-Pillar Master Game Planning Skill (/game-planning) for Game Dev Partner ("game").
  Covers Goal/Platform/Hardware Lock, One-Page GDD (Core Loop, Mechanics, Progression, Difficulty, Juice),
  Art Direction & 6-Category Asset Blueprint, Technical Architecture (Config/Logic, Object Pooling, State Machine,
  Versioned Save Data, UX/UI Wireframes), and Step-by-Step Milestone Roadmap with Scope Creep Guard.
  Triggered ON-DEMAND only when the user explicitly requests planning (via /game-planning or explicit planning instruction).
---

# `/game-planning` — สกิลช่วยวางแผนก่อนเริ่มงานแบบละเอียด (5-Pillar Master Game Plan)

> **กฎการเรียกใช้งาน (`On-Demand Only`):** สกิลนี้จะทำงาน**เฉพาะเมื่อคุณ `game` พิมพ์สั่งให้วางแผนแยกต่างหากเท่านั้น** (เช่น เรียกคำสั่ง `/game-planning <ไอเดียเกมหรือระบบที่ต้องการวางแผน>` หรือสั่งให้วางแผนอย่างชัดเจน) โดยจะ**ไม่เขียนโค้ดเกมจริง**จนกว่าคุณ `game` จะตรวจและอนุมัติแผนงาน

---

## 1. ขั้นตอนการทำงานเมื่อคุณ `game` สั่งวางแผน (Pre-Production Planning Protocol)

เมื่อคุณ `game` เรียกใช้ `/game-planning`:
1. **อ่านไฟล์ความจำโปรเจกต์:** อ่าน [AGENTS.md](/AGENTS.md), [PROJECT_MEMORY.md](/PROJECT_MEMORY.md), และ [ASSETS.md](/ASSETS.md)
2. **ทวนโจทย์เป็น Checklist:** สรุปสิ่งที่คุณ `game` ต้องการวางแผนออกมาเป็น Checklist
3. **หากข้อมูลสำคัญยังไม่ครบ (BIG Decisions):** ให้ถามคำถามสั้นๆ 1–3 ข้อพร้อม **ค่าแนะนำเริ่มต้น (`Recommended Default`)** ก่อนสรุปแผนฉบับสมบูรณ์:
   - เป้าหมายอันดับ 1 ของเกมนี้คือข้อใด (`1. Fun`, `2. Portfolio`, `3. Income`, หรือ `4. Learning`)?
   - แพลตฟอร์มและเทคโนโลยีหลัก (`Default: Web First — HTML/JS/CSS Canvas 2D หรือ WebGL`) และสเปกเครื่องเป้าหมาย (`Target Hardware`) คืออะไร?
   - ต้องการให้ **แสดงแผนเฉพาะในช่องแชท** หรือ **บันทึกเป็นไฟล์ `GAME_PLAN.md` ลงในโปรเจกต์ด้วย** เมื่ออนุมัติแผน?
4. **สร้างพิมพ์เขียวแผนงาน 5 มิติ (`5-Pillar Master Game Plan`)** ตามโครงสร้างมาตรฐานในหัวข้อที่ 2 ด้านล่าง (อ้างอิงแม่แบบจาก [GAME_PLAN_TEMPLATE.md](/templates/planning/GAME_PLAN_TEMPLATE.md))

---

## 2. โครงสร้างแผนงาน 5 มิติหลัก (The 5-Pillar Master Game Plan)

ทุกแผนงานที่สร้างด้วย `/game-planning` ต้องมีรายละเอียดครบทั้ง 5 มิตินี้ พร้อมอธิบายเหตุผลว่า **"ทำไม (WHY)"** ถึงออกแบบเช่นนั้น:

### มิติที่ 1: `Pillar 1 — Goal, Platform & Hardware Lock` (ล็อกเป้าหมายและสเปกเครื่อง)
- **เป้าหมายอันดับ 1 (`Primary Goal`):** ระบุชัดเจนว่าเน้น `Fun`, `Portfolio`, `Income`, หรือ `Learning` และออกแบบแผนให้สอดคล้องกับเป้าหมายนั้น (โดยคงอีก 3 ข้อไว้เป็นผลพลอยได้รอง)
- **แพลตฟอร์มและเอนจิน (`Platform & Tech Stack`):** ค่าเริ่มต้นคือ `HTML/JS/CSS (Canvas 2D หรือ WebGL)` สำหรับ Web และ Windows 11 PC
- **สเปกเครื่องเป้าหมายและตัวเลือกกราฟิก (`Target Hardware & Quality Settings`):**
  - กำหนดงบประมาณเฟรมเรต (`60 FPS = 16.67ms ต่อเฟรม`)
  - กำหนดระดับกราฟิก `Low / Medium / High` (เช่น จำนวนพาร์ทิเคิลสูงสุด, ความละเอียด Canvas, เปิด/ปิดเงาและเอฟเฟกต์แสง) เพื่อให้เครื่องสเปกต่ำเล่นได้ลื่นไหล

### มิติที่ 2: `Pillar 2 — Game Design Blueprint (One-Page GDD)` (พิมพ์เขียวระบบการเล่น)
- **`Core Loop` (วงจรการเล่นหลักทุก 30 วินาที และ 5 นาที):**
  - *Action (ผู้เล่นทำอะไร)* -> *Challenge (เจออุปสรรคอะไร)* -> *Reward/Feedback (ได้ผลตอบแทนหรือความสะใจอะไร)*
- **`Core Mechanics & Input Mapping` (ระบบการเล่นหลักและปุ่มควบคุม):**
  - แยกปุ่มกดเป็น `Actions` (`Input Abstraction` เช่น `MOVE`, `JUMP`, `FIRE`, `RELOAD`, `PAUSE`) เพื่อให้รองรับการตั้งค่าปุ่มใหม่ได้ง่าย
- **`Progression & Difficulty Curve` (การเติบโตและกราฟความยาก):**
  - ผู้เล่นเก่งขึ้นหรือปลดล็อกอะไรบ้าง และความยากเพิ่มขึ้นอย่างไรโดยไม่ทำให้ผู้เล่นท้อ (`Fair Challenge`)
- **`Game Feel / Juice Checklist` (เช็กลิสต์ความสะใจในการเล่น):**
  - ระบุเอฟเฟกต์ภาพ เสียง และการสั่นหน้าจอเบาๆ (`Screen Shake` ที่เปิด/ปิดได้), `Hit Stop / Flash`, แอนิเมชันปืนดีด (`Recoil`), และตัวเลขดาเมจ

### มิติที่ 3: `Pillar 3 — Visual Direction & 6-Category Asset Blueprint` (แผนงานภาพและรายการ Asset 6 หมวด)
วางแผนรายการภาพอ้างอิง (`[Reference Only]`) และไฟล์ใช้งานจริง (`[In-Game Asset]`) ล่วงหน้าเพื่อส่งต่อให้ **`Stage 3.5: Elite Asset & Reference Research Team`**:
- **สไตล์ภาพและชุดสี (`Art Style & HEX Color Palette`):** กำหนดรหัสสีหลัก สีพื้นหลัง สีตัวละคร สีศัตรู และสี UI/VFX ให้ตัดกันชัดเจนอ่านง่าย
- **รายการ Asset ที่ต้องใช้ครบ 6 หมวด:**
  1. `Illustrations & Characters` (ตัวละครผู้เล่น, ศัตรู/NPC, ท่าแอนิเมชันที่ต้องมี)
  2. `Backgrounds & Environments` (ฉากหลัง `Parallax`, แผนที่ `Tilemaps` หรือฉาก 3D)
  3. `Visual Effects (VFX)` (`Muzzle Flash`, ระเบิด, พาร์ทิเคิล, `Hit Sparks`)
  4. `Weapons & Props` (อาวุธปืน/ประชิด, กล่องกระสุน, ไอเทมดรอป, ที่กำบัง)
  5. `UI Icons & HUD Elements` (ไอคอนอาวุธ/สกิล, เป้าเล็ง `Crosshair`, หลอดเลือด, กรอบเมนู)
  6. `Other Game Assets (Audio & Fonts)` (เสียง `SFX` ทุกจังหวะสำคัญ, เพลง `BGM`, และฟอนต์ไทย/อังกฤษ)

### มิติที่ 4: `Pillar 4 — Technical Architecture & UX/UI Wireframe` (สถาปัตยกรรมโค้ดและผังหน้าจอ)
- **โครงสร้างไฟล์แบบแยกโมดูล (`Modular File Structure`):**
  - แยกไฟล์ `config.js` / `constants.js` ออกจาก `logic` เสมอ
- **แผนประสิทธิภาพและหน่วยความจำ (`Game Loop & Object Pooling Plan`):**
  - ระบุการตั้งค่า `Frame-Rate-Independent Game Loop` (`deltaTime` + `maxDeltaTime`)
  - ระบุรายการออบเจกต์ที่ต้องใช้ `Object Pool` (เช่น กระสุน, ศัตรู, พาร์ทิเคิล, ข้อความดาเมจ) เพื่อรักษาหลักการ `No Per-Frame Allocations`
- **โครงสร้างสถานะและระบบเซฟ (`State Machine & Versioned Save Data`):**
  - สถานะของเกม (`BOOT -> MENU -> TUTORIAL -> PLAYING -> PAUSED -> GAME_OVER`)
  - โครงสร้าง JSON ของเซฟเกมที่มี `schemaVersion: 1`
- **แผนผังหน้าจอ (`ASCII UX/UI Wireframes`):**
  - วาดแผนผัง `ASCII Wireframe` ของหน้า `Main Menu`, หน้าจอเล่นจริง (`HUD`), หน้า `Pause / Settings`, และระบบสอนเล่น (`Tutorial`)
  - *(หากเกมมีระบบออนไลน์/Leaderboard/Multiplayer ให้ระบุจุดเชื่อมต่อสกิล `@supabase`, `@supabase-matchmaking`, หรือ `@supabase-voice-chat` เป็นทางเลือกที่ต้องขออนุมัติ BIG Decision)*

### มิติที่ 5: `Pillar 5 — Step-by-Step Milestone Roadmap & Scope Creep Guard` (แผนการทำงานทีละเฟสและเกราะกันงานบานปลาย)
- **การแบ่งเฟสทำงาน (`Vertical Slice Milestones`):** แบ่งเป็น 4–6 เฟสย่อย โดยแต่ละเฟสต้องระบุ:
  - *สิ่งที่สร้างในเฟสนี้ (`Deliverables`)*
  - *ไฟล์ที่เกี่ยวข้อง (`Target Files`)*
  - *วิธีทดสอบและเกณฑ์ผ่าน (`Verification Criteria`)*
  - *เช็กลิสต์ความสมบูรณ์ 7 ข้อ (`Finished & Polished Gate`: Menu, Sound, Effects, Tutorial, Save System, Characters, No Known Bugs)*
- **เกราะป้องกันงานบานปลาย (`Scope Creep Guard`):**
  - ตารางแยกชัดเจนระหว่าง **`Must-Have (MVP — ต้องมีในเวอร์ชันแรก)`** กับ **`Nice-to-Have / Postpone (เลื่อนไปทำเฟสเสริมหลังตัวเกมหลักเสร็จ)`** พร้อมประเมินต้นทุนเวลาและความซับซ้อน

---

## 3. รูปแบบการส่งมอบแผนงาน (Plan Delivery Options)

1. **แสดงแผนงานฉบับละเอียดในช่องแชท** (พร้อม `ASCII Wireframe` ของหน้าจอเกม และ `Mermaid Flowchart` ของ `Core Loop` / `State Machine`)
2. **ถามคุณ `game` ตอนท้ายแผนงาน:**
   - ต้องการปรับแก้ส่วนไหนของแผนหรือไม่?
   - ต้องการให้บันทึกแผนนี้ลงไฟล์ `GAME_PLAN.md` ในโปรเจกต์เพื่อใช้ติ๊ก `[x]` ติดตามงานทีละเฟส หรือดูเฉพาะในแชทแล้วเริ่มลุย `Milestone 1` เลย?
