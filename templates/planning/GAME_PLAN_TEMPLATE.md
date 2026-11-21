# GAME_PLAN.md — แม่แบบแผนงานพัฒนาเกมฉบับละเอียด 5 มิติ (5-Pillar Master Game Plan Template)

> สร้างโดยสกิล `/game-planning` ของ **Game Dev Partner** (เรียกใช้งานเมื่อคุณ **game** สั่งวางแผนก่อนเริ่มงาน)

---

## 1. Pillar 1: Goal, Platform & Hardware Lock (เป้าหมายและสเปกหลัก)
- **ชื่อโปรเจกต์ / แนวเกม (`Project Title & Genre`):** `<ระบุชื่อและแนวเกม>`
- **เป้าหมายอันดับ 1 (`#1 Priority Goal`):** `[ ] Fun` | `[ ] Portfolio` | `[ ] Income` | `[ ] Learning`
  - *เหตุผลการจัดแผนตามเป้าหมายนี้ (`WHY`):* `<อธิบายว่าแผนนี้ปรับตามเป้าหมายอันดับ 1 อย่างไร>`
- **เทคโนโลยีหลัก (`Tech Stack`):** `HTML / JS / CSS (Canvas 2D หรือ WebGL)`
- **สเปกเครื่องเป้าหมายและตัวเลือกกราฟิก (`Target Hardware & Quality Settings`):**
  - `Low`: `<รายละเอียด เช่น จำกัดพาร์ทิเคิล 30 ชิ้น, ปิดเงา>`
  - `Medium`: `<รายละเอียด เช่น จำกัดพาร์ทิเคิล 100 ชิ้น, เปิดเอฟเฟกต์มาตรฐาน>`
  - `High`: `<รายละเอียด เช่น พาร์ทิเคิลเต็มรูปแบบ, เปิดแสงและ Screen Shake>`

---

## 2. Pillar 2: Game Design Blueprint — One-Page GDD (พิมพ์เขียวระบบการเล่น)
- **`Core Loop` (วงจรการเล่นหลักทุก 30 วินาที):**
  1. **Action (การกระทำ):** `<ผู้เล่นทำอะไร>`
  2. **Challenge (ความท้าทาย):** `<อุปสรรคหรือศัตรูคืออะไร>`
  3. **Reward & Feedback (รางวัลและการตอบสนอง):** `<ผู้เล่นได้อะไรกลับมา>`
- **`Core Mechanics & Input Abstraction` (ระบบหลักและปุ่มบังคับ):**
  - `MOVE`: `WASD / Arrow Keys`
  - `PRIMARY_ACTION`: `Left Click / Space`
  - `SECONDARY_ACTION`: `Right Click / Shift`
  - `PAUSE`: `Escape / P`
- **`Progression & Difficulty Curve` (การเติบโตและกราฟความยาก):**
  - `<อธิบายการเพิ่มความยากและการอัปเกรดตามเวลาเล่น>`
- **`Game Feel / Juice Checklist` (ความสะใจและการตอบสนอง):**
  - [ ] เอฟเฟกต์ภาพทันทีที่กดปุ่ม (`Muzzle Flash` / `Hit Sparks`)
  - [ ] เสียงตอบสนองแยกตามความแรง (`Impact SFX`)
  - [ ] หน้าจอสั่นเบาๆ เมื่อเกิดการปะทะสำคัญ (`Screen Shake` — เปิด/ปิดได้ใน Settings)
  - [ ] แอนิเมชัน/การกระพริบสีเมื่อได้รับดาเมจ (`Hit Flash`)

---

## 3. Pillar 3: Visual Direction & 6-Category Asset Blueprint (แผนงานภาพและ Asset 6 หมวด)
- **สไตล์ภาพ (`Art Style`):** `<เช่น 2D Pixel Art 32x32 / Clean Vector / Low-Poly 3D>`
- **โทนสีหลัก (`Color Palette HEX`):**
  - Background: `#______` | Primary Accent: `#______` | Player: `#______` | Enemy/Danger: `#______` | UI/HUD: `#______`
- **รายการ Asset สำหรับทีมค้นคว้า `Stage 3.5: Elite Asset & Reference Research Team`:**
  1. **`Illustrations & Characters`:** `<รายการตัวละครและท่าแอนิเมชัน>`
  2. **`Backgrounds & Environments`:** `<รายการฉากหลัง / Tilemaps>`
  3. **`Visual Effects (VFX)`:** `<รายการพาร์ทิเคิลและเอฟเฟกต์>`
  4. **`Weapons & Props`:** `<รายการอาวุธและไอเทมในฉาก>`
  5. **`UI Icons & HUD Elements`:** `<รายการไอคอน เป้าเล็ง และกรอบเมนู>`
  6. **`Other Game Assets (Audio & Fonts)`:** `<รายการเสียง SFX, เพลง BGM, และฟอนต์>`

