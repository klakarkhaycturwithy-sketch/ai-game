# Supabase Auth Patterns — รูปแบบการยืนยันตัวตนสำหรับเกม Web

> ใช้เมื่อเกมต้องการ **บัญชีผู้เล่น, guest mode, OAuth, profile** 
> โหลดสกิลหลัก `supabase` + reference นี้เมื่อต้องออกแบบ auth flow

## 1. รูปแบบ Auth ที่เหมาะกับเกม

| รูปแบบ | ใช้เมื่อ | ข้อดี | ข้อเสีย |
|---|---|---|---|
| **Anonymous (Guest)** | เกม casual, ไม่อยากบังคับสมัคร | friction ต่ำ, เซฟได้ทันที | ถ้าเคลียร์เบราว์เซอร์จะหาย; ไม่สามารถกู้คืนได้ |
| **Email/Password** | เซฟถาวร, leaderboard | มาตรฐาน, กู้คืนได้ | friction สูง, ต้องยืนยันอีเมล |
| **Magic Link** | ไม่อยากจำรหัสผ่าน | UX ดี | ต้องเข้าอีเมล |
| **OAuth (Google/Discord/GitHub)** | เกมเมอร์, ลด friction | สมัครเร็ว, ข้อมูลโปรไฟล์พร้อม | ต้องตั้งค่า provider |
| **Guest → Upgrade** | เริ่ม guest แล้วค่อยผูกบัญชี | best of both worlds | ซับซ้อน (ต้อง merge data) |

> **Recommended Default สำหรับคุณ `game`:** เริ่มจาก **Anonymous (Guest)** สำหรับ prototype/portfolio → เพิ่ม **Guest → Upgrade (Email หรือ Discord OAuth)** เมื่อต้องการเซฟถาวร/leaderboard (BIG decision: เพิ่ม OAuth provider ต้องตั้งค่าใน Dashboard)

## 2. Anonymous (Guest) Login

```js
// เข้าสู่ระบบแบบ guest (ไม่ต้องสมัคร)
const { data, error } = await supabase.auth.signInAnonymously();
// data.user.id = UUID ของ guest (ใช้เป็น key ใน DB)
// data.session = session token (เก็บใน localStorage อัตโนมัติ)
```

### Guest → Upgrade (ผูกบัญชีภายหลัง)
```js
// ผู้เล่น guest ต้องการเซฟถาวร → สมัครด้วย email
const { data, error } = await supabase.auth.updateUser({
  email: 'player@example.com',
  password: 'strong-password'
});
// หรือ link identity (OAuth)
const { data, error } = await supabase.auth.linkIdentity({ provider: 'discord' });
```
> **WHY Guest→Upgrade:** ลด friction ตอนเริ่มเล่น (เริ่มได้ทันที) แต่ยังอนุญาตให้เซฟถาวรภายหลัง — เหมาะกับเกมที่ต้องการ conversion สูง

## 3. Auth State Listener (สำคัญ)

```js
// ฟังการเปลี่ยนแปลง session (login/logout/refresh)
supabase.auth.onAuthStateChange((event, session) => {
  switch (event) {
    case 'INITIAL_SESSION':
      // โหลดข้อมูลเริ่มต้น (เมื่อ refresh หน้า)
      loadPlayerData(session?.user);
      break;
    case 'SIGNED_IN':
      // ผู้เล่น login → โหลด profile/save
      loadPlayerData(session.user);
      break;
    case 'SIGNED_OUT':
      // ผู้เล่น logout → กลับหน้า guest/login
      showLoginScreen();
      break;
    case 'TOKEN_REFRESHED':
      // token รีเฟรชอัตโนมัติ → ไม่ต้องทำอะไร (หรืออัปเดต UI)
      break;
  }
});
```
> **WHY onAuthStateChange:** เพื่อให้ UI ตอบสนองเมื่อ session เปลี่ยน (refresh หน้า, token หมดอายุ) โดยไม่ต้อง reload ทั้งหน้า — สำคัญสำหรับ SPA เกม

## 4. Profile Table (ข้อมูลผู้เล่น)

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- trigger: สร้าง profile อัตโนมัติเมื่อสมัคร
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

