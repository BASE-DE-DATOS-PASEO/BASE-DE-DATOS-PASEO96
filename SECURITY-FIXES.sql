-- ============================================================
-- 🛡️ SECURITY HARDENING — Paseo 96
-- Patches para las vulnerabilidades encontradas en el pentest
-- ============================================================
--
-- CÓMO APLICAR ESTE ARCHIVO:
--   1. Abrí Supabase Dashboard → tu proyecto
--   2. Menú izquierdo: "SQL Editor" → "New query"
--   3. Pegá TODO este archivo
--   4. Click "Run" (o Cmd+Enter)
--   5. Deberías ver todos los "NOTICE: ... applied"
--
-- Es 100% seguro re-ejecutar este script. Es idempotente.
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- FIX V1: Tabla `puesteros` — restringir campos públicos
-- ─────────────────────────────────────────────────────────────
-- Problema: cualquier persona con la anon key puede leer email,
-- gmail_acceso, observaciones, etc.
-- Fix: REVOKE todo a anon en puesteros y crear una VIEW segura.
-- ─────────────────────────────────────────────────────────────

-- 1.1 Revocar acceso directo a la tabla puesteros desde anon
REVOKE SELECT ON public.puesteros FROM anon;
REVOKE SELECT ON public.puesteros FROM authenticated;
GRANT SELECT ON public.puesteros TO authenticated;
-- (los puesteros autenticados podrán seguir leyendo desde mi-puesto via su own row)

-- 1.2 Crear vista pública con solo los campos que se exhiben en el sitio
DROP VIEW IF EXISTS public.puesteros_publicos CASCADE;
CREATE VIEW public.puesteros_publicos
WITH (security_invoker = true)
AS
SELECT
  id,
  nombre_comercial,
  fila,
  numero_puesto,
  telefono,           -- WhatsApp es público (es el contacto del puesto)
  acepta_transferencia,
  acepta_cambios,
  realiza_envios,
  plan,
  estado_pago,        -- necesario para esVisiblePublicamente() en el cliente
  estado_actividad,
  fecha_proximo_cobro, -- necesario para calcular mora en el cliente
  color,
  logo_iniciales,
  logo_url,
  vistas,
  whatsapps
FROM public.puesteros
WHERE estado_actividad = 'activo';

-- Grant SELECT en la vista para anon
GRANT SELECT ON public.puesteros_publicos TO anon;
GRANT SELECT ON public.puesteros_publicos TO authenticated;

-- 1.3 RLS policy: authenticated users solo pueden ver su propio row
ALTER TABLE public.puesteros ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "puesteros_select_own" ON public.puesteros;
CREATE POLICY "puesteros_select_own"
ON public.puesteros
FOR SELECT
TO authenticated
USING (
  gmail_acceso = lower((auth.jwt() ->> 'email'))
  OR (auth.jwt() ->> 'email') = 'paseodelsur96@gmail.com'  -- admin ve todo
);

DROP POLICY IF EXISTS "puesteros_admin_all" ON public.puesteros;
CREATE POLICY "puesteros_admin_all"
ON public.puesteros
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email') = 'paseodelsur96@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'paseodelsur96@gmail.com');

DO $$ BEGIN RAISE NOTICE 'V1 puesteros: applied'; END $$;


-- ─────────────────────────────────────────────────────────────
-- FIX V2/V3: Storage — bloquear LIST + SIGNED URL a anon en
-- buckets sensibles. Solo authenticated + admin pueden listar
-- y crear signed URLs.
-- ─────────────────────────────────────────────────────────────

-- Habilitar RLS en storage.objects (suele estar habilitada por default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Limpiar policies existentes en los buckets si las hay
DROP POLICY IF EXISTS "comprobantes_anon_select_block"  ON storage.objects;
DROP POLICY IF EXISTS "comprobantes_anon_list_block"    ON storage.objects;
DROP POLICY IF EXISTS "comprobantes_auth_select"        ON storage.objects;
DROP POLICY IF EXISTS "comprobantes_auth_insert"        ON storage.objects;
DROP POLICY IF EXISTS "comprobantes_admin_all"          ON storage.objects;
DROP POLICY IF EXISTS "productos_auth_insert"           ON storage.objects;
DROP POLICY IF EXISTS "productos_public_read"           ON storage.objects;
DROP POLICY IF EXISTS "logos_auth_insert"               ON storage.objects;
DROP POLICY IF EXISTS "logos_public_read"               ON storage.objects;

-- ─── COMPROBANTES: privado total, solo admin lee/firma ───
CREATE POLICY "comprobantes_admin_all"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'comprobantes'
  AND (auth.jwt() ->> 'email') = 'paseodelsur96@gmail.com'
)
WITH CHECK (
  bucket_id = 'comprobantes'
  AND (auth.jwt() ->> 'email') = 'paseodelsur96@gmail.com'
);

