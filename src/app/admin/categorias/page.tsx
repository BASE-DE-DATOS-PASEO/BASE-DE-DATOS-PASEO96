"use client";

import Header from "@/components/admin/Header";
import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Tag,
  ChevronDown,
  X,
  Package,
  Store,
} from "lucide-react";
import type { Categoria } from "@/lib/mock-data";
import { useStore } from "@/store/useStore";
import { PhotoUploader } from "@/components/PhotoUploader";

export default function CategoriasPage() {
  const { categorias, productos, deleteCategoria } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Categoria | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const categoriaAEliminar = confirmDeleteId
    ? categorias.find((c) => c.id === confirmDeleteId) ?? null
    : null;
  const productosEnCategoria = categoriaAEliminar
    ? productos.filter((p) => p.categoriaId === categoriaAEliminar.id).length
    : 0;

  return (
    <>
      <Header
        title="Categorías"
        subtitle="Cómo se organiza la feria. Cada categoría tiene su foto y subcategorías."
        action={
          <button
            onClick={() => { setEditingCat(null); setShowForm(true); }}
            className="v3-admin-btn-accent"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Nueva categoría</span>
          </button>
        }
      />

      <div className="px-6 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6">

        {/* KPIs simples */}
        <div className="grid grid-cols-3 gap-3">
          <KpiSimple label="Categorías" value={categorias.length} hint="rubros principales" icon={Tag} />
          <KpiSimple label="Subcategorías" value={categorias.reduce((sum, c) => sum + c.subcategorias.length, 0)} hint="en total" icon={ChevronDown} />
          <KpiSimple label="Productos" value={productos.length} hint="categorizados" icon={Package} valueColor="text-emerald-600" />
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[15px] font-semibold text-[#0F172A]">
            Todas las categorías
          </h2>
          <span className="text-[12px] text-[#64748B] tabular-nums shrink-0">
            {categorias.length} {categorias.length === 1 ? "rubro" : "rubros"}
          </span>
        </div>

        {/* Category cards — bento-style with photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {categorias.map((cat) => {
            const prodCount = productos.filter((p) => p.categoriaId === cat.id).length;
            const isExpanded = expandedId === cat.id;

            return (
              <div
                key={cat.id}
                className="bg-white border border-[#0A0A0A]/06 rounded-2xl overflow-hidden hover:border-[#0A0A0A]/20 hover:shadow-[0_12px_36px_-12px_rgba(10,10,10,0.12)] hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative aspect-[16/9] bg-[#F2F2EE] overflow-hidden">
                  {cat.imagen ? (
                    <Image src={cat.imagen} alt={cat.nombre} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag size={28} className="text-[#A3A3A3]" strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <h3 className="text-white font-bold text-xl tracking-tight drop-shadow-md">
                      {cat.nombre}
                    </h3>
                  </div>
                </div>

                {/* Meta + actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 text-xs text-[#737373]">
                      <span className="flex items-center gap-1">
                        <Tag size={11} /> {cat.subcategorias.length}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#A3A3A3]" />
                      <span className="flex items-center gap-1">
                        <Package size={11} /> {prodCount} productos
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditingCat(cat); setShowForm(true); }}
                        className="p-2 rounded-lg hover:bg-[#0A0A0A]/04 text-[#525252] hover:text-[#0A0A0A] transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(cat.id)}
                        className="p-2 rounded-lg hover:bg-rose-50 text-[#525252] hover:text-rose-600 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : cat.id)}
                        className="p-2 rounded-lg hover:bg-[#0A0A0A]/04 text-[#525252] hover:text-[#0A0A0A] transition-colors"
                        title={isExpanded ? "Cerrar" : "Ver subcategorías"}
                        aria-expanded={isExpanded}
                      >
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Subcategorías expandidas */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#0A0A0A]/06">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373] mb-3">
                        Subcategorías
                      </p>
                      {cat.subcategorias.length === 0 ? (
                        <p className="text-xs text-[#A3A3A3] italic">Sin subcategorías</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {cat.subcategorias.map((sub) => {
                            const subCount = productos.filter(
                              (p) => p.categoriaId === cat.id && p.subcategoria === sub
                            ).length;
                            return (
                              <span
                                key={sub}
                                className="inline-flex items-center gap-1.5 text-[11px] bg-[#FAFAF7] border border-[#0A0A0A]/06 px-2.5 py-1 rounded-full text-[#0A0A0A] font-medium"
                              >
                                {sub}
                                <span className="text-[#737373] tabular-nums">· {subCount}</span>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {categorias.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#0A0A0A]/15 bg-white py-16 text-center">
            <Tag size={28} className="text-[#A3A3A3] mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-bold text-[#0A0A0A]">Sin categorías todavía</p>
            <p className="text-sm text-[#737373] mt-1">Creá la primera para organizar el catálogo</p>
          </div>
        )}
      </div>

      {/* Modal formulario */}
      {showForm && (
        <CategoriaForm
          categoria={editingCat}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Confirmación de borrado */}
      {categoriaAEliminar && (
        <ConfirmDeleteModal
          title="¿Borrar esta categoría?"
          message={
            productosEnCategoria > 0
              ? `“${categoriaAEliminar.nombre}” tiene ${productosEnCategoria} ${
                  productosEnCategoria === 1 ? "producto asociado" : "productos asociados"
                }. ¿Seguro que querés borrarla? No se puede deshacer.`
              : `¿Seguro que querés borrar “${categoriaAEliminar.nombre}”? No se puede deshacer.`
          }
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={() => {
            deleteCategoria(categoriaAEliminar.id);
            setConfirmDeleteId(null);
          }}
        />
      )}
    </>
  );
}

/* ── Modal de confirmación para borrar ── */
function ConfirmDeleteModal({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-cat-title"
        className="relative mx-0 w-full max-w-sm rounded-t-3xl bg-white shadow-2xl sm:mx-4 sm:rounded-2xl border border-[#0A0A0A]/08"
      >
        <div className="px-6 pt-6 pb-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-3">
            <Trash2 size={18} className="text-rose-600" />
          </div>
          <h3 id="confirm-delete-cat-title" className="text-lg font-bold text-[#0A0A0A] tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-[#525252] mt-1.5 leading-relaxed">{message}</p>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-[#0A0A0A]/06 px-6 py-4 sm:flex-row sm:justify-end sm:gap-3">
          <button onClick={onCancel} className="v3-admin-btn-ghost">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors"
          >
            Sí, borrar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── KPI helper ── */
function KpiSimple({
  label,
  value,
  hint,
  icon: Icon,
  valueColor = "text-[#0F172A]",
}: {
  label: string;
  value: number;
  hint: string;
  icon: React.ElementType;
  valueColor?: string;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:border-[#CBD5E1] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11.5px] font-medium text-[#64748B]">{label}</p>
        <Icon size={13} className="text-[#94A3B8]" strokeWidth={1.8} />
      </div>
      <p className={`text-[22px] font-semibold tabular-nums tracking-tight ${valueColor}`}>
        {value}
      </p>
      <p className="text-[11.5px] text-[#94A3B8] mt-1">{hint}</p>
    </div>
  );
}

function CategoriaForm({
  categoria,
  onClose,
}: {
  categoria: Categoria | null;
  onClose: () => void;
}) {
  const { addCategoria, updateCategoria } = useStore();
  const isEditing = !!categoria;
  const [nombre, setNombre] = useState(categoria?.nombre ?? "");
  const [imagen, setImagen] = useState(categoria?.imagen ?? "");
  const [subcats, setSubcats] = useState<string[]>(categoria?.subcategorias ?? [""]);

  const addSubcat = () => setSubcats([...subcats, ""]);
  const removeSubcat = (idx: number) => setSubcats(subcats.filter((_, i) => i !== idx));

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-0 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:mx-4 sm:rounded-3xl border border-[#0A0A0A]/08">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#0A0A0A]/06 bg-white/95 backdrop-blur-md px-6 py-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#3B82F6]">
              {isEditing ? "Editar" : "Crear"}
            </span>
            <h3 className="text-xl font-bold text-[#0A0A0A] tracking-tight mt-0.5">
              {isEditing ? categoria.nombre : "Nueva categoría"}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#0A0A0A]/04 text-[#525252]" aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 p-6">

          <label className="block">
            <span className="text-xs font-semibold text-[#525252] block mb-1.5">
              Nombre de la categoría <span className="text-[#3B82F6]">*</span>
            </span>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Mujer, Calzado…"
              className="v3-admin-input"
            />
          </label>

          <div>
            <span className="text-xs font-semibold text-[#525252] block mb-2">
              Foto de portada
            </span>
            <PhotoUploader
              label=""
              value={imagen}
              onChange={setImagen}
              folder={`categorias/${nombre.trim() || "sin-nombre"}`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#525252]">
                Subcategorías
              </span>
              <button onClick={addSubcat} className="text-xs text-[#3B82F6] hover:text-[#2F6EE0] font-semibold flex items-center gap-1">
                <Plus size={12} /> Agregar
              </button>
            </div>
            <div className="space-y-2">
              {subcats.map((sub, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={sub}
                    onChange={(e) => {
                      const updated = [...subcats];
                      updated[idx] = e.target.value;
                      setSubcats(updated);
                    }}
                    placeholder="Nombre de subcategoría"
                    className="v3-admin-input flex-1"
                  />
                  {subcats.length > 1 && (
                    <button
                      onClick={() => removeSubcat(idx)}
                      className="p-2 text-[#525252] hover:text-rose-600 transition-colors"
                      aria-label="Quitar"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#0A0A0A]/06 px-6 py-4 flex items-center justify-end gap-2 sm:gap-3">
          <button onClick={onClose} className="v3-admin-btn-ghost">Cancelar</button>
          <button
            onClick={() => {
              const cleanSubs = subcats.filter((s) => s.trim());
              if (isEditing) {
                updateCategoria(categoria.id, { nombre, imagen, subcategorias: cleanSubs });
              } else {
                addCategoria({ nombre, imagen, subcategorias: cleanSubs });
              }
              onClose();
            }}
            className="v3-admin-btn"
          >
            {isEditing ? "Guardar cambios" : "Crear categoría"}
          </button>
        </div>
      </div>
    </div>
  );
}