```js
// โหลด profile
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

// อัปเดต username
const { error } = await supabase
  .from('profiles')
  .update({ username: 'newName' })
  .eq('id', user.id);
```

## 5. OAuth (Discord/Google) — เหมาะกับเกมเมอร์

### ตั้งค่า (Dashboard)
1. Supabase Dashboard → Authentication → Providers → เปิด provider (Discord/Google)
2. ใส่ Client ID/Secret จาก provider
3. ตั้ง Redirect URL: `https://yourgame.com/auth/callback` (หรือ `http://localhost:3000` สำหรับ dev)

### โค้ด
```js
// Login with Discord
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'discord',
  options: {
    redirectTo: window.location.origin + '/auth/callback',
    scopes: 'identify email'
  }
});

// Callback page (auth/callback) — Supabase จัดการ token อัตโนมัติ
// แค่ redirect กลับหน้าเกม
```

> **WHY Discord:** ชุมชนเกมใช้ Discord กันมาก → ลด friction ในการสมัคร และได้ avatar/username พร้อมใช้

## 6. Session Management & Security

- **Token** เก็บใน localStorage (Supabase client จัดการอัตโนมัติ)
- **Auto refresh** token ก่อนหมดอายุ (Supabase จัดการ)
- **Sign out:** `await supabase.auth.signOut()` → เคลียร์ session
- **Session timeout:** ตั้งค่าใน Dashboard (Auth → Settings → JWT expiry)
- **Multi-tab:** Supabase sync session ข้าม tab อัตโนมัติ (BroadcastChannel)

### ความปลอดภัย
- ใช้ **HTTPS** ใน production เสมอ
- อย่าเก็บ password ใน memory/state ของเกม
- ใช้ **RLS** ป้องกันข้อมูล (ดู skill หลัก `supabase` section 8)
- **PKCE flow** เป็น default สำหรับ OAuth (ปลอดภัยกว่า implicit flow)

## 7. Common Auth Mistakes

1. **ไม่ฟัง onAuthStateChange** → UI ไม่อัปเดตเมื่อ session หมดอายุ
2. **เรียก getUser() ทุก request** → ช้า; ใช้ session จาก listener แทน
3. **ลืม handle INITIAL_SESSION** → เมื่อ refresh หน้า ข้อมูลไม่โหลด
4. **ไม่สร้าง profile trigger** → profile เป็น null สำหรับผู้ใช้ใหม่
5. **OAuth redirect URL ไม่ตรง** → login ล้มเหลว (ต้องตรงกับ Dashboard config)
6. **ไม่ sign out ก่อน switch account** → state ปนกัน

## 8. Checklist ก่อนปล่อยเกมที่มี Auth

- [ ] Guest login ทำงาน (เริ่มเล่นได้ทันที)
- [ ] Guest → Upgrade ทำงาน (ถ้ามี)
- [ ] onAuthStateChange handle ครบทุก event
- [ ] Profile สร้างอัตโนมัติเมื่อสมัคร
- [ ] OAuth redirect URL ตรงกับ Dashboard
- [ ] Sign out เคลียร์ state ทั้งหมด
- [ ] ทดสอบ refresh หน้า → session ยังอยู่
- [ ] ทดสอบ token expired → re-auth ทำงาน
- [ ] RLS ป้องกันข้อมูลผู้ใช้ (ดู skill หลัก)

## 9. Alternatives

| บริการ | จุดเด่น | จุดด้อย |
|---|---|---|
| **Supabase Auth** | integrated, RLS, OAuth หลาย provider | ต้องเรียนรู้ |
| **Firebase Auth** | เอกสารเยอะ, provider มาก | vendor lock-in |
| **Auth0 / Clerk** | feature ครบ, UI พร้อม | ค่าใช้จ่าย, overkill สำหรับ indie |
| **Custom (JWT + Node)** | ควบคุมเต็มที่ | ต้อง maintain security เอง |

> **Recommended Default:** Supabase Auth สำหรับ portfolio/indie (integrated กับ DB/RLS); พิจารณา Auth0/Clerk เมื่อต้องการ feature ขั้นสูง (SSO, MFA) และมีรายได้รองรับ (BIG decision)