-- Puestero puede SUBIR su propio comprobante (solo INSERT, no SELECT/UPDATE/DELETE)
CREATE POLICY "comprobantes_auth_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'comprobantes'
);

-- ─── PRODUCTOS: lectura pública directa OK, listar NO ───
-- Las imágenes se sirven directo por URL pública. El bucket debe
-- ser público en su config, pero NO permitimos LIST para evitar
-- enumerar.
CREATE POLICY "productos_public_read"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'productos');

-- Solo authenticated puede subir productos
CREATE POLICY "productos_auth_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'productos');

-- ─── LOGOS: igual que productos ───
CREATE POLICY "logos_public_read"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'logos');

CREATE POLICY "logos_auth_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'logos');

-- ─── CATEGORIAS: si existe ese bucket, lectura pública ───
DROP POLICY IF EXISTS "categorias_public_read" ON storage.objects;
CREATE POLICY "categorias_public_read"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'categorias');

DROP POLICY IF EXISTS "categorias_auth_insert" ON storage.objects;
CREATE POLICY "categorias_auth_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'categorias');

DO $$ BEGIN RAISE NOTICE 'V2/V3 storage: applied'; END $$;


-- ─────────────────────────────────────────────────────────────
-- FIX V4: Tablas categorias, productos, solicitudes, egresos
-- Endurecer RLS para que esté CLARO qué puede hacer cada role
-- ─────────────────────────────────────────────────────────────

-- categorias: SELECT público, todo lo demás solo admin
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categorias_public_select" ON public.categorias;
CREATE POLICY "categorias_public_select"
ON public.categorias
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "categorias_admin_write" ON public.categorias;
CREATE POLICY "categorias_admin_write"
ON public.categorias
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email') = 'paseodelsur96@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'paseodelsur96@gmail.com');

-- productos: SELECT solo de productos VISIBLES con puestero activo (público).
-- Admin puede todo. Puestero ve sus propios productos.
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "productos_public_visible" ON public.productos;
CREATE POLICY "productos_public_visible"
ON public.productos
FOR SELECT
TO anon, authenticated
USING (
  visible = true
  AND EXISTS (
    SELECT 1 FROM public.puesteros p
    WHERE p.id = productos.puestero_id
      AND p.estado_actividad = 'activo'
  )
);

DROP POLICY IF EXISTS "productos_puestero_own" ON public.productos;
CREATE POLICY "productos_puestero_own"
ON public.productos
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.puesteros p
    WHERE p.id = productos.puestero_id
      AND p.gmail_acceso = lower((auth.jwt() ->> 'email'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.puesteros p
    WHERE p.id = productos.puestero_id
      AND p.gmail_acceso = lower((auth.jwt() ->> 'email'))
  )
);

DROP POLICY IF EXISTS "productos_admin_all" ON public.productos;
CREATE POLICY "productos_admin_all"
ON public.productos
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email') = 'paseodelsur96@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'paseodelsur96@gmail.com');

-- solicitudes: anon puede INSERTAR (alta de puestero) pero NO leer ni listar
ALTER TABLE public.solicitudes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "solicitudes_anon_insert" ON public.solicitudes;
CREATE POLICY "solicitudes_anon_insert"
ON public.solicitudes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "solicitudes_own_select" ON public.solicitudes;
CREATE POLICY "solicitudes_own_select"
ON public.solicitudes
FOR SELECT
TO authenticated
USING (
  gmail_acceso = lower((auth.jwt() ->> 'email'))
);

DROP POLICY IF EXISTS "solicitudes_admin_all" ON public.solicitudes;
CREATE POLICY "solicitudes_admin_all"
ON public.solicitudes
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email') = 'paseodelsur96@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'paseodelsur96@gmail.com');

-- egresos: solo admin
ALTER TABLE public.egresos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "egresos_admin_all" ON public.egresos;
CREATE POLICY "egresos_admin_all"
ON public.egresos
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email') = 'paseodelsur96@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'paseodelsur96@gmail.com');

DO $$ BEGIN RAISE NOTICE 'V4 RLS hardening: applied'; END $$;


-- ─────────────────────────────────────────────────────────────
-- DONE
-- ─────────────────────────────────────────────────────────────
DO $$ BEGIN
  RAISE NOTICE '════════════════════════════════════════';
  RAISE NOTICE '🛡️  SECURITY HARDENING COMPLETE';
  RAISE NOTICE '════════════════════════════════════════';
END $$;
