import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Eyebrow } from "@/components/Eyebrow";
import { EmptyState } from "@/components/EmptyState";
import { GuideMarkdown } from "@/components/GuideMarkdown";
import { GuideTutorial } from "@/components/GuideTutorial";
import { MediaGallerySlider } from "@/components/MediaGallerySlider";
import {
  ApiUnavailableError,
  getPublicGuide,
  MalformedResponseError,
  resolvePublicImageUrl,
  type PublicGuideMedia,
  type PublicGuidePayload,
} from "@/lib/aidady-api";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
type Result = { status: "ok"; guide: PublicGuidePayload } | { status: "not-found" } | { status: "unavailable" };

async function load(slug: string): Promise<Result> {
  try {
    const guide = await getPublicGuide(slug);
    return guide ? { status: "ok", guide } : { status: "not-found" };
  } catch (error) {
    if (error instanceof ApiUnavailableError || error instanceof MalformedResponseError) return { status: "unavailable" };
    return { status: "unavailable" };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await load(slug);
  if (result.status !== "ok") return {};
  const guide = result.guide;
  const image = guide.cover_image?.url ?? resolvePublicImageUrl(guide.og_image_path);
  return {
    title: guide.seo_title || guide.title,
    description: guide.seo_description || guide.excerpt || undefined,
    alternates: { canonical: guide.canonical_url || `${siteUrl}/guide/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.seo_title || guide.title,
      description: guide.seo_description || guide.excerpt || undefined,
      publishedTime: guide.published_at ?? undefined,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function GuideDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await load(slug);
  if (result.status === "not-found") notFound();
  if (result.status === "unavailable") {
    return <Container className="py-16"><EmptyState title="Questa Guida non è disponibile in questo momento." description="Riprova tra qualche minuto." /></Container>;
  }

  const guide = result.guide;
  const canonical = guide.canonical_url || `${siteUrl}/guide/${guide.slug}`;
  const structuredData = buildStructuredData(guide, canonical);
  const legacyCover = resolvePublicImageUrl(guide.og_image_path);

  return (
    <Container className="py-12 sm:py-16" as="main">
      <Breadcrumbs items={[{ label: "Narè", href: "/" }, { label: "Guide", href: "/guide" }, { label: guide.title }]} />
      <article className="mx-auto mt-8 max-w-3xl">
        <Eyebrow>{guide.topic?.name ?? guide.area?.name ?? "MeLoProduco"}</Eyebrow>
        <h1 className="text-h1 mt-3">{guide.title}</h1>
        {guide.excerpt && <p className="text-lead mt-4 text-[var(--color-foreground-muted)]">{guide.excerpt}</p>}

        {(guide.cover_image || legacyCover) && (
          <figure className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
            {/* URL pubblico validato e prodotto dal DTO Media; il tag nativo evita una whitelist host rigida per storage/provider futuri. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={guide.cover_image?.url ?? legacyCover!} alt={guide.cover_image?.alt_text || guide.title} className="aspect-[16/9] w-full object-cover" />
            {guide.cover_image?.caption && <figcaption className="p-3 text-small text-[var(--color-foreground-muted)]">{guide.cover_image.caption}</figcaption>}
          </figure>
        )}

        <GuideMarkdown source={guide.body} />
        {guide.media && <GuideTutorial media={guide.media} guideTitle={guide.title} />}

        <MediaGallerySlider images={guide.gallery} />

        {guide.tags.length > 0 && <div className="mt-8 flex flex-wrap gap-2">{guide.tags.map((tag) => <span key={tag} className="text-small rounded border px-2 py-1">{tag}</span>)}</div>}
      </article>

      {(guide.related_recipes.length > 0 || guide.related_guides.length > 0) && (
        <div className="mx-auto mt-14 grid max-w-3xl gap-8 sm:grid-cols-2">
          {guide.related_recipes.length > 0 && <Related title="Ricette collegate" items={guide.related_recipes} prefix="/ricette" />}
          {guide.related_guides.length > 0 && <Related title="Guide correlate" items={guide.related_guides} prefix="/guide" />}
        </div>
      )}
      {structuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />}
    </Container>
  );
}

function Related({ title, items, prefix }: { title: string; items: { slug: string; title: string }[]; prefix: string }) {
  return <section><h2 className="text-h3">{title}</h2><ul className="mt-3 space-y-2">{items.map((item) => <li key={item.slug}><Link href={`${prefix}/${item.slug}`} className="underline">{item.title}</Link></li>)}</ul></section>;
}

function buildStructuredData(guide: PublicGuidePayload, canonical: string): string | null {
  if (!guide.published_at) return null;
  const article = { "@type": "Article", headline: guide.title, url: canonical, datePublished: guide.published_at, ...(guide.excerpt ? { description: guide.excerpt } : {}) };
  const video = videoObject(guide.media, guide.published_at);
  const value = video ? { "@context": "https://schema.org", "@graph": [article, video] } : { "@context": "https://schema.org", ...article };
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function videoObject(media: PublicGuideMedia | null, publishedAt: string) {
  if (!media || !media.title || !media.thumbnail_url || !["youtube", "video_upload"].includes(media.type)) return null;
  let contentUrl: URL;
  let thumbnailUrl: URL;
  try { contentUrl = new URL(media.url); thumbnailUrl = new URL(media.thumbnail_url); } catch { return null; }
  if (contentUrl.protocol !== "https:" || thumbnailUrl.protocol !== "https:") return null;
  const id = media.type === "youtube" ? contentUrl.searchParams.get("v") : null;
  return {
    "@type": "VideoObject", name: media.title, thumbnailUrl: [thumbnailUrl.toString()], uploadDate: publishedAt,
    contentUrl: contentUrl.toString(),
    ...(id && /^[A-Za-z0-9_-]{11}$/.test(id) ? { embedUrl: `https://www.youtube-nocookie.com/embed/${id}` } : {}),
    ...(media.caption ? { description: media.caption } : {}),
  };
}
