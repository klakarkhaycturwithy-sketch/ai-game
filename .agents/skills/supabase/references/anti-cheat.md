# Supabase Anti-Cheat — การป้องกันโกงในเกม Web

> ใช้เมื่อเกมมี leaderboard, score, หรือ item economy ที่ต้องป้องกันโกง
> โหลดสกิลหลัก `supabase` + reference นี้เมื่อต้องทำ anti-cheat

## 1. หลักการ (WHY)

- **อย่าเชื่อ client** — ผู้เล่นสามารถแก้ไข memory, network request, หรือเรียก API โดยตรงได้
- **Server-authoritative** สำหรับผลลัพธ์สำคัญ (score, win/lose, item drop)
- **Edge Function** เป็น "server" ที่ปลอดภัย (รันบน Supabase, ใช้ service_role key ได้)

## 2. ระดับการป้องกัน (เรียงจากง่าย→ยาก)

| ระดับ | วิธี | เหมาะกับ |
|---|---|---|
| 1 | Client-side validation (sanity check) | ป้องกันบั๊ก/อุบัติเหตุ, ไม่ป้องกันโกงจริง |
| 2 | RLS + auth.uid() | ป้องกันผู้เล่นแก้ข้อมูลคนอื่น |
| 3 | Edge Function validate input | ป้องกันค่าผิดปกติ (score สูงเกินไป) |
| 4 | Server-authoritative simulation | ป้องกันโกงจริง (ยิงโดน, เก็บไอเทม) |
| 5 | Replay/audit + ban | สำหรับเกมจริงจัง/รายได้ |

> **Recommended Default สำหรับคุณ `game`:** ระดับ 2-3 สำหรับ portfolio; ระดับ 4-5 เฉพาะเมื่อเกมจริงจัง/รายได้ (BIG decision + ต้นทุนสูง)

## 3. Edge Function: Validate Score (ตัวอย่าง)

```ts
// supabase/functions/validate-score/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const MAX_SCORE_PER_MINUTE = 1000; // ปรับตามเกม
const MAX_TOTAL = 1_000_000;

serve(async (req) => {
  try {
    const { score, mode, durationSec } = await req.json();

    // 1) ตรวจสอบ auth
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response('unauthorized', { status: 401 });

    // 2) Sanity checks
    if (typeof score !== 'number' || score < 0) return new Response('bad score', { status: 400 });
    if (score > MAX_TOTAL) return new Response('score too high', { status: 400 });
    if (durationSec < 10 && score > 100) return new Response('impossible', { status: 400 });
    if (score / Math.max(durationSec, 1) > MAX_SCORE_PER_MINUTE / 60) {
      return new Response('rate too high', { status: 400 });
    }

    // 3) Insert ด้วย service_role (ปลอดภัย)
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { error } = await admin.from('scores').insert({
      user_id: user.id, score, mode, duration_sec: durationSec
    });
    if (error) return new Response(error.message, { status: 500 });

    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(String(e), { status: 500 });
  }
});
```

### เรียกจาก client
```js
const { data, error } = await supabase.functions.invoke('validate-score', {
  body: { score: 1200, mode: 'classic', durationSec: 90 }
});
```

## 4. RLS สำหรับ Anti-Cheat

```sql
-- scores: ทุกคนอ่านได้, แทรกได้เฉพาะของตัวเอง, แก้ไข/ลบไม่ได้
alter table scores enable row level security;
create policy "scores readable by all" on scores for select using (true);
create policy "users insert own scores" on scores for insert with check (auth.uid() = user_id);
-- ไม่มี policy update/delete → default deny

-- saves: เฉพาะของตัวเอง
create policy "users manage own saves" on saves for all using (auth.uid() = user_id);
```

## 5. Common Anti-Cheat Mistakes

1. **เชื่อ score จาก client โดยตรง** → ผู้เล่นส่ง score ใดๆ ก็ได้
2. **ไม่มี rate limiting** → spam insert
3. **ไม่ validate type/range** → score เป็น string/null/NaN
4. **เปิด update policy** → ผู้เล่นแก้ score เก่าได้
5. **ใช้ client-side only validation** → bypass ได้ง่าย
6. **ไม่ log/audit** → จับโกงย้อนหลังไม่ได้

## 6. Audit Log (สำหรับเกมจริงจัง)

```sql
create table score_audit (
  id bigint generated always as identity primary key,
  user_id uuid,
  score int,
  ip inet,
  user_agent text,
  created_at timestamptz default now()
);
```
- บันทึกทุก attempt (ผ่าน/ไม่ผ่าน) ใน Edge Function
- ใช้สำหรับตรวจสอบย้อนหลังเมื่อพบโกง

## 7. Checklist ก่อนปล่อยเกมที่มี Leaderboard

- [ ] RLS เปิดทุกตารางที่เกี่ยวข้อง
- [ ] Insert score ผ่าน Edge Function (ไม่ใช่ client โดยตรง) — สำหรับเกมจริงจัง
- [ ] Sanity check: score range, duration, rate
- [ ] ไม่มี service_role key ใน frontend
- [ ] Test: ลองส่ง score โกง (สูงเกิน, ลบ, null) → ต้อง reject
- [ ] (ถ้า Income) Audit log + ban mechanism

## 8. ทางเลือก (Alternatives)

| วิธี | จุดเด่น | จุดด้อย |
|---|---|---|
| **Edge Function (Supabase)** | ง่าย, integrated | cold start, Deno runtime |
| **Dedicated game server** | ควบคุมเต็มที่, authoritative | ต้นทุน/ความซับซ้อนสูง |
| **Third-party (PlayFab, GameSparks)** | เครื่องมือครบ | vendor lock-in, ค่าใช้จ่าย |

> **Recommended Default:** Edge Function + RLS สำหรับ portfolio/indie; dedicated server เฉพาะเมื่อเกม competitive/รายได้จริงจัง (BIG decision)