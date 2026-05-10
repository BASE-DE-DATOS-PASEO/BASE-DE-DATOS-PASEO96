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
      <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
          <AlertCircle size={26} className="text-amber-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Todavía no hay un puesto activo</h1>
        <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto">
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
    <div className="space-y-8">
      {/* ── Stats row ─────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}
                >
                  <Icon size={20} className={s.color} />
                </div>
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl font-bold text-gray-900">
                  {s.value}
                </span>
                {s.badge && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${planBadgeColor(puestero.plan)}`}
                  >
                    {puestero.plan === "oro" && <Crown size={12} />}
                    {plan.nombre}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {s.label}
                {s.sub && (
                  <span className="text-gray-400 ml-1">{s.sub}</span>
                )}
              </p>
            </div>
          );
        })}
      </section>

      {/* ── Products section ──────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Mis productos</h2>
          <div className="flex items-center gap-3">
            {!puedeAgregar && (
              <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <AlertCircle size={13} />
                Límite de {plan.maxPublicaciones} productos alcanzado
              </span>
            )}
            <button
              onClick={abrirCrear}
              disabled={!puedeAgregar}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              Agregar producto
            </button>
          </div>
        </div>

        {/* Empty state */}
        {productos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <Package size={24} className="text-blue-500" />
            </div>
            <p className="font-semibold text-gray-900">
              Todavía no cargaste productos
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Hacé click en &quot;Agregar producto&quot; para empezar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {productos.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  {p.imagenes.length > 0 ? (
                    <Image
                      src={p.imagenes[0]}
                      alt={p.nombre}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera size={32} className="text-gray-300" />
                    </div>
                  )}
                  {/* Visibility badge */}
                  <button
                    onClick={() => toggleVisible(p)}
                    className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                      p.visible
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                    title={
                      p.visible
                        ? "Visible en la web. Click para ocultar"
                        : "Oculto. Click para mostrar"
                    }
                  >
                    {p.visible ? (
                      <Eye size={11} />
                    ) : (
                      <EyeOff size={11} />
                    )}
                    {p.visible ? "Visible" : "Oculto"}
                  </button>
                  {/* Foto count */}
                  {p.imagenes.length > 1 && (
                    <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                      {p.imagenes.length} fotos
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {p.nombre}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-lg font-bold text-gray-800">
                      {formatPrecio(p.precioMinorista)}
                    </p>
                    {p.precioAnterior && (
                      <p className="text-sm text-gray-400 line-through">
                        {formatPrecio(p.precioAnterior)}
                      </p>
                    )}
                  </div>
                  {p.precioMayorista && (
                    <p className="text-xs text-blue-600 mt-0.5">
                      Mayor: {formatPrecio(p.precioMayorista)}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => {
                        setDeletingId(null);
                        abrirEditar(p);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Edit size={14} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                        deletingId === p.id
                          ? "border-red-300 bg-red-50 text-red-600 font-semibold"
                          : "border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200"
                      }`}
                    >
                      <Trash2 size={14} />
                      {deletingId === p.id ? "¿Confirmar?" : "Eliminar"}
                    </button>
                    {deletingId === p.id && (
                      <button
                        onClick={() => setDeletingId(null)}
                        className="text-xs text-gray-400 hover:text-gray-600 px-2"
                      >
                        Cancelar
                      </button>
                    )}
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
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={cerrarModal}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg my-auto">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
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
            <div className="p-6 space-y-5">
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
              <div className="grid grid-cols-2 gap-3">
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
                <div className="grid grid-cols-3 gap-3">
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
              <div className="grid grid-cols-2 gap-3">
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
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
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
