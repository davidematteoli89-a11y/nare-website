import type { MetadataRoute } from "next";
import { listPublicRecipes, listPublicWorkshops } from "@/lib/aidady-api";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * SEO foundation (Step 1N, esteso in Fase 3 — Step 3T) — sitemap con le
 * route statiche + gli URL delle Recipe pubblicate reali.
 *
 * Le altre pagine dinamiche (/guide/[slug], /ritiri/[slug]) restano fuori:
 * non esiste ancora un archivio reale collegato per quelle (fuori scope
 * Fase 3). /incontri/[slug] è stata aggiunta in Fase 5 (Step 5T), stesso
 * pattern di safeRecipeSitemapEntries.
 *
 * Fase 1B: aggiornata con la brand architecture Narè. /ritiri, /famiglie,
 * /in-viaggio sono incluse anche se non in nav primaria: sono pagine reali
 * (skeleton) e pubblicamente raggiungibili, quindi appartengono comunque
 * alla sitemap.
 *
 * Resilienza (Step 3T): se aiDady non è raggiungibile durante la build/la
 * generazione della sitemap, NON si deve far fallire l'intera sitemap (né
 * tantomeno il build) — si ricade sulle sole route statiche.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const recipeEntries = await safeRecipeSitemapEntries();
  const workshopEntries = await safeWorkshopSitemapEntries();

  return [...staticEntries, ...recipeEntries, ...workshopEntries];
}

async function safeRecipeSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    // Limite conservativo: la sitemap non deve diventare fragile o troppo
    // pesante. 50 è anche il PUBLIC_LIST_MAX_LIMIT reale lato aiDady (Step
    // 3A) — non chiediamo più di quanto l'API possa dare in una chiamata.
    const { items } = await listPublicRecipes({ limit: 50 });
    return items.map((recipe) => ({
      url: `${siteUrl}/ricette/${recipe.slug}`,
      lastModified: recipe.published_at ? new Date(recipe.published_at) : new Date(),
    }));
  } catch {
    return [];
  }
}

/** Stesso pattern di safeRecipeSitemapEntries, per Narè Incontri (Fase 5, Step 5T). */
async function safeWorkshopSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const { items } = await listPublicWorkshops({ limit: 50 });
    return items.map((workshop) => ({
      url: `${siteUrl}/incontri/${workshop.slug}`,
      lastModified: workshop.published_at ? new Date(workshop.published_at) : new Date(),
    }));
  } catch {
    return [];
  }
}
