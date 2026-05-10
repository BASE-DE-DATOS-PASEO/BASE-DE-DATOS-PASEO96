-- ==========================================
-- PASEO 96 — STATS + LOGO PARA PUESTEROS
-- ==========================================
-- Pegá este archivo en SQL Editor → Run.
-- Agrega:
--   • puesteros.logo_url  → URL del logo del puesto (opcional)
--   • puesteros.vistas    → cantidad de veces que se vio el puesto
--   • puesteros.whatsapps → cantidad de clicks de WhatsApp en su puesto
--   • productos.vistas    → cantidad de veces que se vio el producto
--   • productos.whatsapps → cantidad de clicks de WhatsApp del producto
-- + RPC functions para incrementar contadores de manera atómica.
-- ==========================================

-- ── Columnas nuevas (idempotente) ───────────────────────────
alter table puesteros add column if not exists logo_url  text default '';
alter table puesteros add column if not exists vistas    int  default 0;
alter table puesteros add column if not exists whatsapps int  default 0;

alter table productos add column if not exists vistas    int  default 0;
alter table productos add column if not exists whatsapps int  default 0;

-- ── RPC: incrementar vistas de un producto ──────────────────
create or replace function track_vista_producto(p_id bigint)
returns void as $$
begin
  update productos set vistas = coalesce(vistas, 0) + 1 where id = p_id;
end;
$$ language plpgsql;

-- ── RPC: incrementar WhatsApp de un producto + de su puestero ─
create or replace function track_whatsapp_producto(p_id bigint)
returns void as $$
declare
  v_puestero_id bigint;
begin
  update productos
  set whatsapps = coalesce(whatsapps, 0) + 1
  where id = p_id
  returning puestero_id into v_puestero_id;

  if v_puestero_id is not null then
    update puesteros set whatsapps = coalesce(whatsapps, 0) + 1 where id = v_puestero_id;
  end if;
end;
$$ language plpgsql;

-- ── RPC: incrementar vistas de un puesto ────────────────────
create or replace function track_vista_puestero(p_id bigint)
returns void as $$
begin
  update puesteros set vistas = coalesce(vistas, 0) + 1 where id = p_id;
end;
$$ language plpgsql;

-- ── RPC: incrementar WA directo del puesto (botón en /puesto/[id]) ─
create or replace function track_whatsapp_puestero(p_id bigint)
returns void as $$
begin
  update puesteros set whatsapps = coalesce(whatsapps, 0) + 1 where id = p_id;
end;
$$ language plpgsql;

-- Permitir llamarlas desde el frontend (anon)
grant execute on function track_vista_producto(bigint)    to anon, authenticated;
grant execute on function track_whatsapp_producto(bigint) to anon, authenticated;
grant execute on function track_vista_puestero(bigint)    to anon, authenticated;
grant execute on function track_whatsapp_puestero(bigint) to anon, authenticated;

-- ==========================================
-- LISTO.
-- ==========================================
