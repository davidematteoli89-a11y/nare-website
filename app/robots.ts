import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** SEO foundation (Step 1N) — robots.txt generato, nessuna regola custom oltre il default aperto. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cerca"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
