"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedStalls from "@/components/FeaturedStalls";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import HowItWorks from "@/components/HowItWorks";
import LocationSection from "@/components/LocationSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
  const productosRef = useRef<HTMLDivElement>(null);

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

  return (
    <div id="main-content" className="v3-bg min-h-screen pb-16 md:pb-0">
      <Navbar
        searchValue={busqueda}
        onSearchChange={handleSearch}
        onSearchSubmit={scrollToProducts}
      />

      {/* 1. Hero — editorial statement, no utility */}
      <Hero onExplore={scrollToProducts} />

      {/* 2. Featured products — horizontal carousel of best */}
      {!busqueda && <FeaturedProducts />}

      {/* 3. Featured stalls — 3 premium puesteros */}
      {!busqueda && <FeaturedStalls />}

      {/* 4. Categories — bento layout */}
      {!busqueda && <CategoryGrid onCategorySelect={handleCategorySelect} />}

      {/* 5. Full catalog — with sticky filters */}
      <div ref={productosRef} className="scroll-mt-16">
        <ProductGrid
          busqueda={busqueda}
          categoriaActiva={categoriaActiva}
          onCategoriaChange={setCategoriaActiva}
        />
      </div>

      {/* 6. How it works — 3 step explanation */}
      <div id="como-funciona">
        <HowItWorks />
      </div>

      {/* 7. Location */}
      <LocationSection />

      {/* 8. FAQ */}
      <FAQ />

      <Footer />
      <ScrollToTop />
      <BottomNav onSearchFocus={scrollToProducts} />
    </div>
  );
}
