import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * SEO foundation (Step 1N) — sitemap statica delle route esistenti in
 * questa fase. Le pagine dinamiche (/ricette/[slug], /guide/[slug],
 * /incontri/[slug], /ritiri/[slug]) verranno aggiunte qui via fetch quando
 * l'archivio reale sarà collegato (Fase 2+) — non vengono inventate ora.
 *
 * Fase 1B: aggiornata con la brand architecture Narè. /ritiri, /famiglie,
 * /in-viaggio sono incluse anche se non in nav primaria: sono pagine reali
 * (skeleton) e pubblicamente raggiungibili, quindi appartengono comunque
 * alla sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/meloproduco",
    "/ricette",
    "/guide",
    "/incontri",
    "/ritiri",
    "/famiglie",
    "/in-viaggio",
    "/cristina",
    "/cristina-in-rai",
    "/newsletter",
    "/privacy",
    "/cookie",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
