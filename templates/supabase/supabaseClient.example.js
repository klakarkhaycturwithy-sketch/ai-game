// supabaseClient.example.js
// คัดลอกไปเป็น src/config/supabaseClient.js แล้วใส่ค่าจริง (หรืออ่านจาก .env)
// ใช้ anon public key เท่านั้น — ห้ามใช้ service_role key ใน frontend!

import { createClient } from '@supabase/supabase-js';

// ถ้าใช้ Vite/Webpack: อ่านจาก import.meta.env / process.env
// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,        // เก็บ session ใน localStorage
    autoRefreshToken: true,     // รีเฟรช token อัตโนมัติ
    detectSessionInUrl: true,   // สำหรับ OAuth callback
  },
  realtime: {
    params: { eventsPerSecond: 10 }, // จำกัด event rate (ประหยัด bandwidth)
  },
});

// Helper: ได้ user ปัจจุบัน (null ถ้ายังไม่ login)
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Helper: sign out
export async function signOut() {
  await supabase.auth.signOut();
}