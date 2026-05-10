-- ==========================================
-- PASEO 96 — STORAGE BUCKETS + POLÍTICAS
-- ==========================================
-- Pegá todo este archivo en: Supabase → SQL Editor → New query → Run
-- Crea los 2 buckets necesarios y sus políticas de acceso.
-- ==========================================

-- ── BUCKETS ────────────────────────────────────────────────
-- productos: público (cualquiera puede ver fotos de productos en la web)
-- comprobantes: privado (solo admin ve los comprobantes de transferencia)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('productos',    'productos',    true,  10485760, array['image/jpeg','image/png','image/webp','image/avif']),
  ('comprobantes', 'comprobantes', false, 10485760, array['image/jpeg','image/png','image/webp','image/avif','application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ── POLÍTICAS DE STORAGE ───────────────────────────────────

-- Limpieza idempotente
drop policy if exists "productos_read_public"   on storage.objects;
drop policy if exists "productos_write_owner"   on storage.objects;
drop policy if exists "productos_admin_all"     on storage.objects;
drop policy if exists "comprobantes_insert_any" on storage.objects;
drop policy if exists "comprobantes_admin_read" on storage.objects;
drop policy if exists "comprobantes_admin_all"  on storage.objects;

-- PRODUCTOS: lectura pública, escritura del dueño del puesto o admin
create policy "productos_read_public" on storage.objects
  for select using (bucket_id = 'productos');

create policy "productos_write_owner" on storage.objects
  for insert with check (
    bucket_id = 'productos'
    and auth.uid() is not null
  );

create policy "productos_admin_all" on storage.objects
  for all using (
    bucket_id = 'productos' and is_admin()
  ) with check (
    bucket_id = 'productos' and is_admin()
  );

-- COMPROBANTES: cualquiera puede subir (al hacer una solicitud), solo admin puede leer
create policy "comprobantes_insert_any" on storage.objects
  for insert with check (bucket_id = 'comprobantes');

create policy "comprobantes_admin_all" on storage.objects
  for all using (
    bucket_id = 'comprobantes' and is_admin()
  ) with check (
    bucket_id = 'comprobantes' and is_admin()
  );

-- ==========================================
-- LISTO. Verificá en menú Storage que aparezcan productos + comprobantes.
-- ==========================================
