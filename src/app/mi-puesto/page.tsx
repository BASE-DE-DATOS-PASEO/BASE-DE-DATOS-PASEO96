"use client";

import { useState } from "react";
import {
  Package,
  Image as ImageIcon,
  MessageCircle,
  Crown,
  Plus,
  Edit,
  Trash2,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  Camera,
  ChevronDown,
} from "lucide-react";
import {
  useCurrentPuestero,
  useCurrentPuesteroProductos,
  useCurrentPlan,
} from "@/lib/current-puestero";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import type { Producto } from "@/lib/mock-data";
import { PhotosUploader } from "@/components/PhotoUploader";

/* ── helpers ──────────────────────────────────────────────── */

function formatPrecio(precio: number): string {
  return `$ ${precio.toLocaleString("es-AR")}`;
}

function planBadgeColor(plan: "bronce" | "plata" | "oro") {
  if (plan === "oro") return "bg-amber-100 text-amber-700";
  if (plan === "plata") return "bg-slate-100 text-slate-700";
  return "bg-orange-100 text-orange-700";
}

/* ── tipos del formulario ─────────────────────────────────── */

type FormState = {
  nombre: string;
  categoriaId: string;
  subcategoria: string;
  precioMinorista: string;
  precioMayorista: string;
  precioAnterior: string;
  talleDesde: string;
  talleHasta: string;
  descripcion: string;
  imagenes: string[];
  visible: boolean;
};

const formVacio: FormState = {
  nombre: "",
  categoriaId: "",
  subcategoria: "",
  precioMinorista: "",
  precioMayorista: "",
  precioAnterior: "",
  talleDesde: "",
  talleHasta: "",
  descripcion: "",
  imagenes: [""],
  visible: true,
};

type ModalMode = "closed" | "crear" | "editar";

/* ── page ─────────────────────────────────────────────────── */

