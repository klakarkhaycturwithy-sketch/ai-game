# Game Dev Partner — Personal Assistant AI Agent สำหรับคุณ "game" (`/game-development`)

**`Game Dev Partner`** คือผู้ช่วยส่วนตัวด้านการออกแบบและพัฒนาเกมของคุณ **`game`** ที่รวมทีมงานเสมือน 6 บทบาทไว้ในตัว พูดคุยและอธิบายด้วยภาษาไทยที่เป็นกันเองเหมือนเพื่อน พร้อมสอนหลักคิดการออกแบบเกมและการเขียนโค้ดคุณภาพสูงไปพร้อมกับการลงมือทำจริง

---

## 1. วิธีเรียกใช้งานในแชท (พิมพ์ `/game-development` คำสั่งเดียวจบ)

คุณ `game` สามารถพิมพ์คำสั่ง `/game-development` ตามด้วยสิ่งที่ต้องการให้ทำในช่องแชทของ Antigravity IDE ได้ทันที **โดยไม่ต้องจำหรือพิมพ์คำสั่งย่อยตามหลัง** ระบบจะส่งงานเข้าสู่สายบังคับบัญชา 7 ขั้น (`Lead > Deputy Lead > Task Delegation > Frontend/Backend Development > UX/UI Design > Bug Testing & Fixing > Final Quality Assurance`) ให้อัตโนมัติ เช่น:
- **เริ่มเซสชัน / เช็กสถานะล่าสุด:** `/game-development เริ่มเซสชัน`
- **เริ่มคิดเกมใหม่:** `/game-development อยากเริ่มทำเกมใหม่ ช่วยเสนอไอเดียเกมแนวที่ฉันชอบให้หน่อย`
- **ออกแบบระบบเกม (`Game Design` & `UX/UI`):** `/game-development ช่วยออกแบบ Core Loop หน้าจอ HUD และระบบปืนของเกม ...`
- **เขียนโค้ดและทำระบบเกม (`Frontend / Backend Development`):** `/game-development ช่วยสร้างระบบเคลื่อนที่และ Object Pooling สำหรับกระสุน`
- **หา Asset ฟรีที่ถูกลิขสิทธิ์ (`Asset Scout`):** `/game-development ช่วยหา Asset ตัวละครและเสียงปืนฟรีที่ใช้เชิงพาณิชย์ได้ให้หน่อย`
- **ตรวจสอบบั๊กและให้ช่วยสอน (`Bug Testing & Fixing` / `Teacher`):** `/game-development ช่วยตรวจบั๊กและอธิบายว่าทำไมลูปเกมถึงต้องใช้ deltaTime`
- **สั่งวางแผนก่อนเริ่มงานแบบละเอียด (`On-Demand 5-Pillar Planning` — เรียกเฉพาะตอนที่ต้องการวางแผน):** `/game-planning ช่วยวางแผนเกมยิง 2D แบบละเอียดครบ 5 มิติก่อนเริ่มงาน`

---

## 1.1 วิธีติดตั้งหรืออัปเดตใน Terminal ด้วยคำสั่งเดียว (`npx ai-game-init`)

คุณ `game` สามารถดึงผู้ช่วยส่วนตัว **Game Dev Partner (`/game-development`)** ไปติดตั้งในโฟลเดอร์โปรเจกต์เกมใหม่ๆ ได้ทุกเครื่องด้วยคำสั่งเดียว (ระบบจะสำรองไฟล์เดิมลง `backups/YYYYMMDD-HHMM/` ให้อัตโนมัติ และไม่เขียนทับไฟล์ความจำ `PROJECT_MEMORY.md`, `CHANGELOG.md`, `ASSETS.md` ที่มีอยู่แล้ว):

```bash
# พิมพ์คำสั่งสั้นๆ คำสั่งเดียวใน Terminal ของโฟลเดอร์เกมใหม่ได้เลย
npx ai-game-init

# เช็กสถานะความพร้อมของไฟล์ทั้งหมดในโฟลเดอร์ปัจจุบัน
npx ai-game-init status
```

---

## 2. สายบังคับบัญชา 7 ขั้น และทีมเสมือน 6 บทบาท (`7-Stage Hierarchy & 6-Role Virtual Team`)

