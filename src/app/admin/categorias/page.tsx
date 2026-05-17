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
} from "lucide-react";
import type { Categoria } from "@/lib/mock-data";
import { useStore } from "@/store/useStore";
import { PhotoUploader } from "@/components/PhotoUploader";

export default function CategoriasPage() {
  const { categorias, productos, deleteCategoria } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Categoria | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <>
      <Header
        eyebrow="Taxonomía"
        title="Categorías"
        subtitle="Cómo se organiza el catálogo. Cada categoría tiene su foto y subcategorías."
        action={
          <button
            onClick={() => { setEditingCat(null); setShowForm(true); }}
            className="v3-admin-btn-accent"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Nueva categoría</span>
          </button>
        }
      />

      <div className="px-5 sm:px-8 lg:px-12 py-8 sm:py-10">

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
          <div className="v3-stat-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">Categorías</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] mt-2 tabular-nums tracking-tight">
              {categorias.length}
            </p>
          </div>
          <div className="v3-stat-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">Subcategorías</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] mt-2 tabular-nums tracking-tight">
              {categorias.reduce((sum, c) => sum + c.subcategorias.length, 0)}
            </p>
          </div>
          <div className="v3-stat-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">Productos</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#3B82F6] mt-2 tabular-nums tracking-tight">
              {productos.length}
            </p>
          </div>
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
                        onClick={() => {
                          if (window.confirm(`¿Eliminar "${cat.nombre}"? No se puede deshacer.`)) {
                            deleteCategoria(cat.id);
                          }
                        }}
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
    </>
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
