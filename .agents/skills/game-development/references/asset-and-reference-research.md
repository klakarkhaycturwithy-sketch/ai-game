# คู่มือปฏิบัติการทีมค้นคว้าหาภาพอ้างอิงและ Asset ระดับผู้เชี่ยวชาญสูงสุด (Elite Asset & Reference Research Team Handbook)

เอกสารนี้คือคัมภีร์ปฏิบัติการของ **`Elite Asset & Reference Research Team`** ภายใต้ระบบผู้ช่วยส่วนตัว **"Game Dev Partner"** (`/game-development`) ซึ่งมีหน้าที่แก้ปัญหาที่ปวดหัวที่สุดของคุณ **game** ด้วยการเป็นทีมค้นคว้าที่เก่ง ฉลาด และแม่นยำที่สุดในการเสาะหาทั้ง **ภาพอ้างอิง (`Reference Materials`)** และ **ไฟล์ใช้งานจริง (`Ready-to-Use Game Assets`)**

---

## 1. บทบาทและตำแหน่งในสายบังคับบัญชา (Role & Pipeline Position)

- **ตำแหน่งในสายงาน:** ทำงานในขั้น **`Stage 3.5: Elite Asset & Reference Research`** (ต่อจาก `Stage 3: Task Delegation` และทำงานร่วมกับ `Technical Artist & Asset Scout` รวมถึงเรียกใช้ `Subagent` ค้นหาข้อมูลเว็บจริง) เพื่อเตรียมภาพอ้างอิงและ Asset ทั้ง 6 หมวดให้พร้อมก่อนส่งเข้าขั้น `Stage 4: Frontend/Backend Development` และ `Stage 5: UX/UI Design`
- **เป้าหมายสูงสุดของทีมค้นคว้า:**
  1. หยุดปัญหา "หา Asset ไม่เจอ" หรือ "ได้ Asset คนละสไตล์มาปนกันจนเกมดูไม่เป็นมืออาชีพ"
  2. คัดกรองทั้งความสวยงาม ความเข้ากันของโทนสี (`Art Direction Consistency`) ความพร้อมใช้งานทางเทคนิค และความปลอดภัยด้านลิขสิทธิ์ 100%

---

## 2. หมวดหมู่เป้าหมายทั้ง 6 หมวดหลัก และแหล่งค้นหาชั้นนำ (6 Core Research Categories & Trusted Sources)

### หมวดที่ 1: `Illustrations & Characters` (ภาพประกอบ, คอนเซปต์อาร์ต, ตัวละคร 2D/3D)
- **สิ่งที่ค้นหา:** ภาพต้นแบบตัวละคร (`Character Concept Art`), ภาพประกอบฉากเปิดเกม (`Key Art / Illustrations`), ตัวละคร 2D (`Sprite Sheets` ที่มีท่า `Idle`, `Run`, `Jump`, `Shoot`, `Hit`, `Death` ครบ), และโมเดลตัวละคร 3D (`Rigged 3D Characters` พร้อมแอนิเมชันพื้นฐาน)
- **เกณฑ์คัดกรองทางเทคนิค:** ขนาดเฟรมของ `Sprite Sheet` ต้องเท่ากันทุกเฟรม พื้นหลังโปร่งใส (`PNG Transparent`) หรือเป็นไฟล์ `GLTF/GLB` มาตรฐานสำหรับ 3D
- **แหล่งค้นหาชั้นนำ:**
  - *In-Game Free Assets:* `Kenney.nl (CC0)`, `itch.io (Free Game Assets - Character Sprites)`, `Quaternius (CC0 3D Characters)`, `Mixamo (3D Characters & Animations)`, `OpenGameArt.org`, `CraftPix.net (Freebies)`
  - *Visual References:* `ArtStation`, `Behance`, `Pinterest`, หน้าเพจเกมต้นแบบบน `Steam` / `itch.io`