export default function MiPuestoPage() {
  const puestero = useCurrentPuestero();
  const plan = useCurrentPlan();
  const productos = useCurrentPuesteroProductos();
  const { addProducto, updateProducto, deleteProducto, categorias } =
    useStore();

  /* ── modal state ── */
  const [modalMode, setModalMode] = useState<ModalMode>("closed");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(formVacio);
  const [formError, setFormError] = useState<string>("");

  /* ── delete state (doble confirmación) ── */
  const [deletingId, setDeletingId] = useState<number | null>(null);

  if (!puestero) {
    return (
      <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/40 p-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
          <AlertCircle size={26} className="text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">Todavía no hay un puesto activo</h1>
        <p className="text-sm text-[#525252] mt-2 max-w-xl mx-auto leading-relaxed">
          Esta pantalla queda lista para cuando Jere apruebe una solicitud. En Supabase,
          el Gmail aprobado va a determinar qué puesto ve cada usuario.
        </p>
      </div>
    );
  }

  /* ── límites ── */
  const fotosUsadas = productos.reduce((sum, p) => sum + p.imagenes.length, 0);
  const fotosRestantes = plan.maxFotosTotal - fotosUsadas;
  const puedeAgregar = productos.length < plan.maxPublicaciones;

  /* ── categorías ── */
  const categoriaSeleccionada = categorias.find(
    (c) => c.id === Number(form.categoriaId)
  );
  const subcategorias = categoriaSeleccionada?.subcategorias ?? [];

  /* ── acciones del modal ── */

  function abrirCrear() {
    setForm(formVacio);
    setEditingId(null);
    setFormError("");
    setModalMode("crear");
  }

  function abrirEditar(p: Producto) {
    setForm({
      nombre: p.nombre,
      categoriaId: String(p.categoriaId),
      subcategoria: p.subcategoria,
      precioMinorista: String(p.precioMinorista),
      precioMayorista: p.precioMayorista ? String(p.precioMayorista) : "",
      precioAnterior: p.precioAnterior ? String(p.precioAnterior) : "",
      talleDesde: p.talleDesde,
      talleHasta: p.talleHasta,
      descripcion: p.descripcion,
      imagenes: p.imagenes.length > 0 ? [...p.imagenes] : [""],
      visible: p.visible,
    });
    setEditingId(p.id);
    setFormError("");
    setModalMode("editar");
  }

  function cerrarModal() {
    setModalMode("closed");
    setFormError("");
  }

  function guardar() {
    if (!puestero) return;
    // Validación básica
    if (!form.nombre.trim()) {
      setFormError("El nombre del producto es obligatorio.");
      return;
    }
    if (!form.categoriaId) {
      setFormError("Seleccioná una categoría.");
      return;
    }
    if (!form.precioMinorista || isNaN(Number(form.precioMinorista))) {
      setFormError("Ingresá un precio minorista válido.");
      return;
    }

    const imagenesFiltradas = form.imagenes.filter((url) => url.trim() !== "");

    if (modalMode === "crear") {
      // ── PASO 10: verificar límite de fotos totales ──
      if (fotosUsadas + imagenesFiltradas.length > plan.maxFotosTotal) {
        setFormError(
          `Superás el límite de fotos del plan ${plan.nombre} (${plan.maxFotosTotal} totales). Tenés ${fotosRestantes} disponibles.`
        );
        return;
      }
      addProducto({
        nombre: form.nombre.trim(),
        categoriaId: Number(form.categoriaId),
        subcategoria: form.subcategoria,
        precioMinorista: Number(form.precioMinorista),
        precioMayorista: form.precioMayorista
          ? Number(form.precioMayorista)
          : null,
        precioAnterior: form.precioAnterior
          ? Number(form.precioAnterior)
          : null,
        talleDesde: form.talleDesde,
        talleHasta: form.talleHasta,
        descripcion: form.descripcion,
        imagenes: imagenesFiltradas,
        puesteroId: puestero.id,
        visible: form.visible,
        fechaCarga: new Date().toISOString().split("T")[0],
      });
    } else if (modalMode === "editar" && editingId !== null) {
      // Al editar, calcular fotos de los demás productos (no este)
      const fotosDeOtros = productos
        .filter((p) => p.id !== editingId)
        .reduce((sum, p) => sum + p.imagenes.length, 0);

      if (fotosDeOtros + imagenesFiltradas.length > plan.maxFotosTotal) {
        const disponibles = plan.maxFotosTotal - fotosDeOtros;
        setFormError(
          `Superás el límite de fotos del plan ${plan.nombre}. Podés usar hasta ${disponibles} foto${disponibles !== 1 ? "s" : ""} en este producto.`
        );
        return;
      }
      updateProducto(editingId, {
        nombre: form.nombre.trim(),
        categoriaId: Number(form.categoriaId),
        subcategoria: form.subcategoria,
        precioMinorista: Number(form.precioMinorista),
        precioMayorista: form.precioMayorista
          ? Number(form.precioMayorista)
          : null,
        precioAnterior: form.precioAnterior
          ? Number(form.precioAnterior)
          : null,
        talleDesde: form.talleDesde,
        talleHasta: form.talleHasta,
        descripcion: form.descripcion,
        imagenes: imagenesFiltradas,
        visible: form.visible,
      });
    }

    cerrarModal();
  }

  /* ── delete con doble confirmación ── */
  function handleDelete(id: number) {
    if (deletingId === id) {
      deleteProducto(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
    }
  }

  /* ── toggle visibilidad ── */
  function toggleVisible(p: Producto) {
    updateProducto(p.id, { visible: !p.visible });
  }


  /* ── info de fotos para el modal ── */
  const fotosEditandoDeOtros =
    editingId !== null
      ? productos
          .filter((p) => p.id !== editingId)
          .reduce((sum, p) => sum + p.imagenes.length, 0)
      : fotosUsadas;
  const fotosPorPublicacionDisponibles = Math.min(
    plan.maxFotosPorPublicacion,
    plan.maxFotosTotal - fotosEditandoDeOtros
  );

  /* ── render ───────────────────────────────────────────────── */

  const stats = [
    {
      label: "Productos activos",
      value: `${productos.length}`,
      sub: `de ${plan.maxPublicaciones}`,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Fotos usadas",
      value: `${fotosUsadas} / ${plan.maxFotosTotal}`,
      icon: ImageIcon,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Consultas WhatsApp",
      value: "0",
      sub: "este mes",
      icon: MessageCircle,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Mi Plan",
      value: plan.nombre,
      badge: true,
      icon: Crown,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-12">

      {/* ── Top: Editorial title ── */}
      <section>
        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3B82F6]">
          <span className="w-5 h-px bg-[#3B82F6]" />
          Mi puesto
        </span>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] leading-[1.05] text-[#0A0A0A]">
          {puestero.nombreComercial}
        </h1>
        <p className="text-[#525252] text-sm mt-2">
          Cargá tus productos. Editás precios, fotos y visibilidad cuando quieras.
        </p>
      </section>

      {/* ── Stats row ─────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="v3-stat-card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#737373]">
                  {s.label}
                </p>
                <Icon size={14} className="text-[#A3A3A3]" strokeWidth={1.8} />
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] tabular-nums tracking-tight">
                  {s.value}
                </span>
                {s.badge && puestero.plan === "oro" && <Crown size={16} className="text-amber-500" />}
              </div>
              {s.sub && (
                <p className="text-xs text-[#737373] mt-1">{s.sub}</p>
              )}
            </div>
          );
        })}
      </section>

      {/* ── Products section ──────────────────────────────── */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#525252]">
              <span className="w-5 h-px bg-[#525252]" />
              Catálogo
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#0A0A0A]">
              Tus productos
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {!puedeAgregar && (
              <span className="v3-admin-badge v3-admin-badge-warning">
                <AlertCircle size={11} />
                Límite alcanzado
              </span>
            )}
            <button
              onClick={abrirCrear}
              disabled={!puedeAgregar}
              className="v3-admin-btn-accent"
            >
              <Plus size={15} />
              Agregar producto
            </button>
          </div>
        </div>

        {/* Empty state */}
        {productos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#0A0A0A]/15 bg-white p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FAFAF7] flex items-center justify-center mx-auto mb-3 border border-[#0A0A0A]/06">
              <Package size={24} className="text-[#A3A3A3]" strokeWidth={1.5} />
            </div>
            <p className="font-bold text-[#0A0A0A]">Todavía no cargaste productos</p>
            <p className="text-sm text-[#737373] mt-1">
              Tocá &quot;Agregar producto&quot; para empezar
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {productos.map((p) => (
              <div
                key={p.id}
                className="group"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F2F2EE] transition-all duration-400 group-hover:rounded-3xl">
                  {p.imagenes.length > 0 ? (
                    <Image
                      src={p.imagenes[0]}
                      alt={p.nombre}
                      fill
                      sizes="(max-width: 640px) 50vw, 200px"
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera size={28} className="text-[#A3A3A3]" />
                    </div>
                  )}

                  {/* Visibility toggle */}
                  <button
                    onClick={() => toggleVisible(p)}
                    className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                      p.visible
                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                        : "bg-[#0A0A0A] text-white hover:bg-[#1F1F1F]"
                    }`}
                    title={p.visible ? "Visible · click para ocultar" : "Oculto · click para mostrar"}
                  >
                    {p.visible ? <Eye size={10} /> : <EyeOff size={10} />}
                    {p.visible ? "Visible" : "Oculto"}
                  </button>

                  {/* Foto count */}
                  {p.imagenes.length > 1 && (
                    <span className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm text-[10px] font-bold text-[#0A0A0A] px-2 py-0.5 rounded-full">
                      {p.imagenes.length} fotos
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="mt-3 px-0.5">
                  <h3 className="text-[13px] font-semibold text-[#0A0A0A] leading-snug line-clamp-2 min-h-[2.4rem]">
                    {p.nombre}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-[22px] font-extrabold text-[#0A0A0A] tracking-tight tabular-nums leading-none">
                      {formatPrecio(p.precioMinorista)}
                    </span>
                    {p.precioAnterior && (
                      <span className="text-[11px] text-[#A3A3A3] line-through tabular-nums">
                        {formatPrecio(p.precioAnterior)}
                      </span>
                    )}
                  </div>
                  {p.precioMayorista && (
                    <p className="text-[10.5px] text-[#3B82F6] font-semibold mt-1">
                      Mayor: {formatPrecio(p.precioMayorista)}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => { setDeletingId(null); abrirEditar(p); }}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-[#0A0A0A]/12 text-[11px] font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white hover:border-[#0A0A0A] transition-all"
                    >
                      <Edit size={12} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all ${
                        deletingId === p.id
                          ? "border-rose-300 bg-rose-50 text-rose-700"
                          : "border-[#0A0A0A]/12 text-[#525252] hover:text-rose-600 hover:border-rose-300"
                      }`}
                    >
                      <Trash2 size={12} />
                      {deletingId === p.id && <span>OK?</span>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Usage bars ────────────────────────────────────── */}
      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Uso del plan
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              label: "Publicaciones",
              used: productos.length,
              total: plan.maxPublicaciones,
              color: "bg-blue-500",
              alertColor: "bg-red-500",
            },
            {
              label: "Fotos totales",
              used: fotosUsadas,
              total: plan.maxFotosTotal,
              color: "bg-emerald-500",
              alertColor: "bg-red-500",
            },
            {
              label: "Videos",
              used: 0,
              total: plan.maxVideos,
              color: "bg-purple-500",
              alertColor: "bg-red-500",
            },
          ].map((item) => {
            const pct =
              item.total > 0
                ? Math.min((item.used / item.total) * 100, 100)
                : 0;
            const isAtLimit = item.total > 0 && item.used >= item.total;
            const isNearLimit = pct >= 80 && !isAtLimit;
            return (
              <div key={item.label} className="p-4 rounded-xl bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span
                    className={`text-sm font-bold ${
                      isAtLimit
                        ? "text-red-600"
                        : isNearLimit
                        ? "text-amber-600"
                        : "text-gray-900"
                    }`}
                  >
                    {item.used}/{item.total}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isAtLimit ? item.alertColor : item.color
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {isAtLimit && item.total > 0 && (
                  <p className="text-xs text-red-600 mt-1.5 font-medium">
                    Límite alcanzado
                  </p>
                )}
                {isNearLimit && (
                  <p className="text-xs text-amber-600 mt-1.5">
                    Usás el {Math.round(pct)}% del límite
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ MODAL AGREGAR / EDITAR ════════════════════════ */}
      {modalMode !== "closed" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto sm:items-start sm:px-4 sm:py-6">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={cerrarModal}
          />

          {/* Modal */}
          <div className="relative my-0 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:my-auto sm:rounded-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalMode === "crear"
                  ? "Nuevo producto"
                  : "Editar producto"}
              </h3>
              <button
                onClick={cerrarModal}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-5 p-4 sm:p-6">
              {/* ── Nombre ── */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nombre: e.target.value }))
                  }
                  placeholder="Ej: Jean Mom Azul Clásico"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              {/* ── Categoría + Subcategoría ── */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Categoría *
                  </label>
                  <div className="relative">
                    <select
                      value={form.categoriaId}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          categoriaId: e.target.value,
                          subcategoria: "",
                        }))
                      }
                      className="w-full appearance-none px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white pr-8"
                    >
                      <option value="">Seleccionar...</option>
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Subcategoría
                  </label>
                  <div className="relative">
                    <select
                      value={form.subcategoria}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          subcategoria: e.target.value,
                        }))
                      }
                      disabled={subcategorias.length === 0}
                      className="w-full appearance-none px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-400 pr-8"
                    >
                      <option value="">Seleccionar...</option>
                      {subcategorias.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* ── Precios ── */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Precios
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-[11px] text-gray-400 mb-1">
                      Minorista *
                    </p>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        $
                      </span>
                      <input
                        type="number"
                        value={form.precioMinorista}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            precioMinorista: e.target.value,
                          }))
                        }
                        placeholder="0"
                        className="w-full pl-6 pr-2 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 mb-1">
                      Mayorista
                    </p>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        $
                      </span>
                      <input
                        type="number"
                        value={form.precioMayorista}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            precioMayorista: e.target.value,
                          }))
                        }
                        placeholder="0"
                        className="w-full pl-6 pr-2 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 mb-1">
                      Anterior ↗
                    </p>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        $
                      </span>
                      <input
                        type="number"
                        value={form.precioAnterior}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            precioAnterior: e.target.value,
                          }))
                        }
                        placeholder="0"
                        className="w-full pl-6 pr-2 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Mayorista y Anterior son opcionales. El precio anterior aparece tachado como oferta.
                </p>
              </div>

              {/* ── Talles ── */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Talle desde
                  </label>
                  <input
                    type="text"
                    value={form.talleDesde}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, talleDesde: e.target.value }))
                    }
                    placeholder="Ej: S, 36, 1"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Talle hasta
                  </label>
                  <input
                    type="text"
                    value={form.talleHasta}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, talleHasta: e.target.value }))
                    }
                    placeholder="Ej: XL, 46, 14"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* ── Descripción ── */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Descripción
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, descripcion: e.target.value }))
                  }
                  placeholder="Material, características, colores disponibles..."
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* ── Imágenes ── */}
              <PhotosUploader
                label="Fotos del producto"
                values={form.imagenes}
                onChange={(imgs) => setForm((f) => ({ ...f, imagenes: imgs }))}
                folder={
                  puestero
                    ? `productos/${puestero.fila}-${puestero.numeroPuesto}-${puestero.gmailAcceso}`
                    : "productos/sin-puesto"
                }
                max={Math.max(1, fotosPorPublicacionDisponibles)}
              />

              {/* ── Visible toggle ── */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Visible en la web
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Si lo apagás, el producto no aparece en Paseo 96
                  </p>
                </div>
                <button
                  onClick={() =>
                    setForm((f) => ({ ...f, visible: !f.visible }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    form.visible ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      form.visible ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Error */}
              {formError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                  <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex flex-col gap-2 border-t border-gray-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6">
              <button
                onClick={cerrarModal}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                className="px-6 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {modalMode === "crear" ? "Publicar producto" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