---

## 4. Pillar 4: Technical Architecture & UX/UI Wireframes (สถาปัตยกรรมโค้ดและผังหน้าจอ)
- **โครงสร้างไฟล์ (`Modular File Structure — แยก Config ออกจาก Logic`):**
  ```text
  project-root/
  ├── index.html
  ├── css/
  │   └── style.css
  └── js/
      ├── config/
      │   └── constants.js       (แยกค่าความเร็ว ดาเมจ สี และขนาดออกจาก Logic)
      ├── core/
      │   ├── gameLoop.js        (Frame-Rate-Independent Loop ด้วย deltaTime)
      │   ├── stateMachine.js    (BOOT -> MENU -> TUTORIAL ->PLAYING -> PAUSED -> GAME_OVER)
      │   ├── inputManager.js    (Input Abstraction)
      │   ├── objectPool.js      (Object Pooling — No Per-Frame Allocations)
      │   └── saveManager.js     (Versioned Save Data: schemaVersion 1)
      ├── entities/
      └── ui/
  ```
- **รายการที่ต้องใช้ `Object Pooling`:** `<เช่น กระสุน (Bullets), พาร์ทิเคิล (Particles), ศัตรู (Enemies)>`
- **โครงสร้างข้อมูลเซฟ (`Versioned Save Schema`):**
  ```json
  {
    "schemaVersion": 1,
    "highScore": 0,
    "unlockedStage": 1,
    "settings": { "quality": "High", "sfxVolume": 0.8, "bgmVolume": 0.6, "screenShake": true }
  }
  ```

---

## 5. Pillar 5: Step-by-Step Milestone Roadmap & Scope Creep Guard (แผนการทำงานทีละเฟส)

### 5.1 เกราะป้องกันงานบานปลาย (`Scope Creep Guard`)
| หมวดฟีเจอร์ | `Must-Have (MVP — ทำในรอบนี้)` | `Nice-to-Have / Postpone (เลื่อนไปเฟสเสริม)` |
| :--- | :--- | :--- |
| **ระบบการเล่น** | `<ฟีเจอร์หลักที่ทำให้เกมเล่นจบครบ Loop>` | `<ฟีเจอร์เสริมที่ใช้เวลานาน>` |
| **เนื้อหา/ด่าน** | `<จำนวนด่าน/ตัวละครขั้นต่ำที่ขัดเกลาจนดีเยี่ยม>` | `<โหมดพิเศษ/บอสเสริม>` |

### 5.2 ตารางเฟสการพัฒนา (`Vertical Slice Milestones`)
- [ ] **Milestone 1: Core Loop & Movement Prototype**
  - *สิ่งที่สร้าง:* โครงไฟล์ `config/constants.js`, `gameLoop.js` (`deltaTime`), การควบคุมตัวละครพื้นฐาน
  - *วิธีทดสอบ (`Verify`):* เปิดเบราว์เซอร์ บังคับตัวละครได้ลื่นไหลที่ 60 FPS โดยไม่มี Error ใน Console
- [ ] **Milestone 2: Core Combat/Mechanics & Object Pooling**
  - *สิ่งที่สร้าง:* ระบบแอ็กชันหลัก, `Object Pool` สำหรับกระสุน/ศัตรู, การตรวจจับการชน (`Collision`)
  - *วิธีทดสอบ (`Verify`):* ยิง/ปะทะได้จริง หน่วยความจำไม่พุ่งเพราะใช้ `Object Pool`
- [ ] **Milestone 3: Verified Assets, UX/UI (Menu/HUD/Pause/Settings) & Tutorial**
  - *สิ่งที่สร้าง:* นำเข้า Asset ที่ผ่านการตรวจ License ใน `ASSETS.md`, หน้า `Main Menu`, `HUD`, `Pause`, `Settings (Quality)`, และ `Tutorial`
  - *วิธีทดสอบ (`Verify`):* กดเริ่มเกมจากเมนู เห็นวิธีเล่น หยุดเกมและปรับกราฟิกได้จริง
- [ ] **Milestone 4: Audio, Game Feel (Juice) & Versioned Save System**
  - *สิ่งที่สร้าง:* ระบบเสียง `SFX/BGM`, เอฟเฟกต์ `Juice`, และ `saveManager.js` (`schemaVersion: 1`)
  - *วิธีทดสอบ (`Verify`):* รีเฟรชหน้าเว็บแล้วข้อมูลเซฟและการตั้งค่าไม่หาย
- [ ] **Milestone 5: Final QA & 7-Item "Finished and Polished" Gate**
  - *เช็กลิสต์ก่อนปิดโปรเจกต์:* `[ ] Menu` `[ ] Sound` `[ ] Effects` `[ ] Tutorial` `[ ] Save System` `[ ] Characters` `[ ] No Known Bugs`
