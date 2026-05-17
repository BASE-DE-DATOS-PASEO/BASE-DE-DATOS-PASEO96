"use client";

import Header from "@/components/admin/Header";
import { useState } from "react";
import {
  Search,
  Plus,
  EyeOff,
  Edit2,
  Package,
  Store,
  X,
  Trash2,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { formatPrecio } from "@/lib/mock-data";
import type { Producto } from "@/lib/mock-data";
import { useStore } from "@/store/useStore";
import { PhotosUploader } from "@/components/PhotoUploader";

export default function ProductosPage() {
  const { productos, puesteros, categorias, deleteProducto } = useStore();
  const [search, setSearch] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [showForm, setShowForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);

  const filtered = productos.filter((p) => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
    const matchCat = filtroCategoria === "todas" || p.categoriaId === Number(filtroCategoria);
    return matchSearch && matchCat;
  });

  const visibles = productos.filter((p) => {
    const pu = puesteros.find((pt) => pt.id === p.puesteroId);
    return p.visible && pu?.estadoActividad === "activo";
  }).length;

  function openEdit(prod: Producto) {
    setEditingProducto(prod);
    setShowForm(true);
  }

  function openNew() {
    setEditingProducto(null);
    setShowForm(true);
  }

  return (
    <>
      <Header
        eyebrow="Catálogo"
        title="Productos"
        subtitle="Todo lo que cargan los puesteros. Editás visibilidad, precios y fotos."
        action={
          <button onClick={openNew} className="v3-admin-btn-accent">
            <Plus size={15} />
            <span className="hidden sm:inline">Nuevo producto</span>
          </button>
        }
      />

      <div className="px-5 sm:px-8 lg:px-12 py-8 sm:py-10">

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {[
            { label: "Cargados", value: productos.length, color: "text-[#0A0A0A]" },
            { label: "En la web", value: visibles, color: "text-[#3B82F6]" },
            { label: "Categorías", value: categorias.length, color: "text-[#0A0A0A]" },
            { label: "Puestos activos", value: puesteros.filter((p) => p.estadoActividad === "activo").length, color: "text-emerald-600" },
          ].map((s) => (
            <div key={s.label} className="v3-stat-card">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">{s.label}</p>
              <p className={`text-3xl sm:text-4xl font-extrabold mt-2 tabular-nums tracking-tight ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              placeholder="Buscar producto…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-[#0A0A0A]/08 rounded-2xl text-[#0A0A0A] placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#0A0A0A] focus:shadow-[0_0_0_4px_rgba(10,10,10,0.04)] transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="appearance-none w-full sm:w-auto bg-white border border-[#0A0A0A]/08 rounded-2xl pl-4 pr-10 py-3 text-sm font-semibold text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A] cursor-pointer"
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0A0A0A] pointer-events-none" />
          </div>
        </div>

        {/* Grid productos */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {filtered.map((prod) => {
              const puesto = puesteros.find((p) => p.id === prod.puesteroId);
              const isVisible = prod.visible && puesto?.estadoActividad === "activo";
              const catNombre = categorias.find((c) => c.id === prod.categoriaId)?.nombre;

              return (
                <div
                  key={prod.id}
                  className={`group cursor-pointer ${!isVisible ? "opacity-60" : ""}`}
                  onClick={() => openEdit(prod)}
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F2F2EE] transition-all duration-400 group-hover:rounded-3xl">
                    {prod.imagenes[0] ? (
                      <Image
                        src={prod.imagenes[0]}
                        alt={prod.nombre}
                        fill
                        sizes="(max-width: 640px) 50vw, 200px"
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={32} className="text-[#A3A3A3]" />
                      </div>
                    )}

                    {!isVisible && (
                      <div className="absolute top-2.5 left-2.5">
                        <span className="v3-admin-badge v3-admin-badge-neutral !bg-[#0A0A0A] !text-white">
                          <EyeOff size={10} /> Oculto
                        </span>
                      </div>
                    )}

                    {/* Hover actions */}
                    <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(prod); }}
                        className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                        title="Editar"
                      >
                        <Edit2 size={13} className="text-[#0A0A0A]" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteProducto(prod.id); }}
                        className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 hover:bg-rose-50 transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={13} className="text-rose-600" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-3 px-0.5">
                    {catNombre && (
                      <p className="text-[10px] text-[#737373] font-bold uppercase tracking-[0.12em] mb-1.5 truncate">{catNombre}</p>
                    )}
                    <h4 className="text-[13px] font-semibold text-[#0A0A0A] leading-snug line-clamp-2 min-h-[2.4rem]">
                      {prod.nombre}
                    </h4>
                    <div className="mt-2">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-[22px] font-extrabold text-[#0A0A0A] tracking-tight tabular-nums leading-none">
                          {formatPrecio(prod.precioMinorista)}
                        </span>
                        {prod.precioAnterior && (
                          <span className="text-[11px] text-[#A3A3A3] line-through tabular-nums">
                            {formatPrecio(prod.precioAnterior)}
                          </span>
                        )}
                      </div>
                      {puesto && (
                        <p className="mt-2 text-[10px] text-[#737373] flex items-center gap-1 truncate">
                          <Store size={10} />
                          {puesto.nombreComercial}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#0A0A0A]/15 bg-white py-16 text-center">
            <Package size={32} className="text-[#A3A3A3] mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-bold text-[#0A0A0A]">Sin resultados</p>
            <p className="text-sm text-[#737373] mt-1">Probá cambiar el filtro o la búsqueda</p>
          </div>
        )}
      </div>

      {showForm && (
        <ProductoForm
          producto={editingProducto}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}

/* ── Formulario v3 ── */

function ProductoForm({
  producto,
  onClose,
}: {
  producto: Producto | null;
  onClose: () => void;
}) {
  const { addProducto, updateProducto, deleteProducto, puesteros, categorias } = useStore();
  const isEditing = !!producto;

  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [categoriaId, setCategoriaId] = useState<number>(producto?.categoriaId ?? 0);
  const [subcategoria, setSubcategoria] = useState(producto?.subcategoria ?? "");
  const [puesteroId, setPuesteroId] = useState<number>(producto?.puesteroId ?? 0);
  const [precioMinorista, setPrecioMinorista] = useState<number>(producto?.precioMinorista ?? 0);
  const [precioMayorista, setPrecioMayorista] = useState<number>(producto?.precioMayorista ?? 0);
  const [precioAnterior, setPrecioAnterior] = useState<string>(
    producto?.precioAnterior?.toString() ?? ""
  );
  const [talleDesde, setTalleDesde] = useState(producto?.talleDesde ?? "");
  const [talleHasta, setTalleHasta] = useState(producto?.talleHasta ?? "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? "");
  const [imagenes, setImagenes] = useState<string[]>(producto?.imagenes ?? []);
  const [visible, setVisible] = useState(producto?.visible ?? true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const subcategorias = categorias.find((c) => c.id === categoriaId)?.subcategorias ?? [];
  const puestoSel = puesteros.find((p) => p.id === puesteroId);
  const folderFotos = puestoSel
    ? `productos/${puestoSel.fila}-${puestoSel.numeroPuesto}-${puestoSel.gmailAcceso}`
    : "productos/admin";

  function handleSave() {
    const data: Omit<Producto, "id"> = {
      nombre,
      categoriaId,
      subcategoria,
      puesteroId,
      precioMinorista,
      precioMayorista: precioMayorista || null,
      precioAnterior: precioAnterior ? Number(precioAnterior) : null,
      talleDesde,
      talleHasta,
      descripcion,
      imagenes: imagenes.filter((i) => i.trim()),
      visible,
      fechaCarga: producto?.fechaCarga ?? new Date().toISOString().split("T")[0],
    };
    if (isEditing) {
      updateProducto(producto.id, data);
    } else {
      addProducto(data);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-0 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:mx-4 sm:rounded-3xl border border-[#0A0A0A]/08">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#0A0A0A]/06 bg-white/95 backdrop-blur-md px-6 py-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#3B82F6]">
              {isEditing ? "Editar" : "Crear"}
            </span>
            <h3 className="text-xl font-bold text-[#0A0A0A] tracking-tight mt-0.5 truncate max-w-xs">
              {isEditing ? producto.nombre : "Nuevo producto"}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#0A0A0A]/04 text-[#525252]" aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-7 p-6">

          {/* Puesto */}
          <Field label="Puesto asociado" required>
            <select
              value={puesteroId}
              onChange={(e) => setPuesteroId(Number(e.target.value))}
              className="v3-admin-input"
            >
              <option value={0}>Seleccionar puesto…</option>
              {puesteros.filter((p) => p.estadoActividad === "activo").map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombreComercial} — Fila {p.fila}, Puesto {p.numeroPuesto}
                </option>
              ))}
            </select>
          </Field>

          {/* Nombre */}
          <Field label="Nombre del producto" required>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Remera Lisa Oversize"
              className="v3-admin-input"
            />
          </Field>

          {/* Fotos */}
          <div>
            <span className="text-xs font-semibold text-[#525252] block mb-2">
              Fotos del producto
            </span>
            <PhotosUploader
              label=""
              values={imagenes}
              onChange={setImagenes}
              folder={folderFotos}
              max={5}
            />
          </div>

          {/* Categoría + Subcategoría */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Categoría" required>
              <select
                value={categoriaId}
                onChange={(e) => { setCategoriaId(Number(e.target.value)); setSubcategoria(""); }}
                className="v3-admin-input"
              >
                <option value={0}>Seleccionar…</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </Field>
            <Field label="Subcategoría">
              <select
                value={subcategoria}
                onChange={(e) => setSubcategoria(e.target.value)}
                className="v3-admin-input"
              >
                <option value="">Seleccionar…</option>
                {subcategorias.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Precios */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Precio minorista" required>
              <PriceInput value={precioMinorista || ""} onChange={(v) => setPrecioMinorista(Number(v))} />
            </Field>
            <Field label="Precio mayorista">
              <PriceInput value={precioMayorista || ""} onChange={(v) => setPrecioMayorista(Number(v))} />
            </Field>
            <Field label="Precio anterior" hint="Aparece tachado">
              <PriceInput value={precioAnterior} onChange={setPrecioAnterior} />
            </Field>
          </div>

          {/* Talles */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Talle desde">
              <input type="text" value={talleDesde} onChange={(e) => setTalleDesde(e.target.value)} placeholder="S / 36 / 1" className="v3-admin-input" />
            </Field>
            <Field label="Talle hasta">
              <input type="text" value={talleHasta} onChange={(e) => setTalleHasta(e.target.value)} placeholder="XL / 46 / 14" className="v3-admin-input" />
            </Field>
          </div>

          {/* Descripción */}
          <Field label="Descripción">
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Material, características, colores…" rows={3} className="v3-admin-input resize-none" />
          </Field>

          {/* Visible toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAF7] border border-[#0A0A0A]/06">
            <div>
              <p className="text-sm font-semibold text-[#0A0A0A]">Visible en la web</p>
              <p className="text-xs text-[#737373] mt-0.5">Si lo apagás, no aparece en Paseo 96</p>
            </div>
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)] ${
                visible ? "bg-[#3B82F6]" : "bg-[#0A0A0A]/15"
              }`}
              aria-pressed={visible}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
                  visible ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex flex-col gap-3 border-t border-[#0A0A0A]/06 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          {isEditing ? (
            confirmDelete ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-rose-700 font-semibold">¿Seguro?</span>
                <button onClick={() => { deleteProducto(producto.id); onClose(); }} className="px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700">
                  Sí, eliminar
                </button>
                <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 text-xs font-semibold text-[#525252] hover:text-[#0A0A0A]">
                  No
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="v3-admin-btn-danger">
                <Trash2 size={14} /> Eliminar
              </button>
            )
          ) : <span />}

          <div className="flex gap-2 sm:gap-3 sm:ml-auto">
            <button onClick={onClose} className="v3-admin-btn-ghost">Cancelar</button>
            <button onClick={handleSave} className="v3-admin-btn">
              {isEditing ? "Guardar cambios" : "Publicar producto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-[#525252] block mb-1.5">
        {label} {required && <span className="text-[#3B82F6]">*</span>}
      </span>
      {children}
      {hint && <span className="text-[11px] text-[#A3A3A3] block mt-1">{hint}</span>}
    </label>
  );
}

function PriceInput({ value, onChange }: { value: string | number; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#737373] font-semibold">$</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="v3-admin-input pl-8 tabular-nums"
      />
    </div>
  );
}