### หมวดที่ 2: `Backgrounds & Environments` (ฉากหลัง, แผนที่, ฉาก 3D)
- **สิ่งที่ค้นหา:** ฉากหลังเลื่อนตามความลึก (`Parallax Backgrounds` แยกเลเยอร์ หน้า-กลาง-หลัง), ชุดบล็อกสร้างฉาก (`Tilemaps / Tilesets`), โมเดลตึกและธรรมชาติแบบต่อประกอบได้ (`Modular 3D Environment Kits`), และท้องฟ้า (`Skyboxes / HDRIs`)
- **เกณฑ์คัดกรองทางเทคนิค:** ภาพฉากหลังต้องต่อกันได้เนียนแบบไร้รอยต่อ (`Seamless Looping`) และมีความสว่างไม่กลบตัวละครผู้เล่น (`Value Contrast`)
- **แหล่งค้นหาชั้นนำ:** `Ansimuz (Free Parallax/Pixel Environments)`, `Kenney.nl`, `Polyhaven (CC0 HDRIs/Textures/Models)`, `itch.io (Tilesets & Backgrounds)`, `AmbientCG (CC0 PBR Textures)`

### หมวดที่ 3: `Visual Effects / VFX` (เอฟเฟกต์แสง, ระเบิด, พาร์ทิเคิล)
- **สิ่งที่ค้นหา:** ประกายไฟปากกระบอกปืน (`Muzzle Flash`), เส้นวิถีกระสุน (`Bullet Tracers`), ประกายไฟตอนกระสุนกระทบเป้า (`Hit Sparks / Blood / Shield Impact`), ระเบิดและควัน (`Explosion & Smoke Flipbooks`), พาร์ทิเคิลฝุ่น/แสง, และเอฟเฟกต์หน้าจอ (`Shaders`)
- **เกณฑ์คัดกรองทางเทคนิค:** รองรับการผสมสีแบบเพิ่มความสว่าง (`Additive Blending`) หรือพื้นหลังโปร่งใส เฟรมเรตแอนิเมชันลื่นไหล (12–60 FPS)
- **แหล่งค้นหาชั้นนำ:** `Kenney Particle Pack (CC0 - 80+ sprites)`, `BDragon1727 (itch.io Free VFX Sprite Sheets)`, `NYKNCK (Free Pixel Art FX)`, `OpenGameArt VFX Section`

### หมวดที่ 4: `Weapons & Props` (อาวุธ, ปืน, ไอเทม, วัตถุประกอบฉาก)
- **สิ่งที่ค้นหา:** อาวุธปืนสไตล์ FPS/Action (`Assault Rifles`, `Pistols`, `SMGs`, `Snipers`, `Sci-Fi Blasters`), อาวุธประชิด (`Melee / Tactical Knives`), กล่องกระสุน (`Ammo Crates`), ไอเทมฟื้นพลัง (`Health Pickups`), ถังระเบิด และที่กำบัง (`Tactical Cover Props`)
- **เกณฑ์คัดกรองทางเทคนิค:** แยกชิ้นส่วนที่ขยับได้ (เช่น สไลด์ปืน, แม็กกาซีน, จุดปล่อยปลอกกระสุน `Muzzle/Ejection Point`) หรือมีขนาดสัดส่วน (`Scale`) สอดคล้องกับมือตัวละคร
- **แหล่งค้นหาชั้นนำ:** `Kenney Weapon Packs (2D/3D CC0)`, `Quaternius Modular Guns & FPS Pack (CC0)`, `itch.io (Free Weapon Sprites & 3D Low-Poly Guns)`, `Poly Pizza (CC0/CC-BY Props)`

### หมวดที่ 5: `UI Icons & HUD Elements` (ไอคอนสกิล/อาวุธ, กรอบเมนู, เป้าเล็ง)
- **สิ่งที่ค้นหา:** ไอคอนสกิลและอาวุธ (`Skill & Weapon Silhouette Icons`), เป้าเล็งปืน (`Crosshairs / Reticles`), หลอดเลือดและเกราะ (`Health/Shield Bars`), กรอบหน้าต่างเมนู (`9-Slice UI Panels`), ปุ่มกด (`Buttons`), และสัญลักษณ์บอกทิศทางดาเมจ (`Damage Direction Indicators`)
- **เกณฑ์คัดกรองทางเทคนิค:** อ่านง่ายแม้ย่อขนาดเล็ก (`High Silhouette Readability`), เป็นไฟล์ `SVG` หรือ `PNG` คมชัด และมีสถานะปุ่มครบ (`Normal`, `Hover`, `Pressed`, `Disabled`)
- **แหล่งค้นหาชั้นนำ:** `Game-icons.net (4,000+ Free SVG/PNG Game Icons - CC-BY 3.0 / CC0)`, `Kenney UI Pack & Crosshair Pack (CC0)`, `Crusenho / Wenrexa Free UI Kits (itch.io)`, `Lucide / Phosphor Icons (MIT)`

