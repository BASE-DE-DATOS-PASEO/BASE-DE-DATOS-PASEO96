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
} from "lucide-react";
import Image from "next/image";
import { formatPrecio } from "@/lib/mock-data";
import type { Producto } from "@/lib/mock-data";
import { useStore } from "@/store/useStore";
import { PhotosUploader } from "@/components/PhotoUploader";
import clsx from "clsx";

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
      <Header title="Productos" />
      <div className="p-4 sm:p-6 lg:p-8">

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 mb-8 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total cargados", value: productos.length, color: "text-foreground" },
            { label: "Visibles en la web", value: visibles, color: "text-accent" },
            { label: "Categorías", value: categorias.length, color: "text-blue-500" },
            { label: "Puestos activos", value: puesteros.filter((p) => p.estadoActividad === "activo").length, color: "text-emerald-600" },
          ].map((s) => (
            <div key={s.label} className="stat-card p-5 relative z-10">
              <p className="text-xs text-muted font-medium uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl sm:text-3xl font-bold mt-2 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative flex-1 sm:min-w-[200px] sm:max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 sm:w-auto"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          <button
            onClick={openNew}
            className="flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-hover sm:ml-auto"
          >
            <Plus size={16} /> Nuevo producto
          </button>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((prod) => {
              const puesto = puesteros.find((p) => p.id === prod.puesteroId);
              const isVisible = prod.visible && puesto?.estadoActividad === "activo";
              const catNombre = categorias.find((c) => c.id === prod.categoriaId)?.nombre;

              return (
                <div
                  key={prod.id}
                  className={clsx(
                    "group rounded-2xl bg-white border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all duration-300",
                    !isVisible && "opacity-60"
                  )}
                >
                  {/* Image */}
                  <div className="aspect-square relative overflow-hidden bg-gray-50">
                    {prod.imagenes[0] ? (
                      <Image
                        src={prod.imagenes[0]}
                        alt={prod.nombre}
                        fill
                        sizes="(max-width: 768px) 50vw, 200px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={36} className="text-gray-200" />
                      </div>
                    )}

                    {!isVisible && (
                      <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                        <span className="flex items-center gap-1 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full">
                          <EyeOff size={10} /> Oculto
                        </span>
                      </div>
                    )}

                    {/* Hover edit button */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                      <button
                        onClick={() => openEdit(prod)}
                        className="p-1.5 bg-white rounded-lg shadow-md hover:bg-gray-50 text-gray-700"
                        title="Editar"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => deleteProducto(prod.id)}
                        className="p-1.5 bg-white rounded-lg shadow-md hover:bg-red-50 text-red-500"
                        title="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    {catNombre && (
                      <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide mb-1">{catNombre}</p>
                    )}
                    <h4 className="text-sm font-semibold text-foreground leading-tight line-clamp-2 mb-1.5">
                      {prod.nombre}
                    </h4>
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-sm font-bold text-foreground">{formatPrecio(prod.precioMinorista)}</span>
                      {prod.precioAnterior && (
                        <span className="text-xs text-muted line-through">{formatPrecio(prod.precioAnterior)}</span>
                      )}
                    </div>
                    {prod.talleDesde && (
                      <p className="text-[11px] text-muted mb-1.5">Talles: {prod.talleDesde} – {prod.talleHasta}</p>
                    )}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-gray-50 text-[11px] text-muted">
                      <Store size={11} />
                      <span className="truncate">{puesto?.nombreComercial ?? "—"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
            <Package size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-foreground">Sin resultados</p>
            <p className="text-sm text-muted mt-1">Probá cambiar el filtro o la búsqueda</p>
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

/* ── Formulario completo ── */

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
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-0 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:mx-4 sm:rounded-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
          <h3 className="text-lg font-semibold text-foreground">
            {isEditing ? "Editar producto" : "Nuevo producto"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-50 text-muted">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-4 sm:p-6">

          {/* Puesto */}
          <div>
            <label className="text-xs font-medium text-muted block mb-1.5">Puesto asociado *</label>
            <select
              value={puesteroId}
              onChange={(e) => setPuesteroId(Number(e.target.value))}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value={0}>Seleccionar puesto...</option>
              {puesteros.filter((p) => p.estadoActividad === "activo").map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombreComercial} — Fila {p.fila}, Puesto {p.numeroPuesto}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre */}
          <div>
            <label className="text-xs font-medium text-muted block mb-1.5">Nombre del producto *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Remera Lisa Oversize"
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          {/* Fotos */}
          <PhotosUploader
            label="Fotos del producto"
            values={imagenes}
            onChange={setImagenes}
            folder={folderFotos}
            max={5}
          />

          {/* Categoría + Subcategoría */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted block mb-1.5">Categoría *</label>
              <select
                value={categoriaId}
                onChange={(e) => { setCategoriaId(Number(e.target.value)); setSubcategoria(""); }}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20"
              >
                <option value={0}>Seleccionar...</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1.5">Subcategoría</label>
              <select
                value={subcategoria}
                onChange={(e) => setSubcategoria(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20"
              >
                <option value="">Seleccionar...</option>
                {subcategorias.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Precios */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Precio minorista *", value: precioMinorista, set: setPrecioMinorista },
              { label: "Precio mayorista", value: precioMayorista, set: setPrecioMayorista },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="text-xs font-medium text-muted block mb-1.5">{label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">$</span>
                  <input
                    type="number"
                    value={value || ""}
                    onChange={(e) => set(Number(e.target.value))}
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-muted block mb-1.5">Precio anterior <span className="text-[10px] text-muted">(tachado)</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">$</span>
                <input
                  type="number"
                  value={precioAnterior}
                  onChange={(e) => setPrecioAnterior(e.target.value)}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>
          </div>

          {/* Talles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted block mb-1.5">Talle desde</label>
              <input
                type="text"
                value={talleDesde}
                onChange={(e) => setTalleDesde(e.target.value)}
                placeholder="Ej: S, 36, 1"
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1.5">Talle hasta</label>
              <input
                type="text"
                value={talleHasta}
                onChange={(e) => setTalleHasta(e.target.value)}
                placeholder="Ej: XL, 46, 14"
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-xs font-medium text-muted block mb-1.5">Descripción (opcional)</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Material, características, colores disponibles..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-foreground placeholder:text-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          {/* Visible toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <p className="text-sm font-medium text-foreground">Visible en la web</p>
              <p className="text-xs text-muted mt-0.5">Si lo apagás, el producto no aparece en Paseo 96</p>
            </div>
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                visible ? "bg-accent" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  visible ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex flex-col gap-3 rounded-b-2xl border-t border-gray-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {isEditing ? (
            confirmDelete ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-red-600 font-medium">¿Seguro?</span>
                <button
                  onClick={() => { deleteProducto(producto.id); onClose(); }}
                  className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 text-xs text-muted hover:text-foreground"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={13} /> Eliminar
              </button>
            )
          ) : <span />}

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-muted border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-xl transition-colors shadow-sm"
            >
              {isEditing ? "Guardar cambios" : "Publicar producto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
