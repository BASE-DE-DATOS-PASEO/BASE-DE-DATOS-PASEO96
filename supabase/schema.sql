-- ==========================================
-- PASEO 96 — SCHEMA INICIAL
-- ==========================================
-- Pegá todo este archivo en: Supabase → SQL Editor → New query → Run
-- ==========================================

-- Limpieza por si re-ejecutás (idempotente)
drop table if exists egresos cascade;
drop table if exists productos cascade;
drop table if exists puesteros cascade;
drop table if exists solicitudes cascade;
drop table if exists categorias cascade;

-- ── CATEGORÍAS ──────────────────────────────────────────────
create table categorias (
  id           bigserial primary key,
  nombre       text not null,
  imagen       text default '',
  subcategorias text[] default '{}',
  created_at   timestamptz default now()
);

-- ── PUESTEROS ───────────────────────────────────────────────
create table puesteros (
  id                    bigserial primary key,
  user_id               uuid references auth.users(id) on delete set null,
  nombre_responsable    text not null,
  nombre_comercial      text not null,
  fila                  text not null,
  numero_puesto         int not null,
  telefono              text not null,
  email                 text not null,
  gmail_acceso          text not null unique,
  acepta_transferencia  boolean default false,
  acepta_cambios        boolean default false,
  realiza_envios        boolean default false,
  plan                  text not null check (plan in ('bronce','plata','oro')),
  limite_productos      int not null,
  productos_activos     int default 0,
  estado_pago           text default 'pendiente' check (estado_pago in ('pagado','pendiente')),
  estado_actividad      text default 'activo' check (estado_actividad in ('activo','inactivo')),
  fecha_alta            date default current_date,
  fecha_proximo_cobro   date not null,
  observaciones         text default '',
  color                 text default '#1E40AF',
  logo_iniciales        text default '',
  created_at            timestamptz default now()
);

create index idx_puesteros_user on puesteros(user_id);
create index idx_puesteros_gmail on puesteros(gmail_acceso);

-- ── PRODUCTOS ───────────────────────────────────────────────
create table productos (
  id                bigserial primary key,
  puestero_id       bigint not null references puesteros(id) on delete cascade,
  categoria_id      bigint references categorias(id) on delete set null,
  nombre            text not null,
  imagenes          text[] default '{}',
  subcategoria      text default '',
  precio_minorista  numeric not null,
  precio_mayorista  numeric,
  precio_anterior   numeric,
  talle_desde       text default '',
  talle_hasta       text default '',
  descripcion       text default '',
  visible           boolean default true,
  fecha_carga       date default current_date,
  created_at        timestamptz default now()
);

create index idx_productos_puestero on productos(puestero_id);
create index idx_productos_categoria on productos(categoria_id);
create index idx_productos_visible on productos(visible);

-- ── SOLICITUDES ─────────────────────────────────────────────
create table solicitudes (
  id                  bigserial primary key,
  nombre_responsable  text not null,
  nombre_comercial    text not null,
  telefono            text not null,
  email               text not null,
  gmail_acceso        text not null,
  fila                text not null,
  numero_puesto       int not null,
  plan_elegido        text not null check (plan_elegido in ('bronce','plata','oro')),
  metodo_pago         text default 'transferencia' check (metodo_pago in ('transferencia','efectivo')),
  monto_transferido   numeric default 0,
  fecha_solicitud     date default current_date,
  comprobante_url     text,
  estado              text default 'pendiente' check (estado in ('pendiente','aprobado','rechazado')),
  observaciones       text default '',
  created_at          timestamptz default now()
);

create index idx_solicitudes_estado on solicitudes(estado);

-- ── EGRESOS ─────────────────────────────────────────────────
create table egresos (
  id          bigserial primary key,
  concepto    text not null,
  categoria   text not null check (categoria in ('publicidad','diseño','hosting','operativo','otros')),
  monto       numeric not null,
  fecha       date default current_date,
  descripcion text default '',
  created_at  timestamptz default now()
);

-- ── SEED CATEGORÍAS BASE ────────────────────────────────────
insert into categorias (nombre, imagen, subcategorias) values
('Mujer', '', array['Jeans','Pantalones','Shorts y calzas','Vestidos y polleras','Remeras y camisas','Buzos y sweaters','Camperas','Calzado','Accesorios','Deportiva','Talles especiales','Lencería y mallas']),
('Hombre', '', array['Jeans','Pantalones','Bermudas y shorts','Remeras','Camisas','Buzos y sweaters','Camperas','Calzado','Accesorios','Deportiva','Talles especiales']),
('Niños', '', array['Bebés','Remeras y camisas','Buzos','Pantalones','Camperas','Calzado','Vestidos y polleras','Accesorios','Juguetes']),
('Otros', '', array['Perfumería y cosméticos','Electrónica','Juguetes','Blanquería','Bazar y hogar','Mascotas','Marroquinería']);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

alter table categorias    enable row level security;
alter table puesteros     enable row level security;
alter table productos     enable row level security;
alter table solicitudes   enable row level security;
alter table egresos       enable row level security;

-- Helper: identificar al admin por email
create or replace function is_admin() returns boolean as $$
  select lower(coalesce(auth.jwt()->>'email', '')) = 'paseodelsur96@gmail.com'
$$ language sql stable;

-- ── CATEGORÍAS: lectura pública, escritura solo admin ───────
create policy "categorias_read_all"   on categorias for select using (true);
create policy "categorias_admin_all"  on categorias for all    using (is_admin()) with check (is_admin());

-- ── PUESTEROS: lectura pública (solo activos), escritura admin, dueño ve todo lo suyo ─
create policy "puesteros_read_public" on puesteros for select using (estado_actividad = 'activo' or auth.uid() = user_id or is_admin());
create policy "puesteros_admin_all"   on puesteros for all    using (is_admin()) with check (is_admin());
create policy "puesteros_owner_update" on puesteros for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── PRODUCTOS: lectura pública (solo visibles), dueño CRUD, admin CRUD ─
create policy "productos_read_public" on productos for select using (visible = true or is_admin() or exists(select 1 from puesteros p where p.id = puestero_id and p.user_id = auth.uid()));
create policy "productos_admin_all"   on productos for all using (is_admin()) with check (is_admin());
create policy "productos_owner_all"   on productos for all using (exists(select 1 from puesteros p where p.id = puestero_id and p.user_id = auth.uid())) with check (exists(select 1 from puesteros p where p.id = puestero_id and p.user_id = auth.uid()));

-- ── SOLICITUDES: cualquiera puede crear (alta de puestero), admin ve y modifica ─
create policy "solicitudes_insert_any" on solicitudes for insert with check (true);
create policy "solicitudes_admin_all"  on solicitudes for all using (is_admin()) with check (is_admin());

-- ── EGRESOS: solo admin ─────────────────────────────────────
create policy "egresos_admin_all" on egresos for all using (is_admin()) with check (is_admin());

-- ==========================================
-- LINK auth.users → puesteros (al hacer login Google)
-- ==========================================
-- Cuando alguien se loguea con Google, su email queda en auth.users.email.
-- Linkeamos automáticamente al puestero que tenga ese gmail_acceso.

create or replace function link_puestero_on_signin()
returns trigger as $$
begin
  update puesteros
  set user_id = new.id
  where lower(gmail_acceso) = lower(new.email)
    and user_id is null;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function link_puestero_on_signin();

-- ==========================================
-- LISTO. Verificá que aparezcan las tablas en Database → Tables.
-- ==========================================
