import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * SEO foundation (Step 1N) — sitemap statica delle route esistenti in
 * questa fase. Le pagine dinamiche (/ricette/[slug], /guide/[slug],
 * /workshop/[slug]) verranno aggiunte qui via fetch quando l'archivio
 * reale sarà collegato (Fase 2+) — non vengono inventate ora.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/ricette", "/guide", "/cristina", "/cristina-in-rai", "/newsletter", "/privacy", "/cookie"];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