### หมวดที่ 6: `Other Game Assets — Audio & Fonts` (เสียงเอฟเฟกต์, เพลงประกอบ, ฟอนต์)
- **สิ่งที่ค้นหา:** เสียงยิงปืน/รีโหลด (`Weapon & Reload SFX`), เสียงฝีเท้า (`Footsteps`), เสียงคลิกปุ่ม UI (`UI Feedback SFX`), เพลงประกอบวนลูป (`Seamless BGM Loops`), และฟอนต์ที่อ่านง่ายทั้งภาษาไทยและอังกฤษ
- **แหล่งค้นหาชั้นนำ:** `Sonniss GDC Game Audio Bundles (Free Commercial Royalty-Free)`, `Kenney Audio Packs (CC0)`, `Freesound.org (Filter: CC0 Only)`, `JSFXR / LabChirp (Procedural Retro/Action SFX Generator)`, `Google Fonts (OFL - Noto Sans Thai, Chakra Petch, Kanit, Press Start 2P)`

---

## 3. กระบวนการคัดกรองอัจฉริยะ 4 ขั้น (4-Step Smart Curation & License Protocol)

ทุกครั้งที่ทีมค้นคว้าทำงาน ต้องผ่าน 4 ด่านนี้ก่อนนำเสนอคุณ **game**:

1. **ด่านที่ 1: ตรวจสอบความเข้ากันของสไตล์ภาพและโทนสี (`Art Direction & Palette Consistency`)**
   - ห้ามนำภาพ Pixel Art 16-bit ไปปนกับภาพ Vector HD หรือ 3D สมจริงโดยไม่มีการคุมธีม
   - ระบุชุดสีแนะนำ (`Recommended Color Palette` เป็นรหัส `HEX`) เพื่อให้ตัวละคร ฉากหลัง อาวุธ VFX และ UI กลืนเป็นเกมเดียวกัน
2. **ด่านที่ 2: แยกป้ายกำกับชัดเจนระหว่าง `[Reference Only]` กับ `[In-Game Asset]`**
   - **`[Reference Only]` (ภาพอ้างอิง/แรงบันดาลใจ):** ใช้เพื่อดูการจัดวางองค์ประกอบ โทนสี หรือท่าทางเท่านั้น **ห้ามดาวน์โหลดไฟล์ไปใส่ในโค้ดเกมโดยตรงเด็ดขาด**
   - **`[In-Game Asset]` (ไฟล์สำหรับนำเข้าเกม):** ต้องเป็นไฟล์ฟรีที่มีสัญญาอนุญาตชัดเจนและพร้อมนำเข้าโปรเจกต์
3. **ด่านที่ 3: เปิดอ่านข้อความสัญญาอนุญาตจริงจากต้นทาง (`Real License Text Inspection`)**
   - ต้องตรวจสอบจากหน้าเว็บต้นทางจริงว่าเป็น `CC0 (Public Domain)`, `CC-BY 4.0`, `MIT`, `SIL OFL`, หรือ `Custom Free Commercial License`
   - หากหน้าเว็บไม่ระบุสัญญาอนุญาตชัดเจน หรือห้ามใช้เชิงพาณิชย์ (`Non-Commercial Only`) ต้องติดป้ายเตือน **`[NOT USABLE FOR COMMERCIAL]`** และแจ้งถามคุณ `game` ก่อนเสมอ
4. **ด่านที่ 4: ขออนุมัติจากคุณ `game` และบันทึกลง [ASSETS.md](/ASSETS.md)**
   - เสนอรายการที่คัดสรรแล้วให้คุณ `game` เลือกและอนุมัติก่อนดาวน์โหลดหรือเขียนโค้ดดึงมาใช้
   - บันทึกทุกรายการลงใน `ASSETS.md` ให้ครบทุกคอลัมน์ (รวมถึง `Category` และ `Usage Type`)
