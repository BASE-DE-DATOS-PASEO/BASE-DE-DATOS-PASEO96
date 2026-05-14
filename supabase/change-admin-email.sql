-- ==========================================
-- PASEO 96 — RESTAURAR GMAIL ADMIN ORIGINAL
-- ==========================================
-- Ejecutar en Supabase SQL Editor.
-- No borra datos. Solo cambia la función que usan las policies RLS.
-- ==========================================

create or replace function is_admin() returns boolean as $$
  select lower(coalesce(auth.jwt()->>'email', '')) = 'paseodelsur96@gmail.com'
$$ language sql stable;

-- Si el nuevo Gmail ya inició sesión con Google y existe en auth.users,
-- este bloque intenta vincularlo con cualquier puesto/admin pendiente si
-- en el futuro se usa gmail_acceso para permisos de dueño.
update puesteros
set user_id = u.id
from auth.users u
where lower(u.email) = lower(puesteros.gmail_acceso)
  and puesteros.user_id is null;

-- ==========================================
-- Listo. El admin real pasa a ser:
-- paseodelsur96@gmail.com
-- ==========================================
