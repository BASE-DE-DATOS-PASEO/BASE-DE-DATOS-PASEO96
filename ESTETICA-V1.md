# Estética v1 — Baseline (Minimal Marketplace)

**Fecha de bloqueo:** 2026-05-16
**Commit:** `fe9ae9f` (PR #9 merged)
**Tag:** `estetica-v1`
**Branch protegida:** `estetica-v1-baseline`

## Cómo volver a v1

```bash
# Ver el código exacto de v1
git checkout estetica-v1

# Restaurar v1 como main (NUCLEAR — solo si v2/v3/etc fallan)
git checkout main
git reset --hard estetica-v1
git push --force-with-lease origin main
```

## Características de v1

### Identidad visual
- **Estilo:** Marketplace limpio, conventional, trustworthy (estilo MercadoLibre/Tiendanube)
- **Tipografía:** Arial/Helvetica (sans-serif del sistema)
- **Color primario:** Azul `#3B82F6`
- **Fondo:** Off-white `#FAFAFA`
- **Cards:** Fondo blanco sólido, bordes finos grises, sombras sutiles

### Layout
- Hero con título grande + tagline + searchbar centrada
- CategoryGrid: Slider horizontal de 1 fila con flechitas (PR #9)
- ProductGrid: Grilla 2/3/4/5/6 columnas + paginación "Ver más" (60 por página)
- Navbar: Fija arriba con efecto glass simple
- Footer: Información de contacto en bloques

### Componentes clave
- `src/components/Navbar.tsx`
- `src/components/Hero.tsx`
- `src/components/CategoryGrid.tsx`
- `src/components/ProductCard.tsx`
- `src/components/ProductGrid.tsx`
- `src/components/Footer.tsx`
- `src/app/globals.css` (sin sección v2)

## Notas

Esta es la base. Toda variación estética (v2, v3, etc.) parte de aquí y se construye en ramas separadas. **Nunca borrar el tag `estetica-v1` ni la branch `estetica-v1-baseline`.**
