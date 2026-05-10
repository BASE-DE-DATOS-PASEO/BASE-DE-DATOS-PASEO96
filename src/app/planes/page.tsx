"use client";

import Link from "next/link";
import { Check, X, MessageCircle } from "lucide-react";
import { datosTransferencia } from "@/lib/mock-data";

interface Feature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  features: Feature[];
  buttonLabel: string;
  variant: "bronce" | "plata" | "oro";
}

const plans: Plan[] = [
  {
    name: "Bronce",
    price: "$44.990",
    variant: "bronce",
    buttonLabel: "Elegir Bronce",
    features: [
      { text: "WhatsApp Empresa", included: true },
      { text: "20 fotos totales", included: true },
      { text: "5 fotos por publicacion (4 publicaciones)", included: true },
      { text: "Videos", included: false },
      { text: "Logo de local", included: true },
      { text: "Estadisticas avanzadas", included: true },
      { text: "Publicacion destacada", included: false },
      { text: "Publicidad + Video", included: false },
    ],
  },
  {
    name: "Plata",
    price: "$74.990",
    variant: "plata",
    buttonLabel: "Elegir Plata",
    features: [
      { text: "WhatsApp Empresa", included: true },
      { text: "50 fotos totales", included: true },
      { text: "5 fotos por publicacion (10 publicaciones)", included: true },
      { text: "Videos", included: false },
      { text: "Logo de local", included: true },
      { text: "Estadisticas avanzadas", included: true },
      { text: "Publicacion llamativa y destacada", included: true },
      { text: "Publicidad + Video", included: true },
    ],
  },
  {
    name: "Oro",
    price: "$104.990",
    variant: "oro",
    buttonLabel: "Elegir Oro",
    features: [
      { text: "WhatsApp Empresa", included: true },
      { text: "100 fotos totales", included: true },
      { text: "5 fotos por publicacion (20 publicaciones)", included: true },
      { text: "5 Videos", included: true },
      { text: "Logo de local", included: true },
      { text: "Estadisticas avanzadas", included: true },
      {
        text: "Publicacion llamativa y destacada + IA en imagenes",
        included: true,
      },
      { text: "Publicidad + Video", included: true },
    ],
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  const isPlata = plan.variant === "plata";
  const isOro = plan.variant === "oro";

  const cardClasses = [
    "relative flex flex-col rounded-2xl border p-8 shadow-lg transition-all duration-300",
    isPlata
      ? "scale-[1.04] border-blue-600 bg-white shadow-2xl shadow-blue-100 z-10"
      : "",
    isOro ? "border-amber-400 bg-gradient-to-b from-amber-50/60 to-white" : "",
    !isPlata && !isOro ? "border-gray-200 bg-white" : "",
  ].join(" ");

  const buttonClasses = [
    "mt-auto block w-full rounded-xl py-3.5 text-center font-semibold transition-all duration-200",
    isPlata
      ? "bg-blue-600 text-white hover:bg-blue-700 text-lg shadow-md shadow-blue-200"
      : "",
    isOro
      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 shadow-md shadow-amber-200"
      : "",
    !isPlata && !isOro
      ? "border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
      : "",
  ].join(" ");

  return (
    <div className={cardClasses}>
      {isPlata && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-5 py-1.5 text-sm font-semibold text-white shadow-md">
          Mas popular
        </span>
      )}

      <div className="mb-6">
        <h3
          className={[
            "text-xl font-bold",
            isOro ? "text-amber-700" : "",
            isPlata ? "text-blue-700" : "",
            !isPlata && !isOro ? "text-gray-800" : "",
          ].join(" ")}
        >
          Plan {plan.name}
        </h3>
        <div className="mt-3 flex items-baseline gap-1">
          <span
            className={[
              "text-4xl font-extrabold tracking-tight",
              isOro ? "text-amber-600" : "",
              isPlata ? "text-blue-600" : "",
              !isPlata && !isOro ? "text-gray-900" : "",
            ].join(" ")}
          >
            {plan.price}
          </span>
          <span className="text-base text-gray-500">/mes</span>
        </div>
      </div>

      <ul className="mb-8 flex flex-col gap-3.5">
        {plan.features.map((feature) => (
          <li key={feature.text} className="flex items-start gap-3">
            {feature.included ? (
              <Check
                className={[
                  "mt-0.5 h-5 w-5 shrink-0",
                  isOro ? "text-amber-500" : "text-blue-500",
                ].join(" ")}
                strokeWidth={2.5}
              />
            ) : (
              <X
                className="mt-0.5 h-5 w-5 shrink-0 text-gray-300"
                strokeWidth={2.5}
              />
            )}
            <span
              className={
                feature.included
                  ? "text-gray-700"
                  : "text-gray-400 line-through"
              }
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <Link href={`/suscripcion/${plan.variant}`} className={buttonClasses}>
        {plan.buttonLabel}
      </Link>
    </div>
  );
}

export default function PlanesPage() {
  const whatsappMessage = encodeURIComponent(
    "Hola! Quiero mas informacion sobre los planes de Paseo 96."
  );
  const whatsappUrl = `https://wa.me/${datosTransferencia.whatsappAdmin}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-gray-900">
            PASEO 96
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Iniciar sesion
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Elegi el plan ideal para tu puesto
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
          Publica tus productos, llega a mas clientes y hace crecer tu negocio
          en Paseo 96
        </p>
      </section>

      {/* Plan cards */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Tenes dudas?
          </h2>
          <p className="mt-3 text-gray-500">
            Estamos para ayudarte a elegir el plan perfecto para tu puesto.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2.5 rounded-xl bg-green-600 px-7 py-3.5 text-base font-semibold text-white shadow-md shadow-green-200 transition hover:bg-green-700"
          >
            <MessageCircle className="h-5 w-5" />
            Contactanos por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
