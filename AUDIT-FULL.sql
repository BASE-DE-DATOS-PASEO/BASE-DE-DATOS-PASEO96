-- ════════════════════════════════════════════════════════════════
-- 🔍 AUDITORÍA EXHAUSTIVA DE SEGURIDAD — Paseo 96
-- Devuelve TODO el estado de seguridad en un solo reporte
-- ════════════════════════════════════════════════════════════════
-- Pegá esto en SQL Editor → Run → copiá el resultado completo
-- ════════════════════════════════════════════════════════════════

WITH
-- 1. Estado de RLS por tabla
tables_rls AS (
  SELECT
    '── 1. TABLAS Y RLS ──' AS section,
    string_agg(
      rpad(tablename, 30) ||
      ' RLS=' || rpad(rowsecurity::text, 6) ||
      ' FORCE=' || forcerowsecurity::text,
      E'\n' ORDER BY tablename
    ) AS data
  FROM pg_tables WHERE schemaname = 'public'
),

-- 2. Buckets de storage
buckets AS (
  SELECT
    '── 2. BUCKETS DE STORAGE ──' AS section,
    string_agg(
      rpad(name, 25) ||
      ' public=' || rpad(public::text, 6) ||
      ' limit=' || COALESCE(file_size_limit::text, 'none'),
      E'\n' ORDER BY name
    ) AS data
  FROM storage.buckets
),

-- 3. Policies de storage.objects
storage_policies AS (
  SELECT
    '── 3. STORAGE POLICIES ──' AS section,
    string_agg(
      rpad(policyname, 45) ||
      ' [' || rpad(cmd, 6) || ']' ||
      ' roles=' || array_to_string(roles, ','),
      E'\n' ORDER BY policyname
    ) AS data
  FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'
),

-- 4. Policies de tablas public
public_policies AS (
  SELECT
    '── 4. POLICIES PUBLIC ──' AS section,
    string_agg(
      rpad(tablename || '.' || policyname, 55) ||
      ' [' || rpad(cmd, 6) || ']' ||
      ' roles=' || array_to_string(roles, ','),
      E'\n' ORDER BY tablename, policyname
    ) AS data
  FROM pg_policies WHERE schemaname = 'public'
),

-- 5. Grants a anon (lo más crítico)
grants_anon AS (
  SELECT
    '── 5. GRANTS A ANON (público) ──' AS section,
    COALESCE(string_agg(
      rpad(table_name, 35) || privileges,
      E'\n' ORDER BY table_name
    ), '(ninguno — perfecto)') AS data
  FROM (
    SELECT table_name, string_agg(privilege_type, ',' ORDER BY privilege_type) AS privileges
    FROM information_schema.role_table_grants
    WHERE table_schema = 'public' AND grantee = 'anon'
    GROUP BY table_name
  ) t
),

-- 6. Grants a authenticated
grants_auth AS (
  SELECT
    '── 6. GRANTS A AUTHENTICATED ──' AS section,
    COALESCE(string_agg(
      rpad(table_name, 35) || privileges,
      E'\n' ORDER BY table_name
    ), '(ninguno)') AS data
  FROM (
    SELECT table_name, string_agg(privilege_type, ',' ORDER BY privilege_type) AS privileges
    FROM information_schema.role_table_grants
    WHERE table_schema = 'public' AND grantee = 'authenticated'
    GROUP BY table_name
  ) t
),

-- 7. Views y su modo de seguridad
views_security AS (
  SELECT
    '── 7. VIEWS (seguridad) ──' AS section,
    COALESCE(string_agg(
      rpad(table_name, 30) ||
      CASE
        WHEN view_definition ILIKE '%security_invoker%' THEN 'INVOKER ✓ (safe)'
        ELSE 'DEFINER ⚠ (revisar!)'
      END,
      E'\n' ORDER BY table_name
    ), '(ninguna)') AS data
  FROM information_schema.views WHERE table_schema = 'public'
),

-- 8. Functions con SECURITY DEFINER (elevadas, peligrosas)
funcs_definer AS (
  SELECT
    '── 8. FUNCTIONS SECURITY DEFINER ──' AS section,
    COALESCE(string_agg(
      rpad(p.proname, 40) ||
      CASE WHEN p.prosecdef THEN 'DEFINER ⚠ (elevada)' ELSE 'INVOKER ✓' END,
      E'\n' ORDER BY p.proname
    ), '(ninguna)') AS data
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public' AND p.prosecdef = true
),

-- 9. Triggers en tablas public
triggers AS (
  SELECT
    '── 9. TRIGGERS ──' AS section,
    COALESCE(string_agg(
      rpad(event_object_table || '.' || trigger_name, 50) ||
      action_timing || ' ' || event_manipulation,
      E'\n' ORDER BY event_object_table, trigger_name
    ), '(ninguno)') AS data
  FROM information_schema.triggers
  WHERE event_object_schema = 'public'
),

-- 10. Roles personalizados (debería ser solo anon/auth/service_role)
custom_roles AS (
  SELECT
    '── 10. ROLES DE BASE DE DATOS ──' AS section,
    string_agg(
      rolname || CASE WHEN rolsuper THEN ' (SUPER!)' ELSE '' END,
      E'\n' ORDER BY rolname
    ) AS data
  FROM pg_roles
  WHERE rolname NOT LIKE 'pg_%'
)

SELECT section || E'\n' || COALESCE(data, '(vacío)') || E'\n' AS reporte
FROM (
  SELECT 1 AS o, * FROM tables_rls UNION ALL
  SELECT 2, * FROM buckets UNION ALL
  SELECT 3, * FROM storage_policies UNION ALL
  SELECT 4, * FROM public_policies UNION ALL
  SELECT 5, * FROM grants_anon UNION ALL
  SELECT 6, * FROM grants_auth UNION ALL
  SELECT 7, * FROM views_security UNION ALL
  SELECT 8, * FROM funcs_definer UNION ALL
  SELECT 9, * FROM triggers UNION ALL
  SELECT 10, * FROM custom_roles
) ordered
ORDER BY o;
