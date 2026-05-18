import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/mi-puesto", "/auth"],
      },
    ],
    sitemap: "https://paseo96.com/sitemap.xml",
  };
}
