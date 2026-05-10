-- ==========================================
-- PASEO 96 — DEV MODE (desactiva RLS temporalmente)
-- ==========================================
-- Pegá esto en SQL Editor → Run.
-- Sirve mientras no esté Google Auth.
-- Cuando agreguemos Auth real, ejecutamos `prod-mode.sql` para re-activar RLS.
-- ==========================================

alter table categorias    disable row level security;
alter table puesteros     disable row level security;
alter table productos     disable row level security;
alter table solicitudes   disable row level security;
alter table egresos       disable row level security;

-- Storage policies se mantienen activas; las dejamos abiertas para dev
drop policy if exists "dev_storage_all" on storage.objects;
create policy "dev_storage_all" on storage.objects for all using (true) with check (true);

-- ==========================================
-- ⚠️  IMPORTANTE: este modo es SOLO para desarrollo.
--     Antes de salir a producción re-activamos RLS con prod-mode.sql.
-- ==========================================