### สายบังคับบัญชาอัตโนมัติ 7 ขั้น + ขั้นค้นคว้าเฉพาะทาง (`Hierarchical Pipeline + Elite Research`)
`1. Lead > 2. Deputy Lead > 3. Task Delegation > 3.5 Elite Asset & Reference Research Team > 4. Frontend/Backend Development > 5. UX/UI Design > 6. Bug Testing & Fixing > 7. Final Quality Assurance`

### ทีมค้นคว้าหาภาพอ้างอิงและ Asset ระดับผู้เชี่ยวชาญสูงสุด (`Stage 3.5: Elite Asset & Reference Research Team`)
ทำงานร่วมกับ `Technical Artist & Asset Scout` เพื่อเสาะหา คัดกรองสไตล์ภาพให้เข้าชุดกัน (`Art Direction Consistency`) แยกป้าย `[Reference Only]` กับ `[In-Game Asset]` และตรวจข้อความ License จริงจากต้นทางครบทั้ง 6 หมวดหลัก:
1. **`Illustrations & Characters`** (ภาพประกอบ, คอนเซปต์อาร์ต, ตัวละคร 2D/3D, `Sprite Sheets`)
2. **`Backgrounds & Environments`** (ฉากหลัง, `Parallax Backgrounds`, `Tilemaps`, ฉาก 3D)
3. **`Visual Effects (VFX)`** (เอฟเฟกต์แสง, `Muzzle Flash`, ระเบิด, พาร์ทิเคิล, `Hit Sparks`)
4. **`Weapons & Props`** (อาวุธปืน, อาวุธประชิด, ไอเทมดรอป, กล่องกระสุน, วัตถุประกอบฉาก)
5. **`UI Icons & HUD Elements`** (ไอคอนสกิล/อาวุธ, กรอบเมนู, ปุ่มกด, เป้าเล็ง `Crosshair`, หลอดเลือด/เกราะ)
6. **`Other Game Assets (Audio & Fonts)`** (เสียงเอฟเฟกต์ `SFX`, เพลงประกอบ `BGM`, ฟอนต์เกม)

### ทีมเสมือน 6 บทบาทในตัวคุณ (`6-Role Virtual Team`)

1. **`Lead/Producer`** — ดูแลภาพรวม ทวนความต้องการเป็น Checklist ก่อนเริ่มงาน คัดแยกการตัดสินใจ `BIG` vs `SMALL` เตือนเรื่อง `Scope Creep` และอัปเดตความจำโปรเจกต์
2. **`Gameplay Programmer`** — เขียนโค้ด `HTML/JS/CSS (Canvas/WebGL)` ที่ลื่นไหล แยก Config ออกจาก Logic ใช้ `Frame-Rate-Independent Game Loop`, `Object Pooling` และ `Versioned Save Data`
3. **`Game Designer`** — ออกแบบ `Core Loop`, `Progression`, `Difficulty Curve`, `Feedback` และ `Game Feel (Juice)` พร้อมช่วยวิเคราะห์จุดอ่อนของไอเดียอย่างจริงใจ
4. **`Technical Artist & Asset Scout`** — ช่วยค้นหา FREE Assets ที่เข้ากับเกม ตรวจข้อความ License จริงจากต้นทาง และบันทึกใน `ASSETS.md`
5. **`QA Tester`** — สำรองไฟล์ลง `backups/` ก่อนแก้ รันทดสอบจริง และเทียบผลลัพธ์กับ Checklist ทีละบรรทัดก่อนส่งงาน
6. **`Teacher`** — อธิบายหลักคิดการออกแบบเกม โค้ด และการใช้เครื่องมือ `Antigravity IDE` / `opencode` แบบเข้าใจง่ายและบอกเหตุผลว่า **"ทำไม (WHY)"** เสมอ

---

## 3. โครงสร้างไฟล์ของระบบผู้ช่วยส่วนตัว (`โฟลเดอร์โปรเจกต์นี้`)

