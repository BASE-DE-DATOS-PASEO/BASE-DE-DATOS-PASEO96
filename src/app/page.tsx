"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import LocationSection from "@/components/LocationSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
  const productosRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const scrollToProducts = () => {
    productosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCategorySelect = (catId: string | null) => {
    setCategoriaActiva(catId);
    setBusqueda("");
    scrollToProducts();
  };

  const handleSearch = (query: string) => {
    const wasEmpty = busqueda === "";
    setBusqueda(query);
    if (query.length > 0) {
      setCategoriaActiva(null);
      if (wasEmpty) scrollToProducts();
    }
  };

  const focusSearch = () => {
    searchInputRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="public-layout min-h-screen pb-16 md:pb-0">
      <Navbar />
      <Hero
        busqueda={busqueda}
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        activeCategoryId={categoriaActiva}
        searchInputRef={searchInputRef}
      />
      {!busqueda && <CategoryGrid onCategorySelect={handleCategorySelect} />}
      {!busqueda && <div className="border-t border-pub-border" />}
      <div ref={productosRef} className="scroll-mt-20">
        <ProductGrid
          busqueda={busqueda}
          categoriaActiva={categoriaActiva}
          onCategoriaChange={setCategoriaActiva}
        />
      </div>
      <LocationSection />
      <div className="border-t border-pub-border" />
      <FAQ />
      <Footer />
      <ScrollToTop />
      <BottomNav onSearchFocus={focusSearch} />
    </div>
  );
}
