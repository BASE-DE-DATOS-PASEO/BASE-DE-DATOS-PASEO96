-- ==========================================
-- PASEO 96 — PROD MODE (reactiva RLS)
-- ==========================================
-- Ejecutar cuando Google Auth ya esté configurado y probado.
-- Vuelve a proteger tablas y elimina la política abierta de Storage usada
-- solamente para desarrollo sin auth real.
-- ==========================================

alter table categorias    enable row level security;
alter table puesteros     enable row level security;
alter table productos     enable row level security;
alter table solicitudes   enable row level security;
alter table egresos       enable row level security;

drop policy if exists "dev_storage_all" on storage.objects;

-- ==========================================
-- LISTO. Asegurate de haber ejecutado antes:
-- 1. supabase/schema.sql
-- 2. supabase/storage.sql
-- y de tener Google Auth funcionando para el admin y los puesteros.
-- ==========================================
