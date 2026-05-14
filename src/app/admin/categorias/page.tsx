"use client";

import Header from "@/components/admin/Header";
import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Tag,
  ChevronRight,
  X,
  Package,
} from "lucide-react";
import type { Categoria } from "@/lib/mock-data";
import { useStore } from "@/store/useStore";
import { PhotoUploader } from "@/components/PhotoUploader";
import clsx from "clsx";

export default function CategoriasPage() {
  const { categorias, productos, deleteCategoria } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Categoria | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <>
      <Header title="Categorías" />
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 mb-8 sm:grid-cols-3 sm:gap-4">
          <div className="stat-card p-5 relative z-10">
            <p className="text-xs text-muted font-medium uppercase tracking-wider">Categorías</p>
            <p className="text-2xl sm:text-3xl font-bold mt-2 text-accent blue-glow">{categorias.length}</p>
            <p className="text-xs text-muted mt-2">activas</p>
          </div>
          <div className="stat-card p-5 relative z-10">
            <p className="text-xs text-muted font-medium uppercase tracking-wider">Subcategorías</p>
            <p className="text-2xl sm:text-3xl font-bold mt-2 text-foreground">{categorias.reduce((sum, c) => sum + c.subcategorias.length, 0)}</p>
            <p className="text-xs text-muted mt-2">en total</p>
          </div>
          <div className="stat-card p-5 relative z-10">
            <p className="text-xs text-muted font-medium uppercase tracking-wider">Productos</p>
            <p className="text-2xl sm:text-3xl font-bold mt-2 text-blue-500">{productos.length}</p>
            <p className="text-xs text-muted mt-2">categorizados</p>
          </div>
        </div>

        {/* Top bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Gestión de Categorías
            </h2>
          </div>
          <button
            onClick={() => {
              setEditingCat(null);
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-hover"
          >
            <Plus size={18} /> Nueva categoría
          </button>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categorias.map((cat) => {
            const prodCount = productos.filter(
              (p) => p.categoriaId === cat.id
            ).length;
            const isExpanded = expandedId === cat.id;

            return (
              <div
                key={cat.id}
                className="glass-card rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : cat.id)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                        <Tag size={18} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {cat.nombre}
                        </h3>
                        <p className="text-xs text-muted mt-0.5">
                          {cat.subcategorias.length} subcategorías ·{" "}
                          {prodCount} productos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCat(cat);
                          setShowForm(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-50 text-muted hover:text-foreground transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCategoria(cat.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-50 text-muted hover:text-danger transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      <ChevronRight
                        size={16}
                        className={clsx(
                          "text-muted transition-transform",
                          isExpanded && "rotate-90"
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Subcategorías expandidas */}
                {isExpanded && (
                  <div className="border-t border-border bg-blue-50/50 px-5 py-3">
                    <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
                      Subcategorías
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cat.subcategorias.map((sub) => {
                        const subCount = productos.filter(
                          (p) =>
                            p.categoriaId === cat.id &&
                            p.subcategoria === sub
                        ).length;
                        return (
                          <span
                            key={sub}
                            className="inline-flex items-center gap-1.5 text-xs bg-gray-50 border border-border px-3 py-1.5 rounded-full text-foreground"
                          >
                            {sub}
                            <span className="text-muted flex items-center gap-0.5">
                              <Package size={10} /> {subCount}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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

// ==========================================
// FORMULARIO DE CATEGORÍA (Modal)
// ==========================================
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
  const [subcats, setSubcats] = useState<string[]>(
    categoria?.subcategorias ?? [""]
  );

  const addSubcat = () => setSubcats([...subcats, ""]);
  const removeSubcat = (idx: number) =>
    setSubcats(subcats.filter((_, i) => i !== idx));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative mx-0 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-card shadow-2xl sm:mx-4 sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-border bg-card px-4 py-4 sm:px-6">
          <h3 className="text-lg font-semibold text-foreground">
            {isEditing ? "Editar categoría" : "Nueva categoría"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-50 text-muted hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 p-4 sm:p-6">
          <div>
            <label className="text-xs font-medium text-muted block mb-1.5">
              Nombre de la categoría *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Mujer, Calzado, Abrigo..."
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30"
            />
          </div>

          <PhotoUploader
            label="Foto de portada"
            value={imagen}
            onChange={setImagen}
            folder={`categorias/${nombre.trim() || "sin-nombre"}`}
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-muted">
                Subcategorías
              </label>
              <button
                onClick={addSubcat}
                className="text-xs text-accent hover:text-accent-hover font-medium flex items-center gap-1"
              >
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
                    className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30"
                  />
                  {subcats.length > 1 && (
                    <button
                      onClick={() => removeSubcat(idx)}
                      className="p-2 text-muted hover:text-danger transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 rounded-b-2xl flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground border border-border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
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
            className="px-6 py-2.5 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors shadow-sm"
          >
            {isEditing ? "Guardar cambios" : "Crear categoría"}
          </button>
        </div>
      </div>
    </div>
  );
}