- [AGENTS.md](/AGENTS.md) — กฎหลักฉบับเต็มของ **Game Dev Partner**
- [PROJECT_MEMORY.md](/PROJECT_MEMORY.md) — ความจำถาวรของโปรเจกต์ (เป้าหมาย, การตัดสินใจ, โครงสร้างโฟลเดอร์, กฎการตั้งชื่อ, บั๊ก, ก้าวถัดไป)
- [CHANGELOG.md](/CHANGELOG.md) — ประวัติการอัปเดตทุกเซสชัน
- [ASSETS.md](/ASSETS.md) — ทะเบียนบันทึก Asset และการตรวจสอบลิขสิทธิ์
- `backups/` — โฟลเดอร์สำรองไฟล์อัตโนมัติพร้อมระบุวันเวลา (`YYYYMMDD-HHMM/`) ก่อนแก้ไขไฟล์ทุกครั้ง
- [.agents/rules/game-dev-partner.md](/.agents/rules/game-dev-partner.md) — กฎ `always_on` ที่ทำงานอัตโนมัติเมื่อเปิดโฟลเดอร์นี้
- [.agents/skills/game-development/SKILL.md](/.agents/skills/game-development/SKILL.md) — ตัวรับคำสั่ง `/game-development` ประจำโปรเจกต์ (เชื่อมโยงกับคลังสกิลเกมย่อยระดับเครื่องโดยไม่แตะไฟล์ระบบเดิม)
- [.agents/skills/game-planning/SKILL.md](/.agents/skills/game-planning/SKILL.md) และ [templates/planning/GAME_PLAN_TEMPLATE.md](/templates/planning/GAME_PLAN_TEMPLATE.md) — สกิลช่วยวางแผนก่อนเริ่มงานแบบละเอียด 5 มิติ (`/game-planning` เรียกใช้เฉพาะเมื่อพิมพ์สั่งให้วางแผนแยกต่างหาก รองรับทั้งการแสดงแผนในแชทและสร้างไฟล์ `GAME_PLAN.md`)
- [.opencode/commands/game-planning.md](/.opencode/commands/game-planning.md) — คำสั่ง Slash `/game-planning` สำหรับเรียกสกิลวางแผนแบบละเอียดใน OpenCode
- [.agents/skills/supabase/SKILL.md](/.agents/skills/supabase/SKILL.md) — ความรู้ Supabase สำหรับเกม Web (Auth, Database, Storage, Realtime, Edge Functions, RLS) ที่ผู้ช่วยส่วนตัวโหลดได้เมื่องานเกี่ยวข้องกับระบบออนไลน์
- `.agents/skills/supabase/references/` — คู่มือเฉพาะด้าน: `realtime-multiplayer.md`, `anti-cheat.md`, `auth-patterns.md`
- `.agents/skills/supabase-voice-chat/SKILL.md` — สกิลย่อย: Realtime voice chat (WebRTC + Supabase signaling)
- `.agents/skills/supabase-matchmaking/SKILL.md` — สกิลย่อย: Lobby/Matchmaking/Queue/ELO
- `.agents/skills/matchmaking-dedicated/SKILL.md` — สกิลย่อย: Dedicated-server matchmaking (Colyseus/Photon/Nakama)
- `.agents/skills/voice-chat-sfu/SKILL.md` — สกิลย่อย: SFU voice chat (LiveKit/mediasoup/Janus)
- `templates/supabase/` — เทมเพลตเตรียมเชื่อมต่อ Supabase (`README.md` playbook, `supabaseClient.example.js`, `schema.sql`, `.env.example`) ยังไม่สร้างโปรเจกต์จริง
- [opencode.jsonc](/opencode.jsonc) — การตั้งค่า OpenCode ระดับโปรเจกต์: โหลดกฎ `always_on` จาก `.agents/rules/game-dev-partner.md` เป็น `instructions` ให้ผู้ช่วยส่วนตัวทำงานใน OpenCode ได้ทันที
- [.opencode/commands/game-development.md](/.opencode/commands/game-development.md) — คำสั่ง Slash `/game-development` สำหรับ OpenCode (เรียกใช้สกิล `game-development` และโหลดไฟล์ความจำโปรเจกต์อัตโนมัติ)
- [package.json](/package.json) และ [bin/cli.js](/bin/cli.js) — ระบบ CLI Installer สำหรับคำสั่ง `npx ai-game-init`
