import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { EmptyState } from "@/components/EmptyState";
import { EditorialCard } from "@/components/EditorialCard";
import { listAllPublicGuides, listPublicGuides, resolvePublicImageUrl } from "@/lib/aidady-api";

const siteUrl=process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000";
export const metadata:Metadata={title:"Guide & Approfondimenti",description:"Guide pratiche MeLoProduco per casa, cucina, autoproduzione e vita quotidiana.",alternates:{canonical:`${siteUrl}/guide`}};

export default async function GuidePage({searchParams}:{searchParams:Promise<{area?:string;topic?:string;tag?:string}>}){
 const filters=await searchParams; let guides=null;let all=null;try{[guides,all]=await Promise.all([listPublicGuides({...filters,limit:50}),listAllPublicGuides()]);}catch{}
 const areas=new Map<string,string>(),topics=new Map<string,string>();const tags=new Set<string>();for(const guide of all??[]){if(guide.area)areas.set(guide.area.slug,guide.area.name);if(guide.topic)topics.set(guide.topic.slug,guide.topic.name);guide.tags.forEach(t=>tags.add(t));}
 return <Container className="py-16 sm:py-20" as="main"><Eyebrow>MeLoProduco</Eyebrow><h1 className="text-hero-display mt-3">Guide & Approfondimenti</h1><p className="text-lead mt-5 max-w-2xl text-[var(--color-foreground-muted)]">Approfondimenti pratici per capire, scegliere e autoprodurre con consapevolezza.</p>
 <form className="mt-10 grid gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 sm:grid-cols-4" method="get"><select name="area" defaultValue={filters.area??""} className="rounded border p-2"><option value="">Tutte le Aree</option>{[...areas].map(([slug,name])=><option key={slug} value={slug}>{name}</option>)}</select><select name="topic" defaultValue={filters.topic??""} className="rounded border p-2"><option value="">Tutti gli Argomenti</option>{[...topics].map(([slug,name])=><option key={slug} value={slug}>{name}</option>)}</select><select name="tag" defaultValue={filters.tag??""} className="rounded border p-2"><option value="">Tutti i tag</option>{[...tags].sort().map(tag=><option key={tag}>{tag}</option>)}</select><button className="rounded bg-[var(--color-accent)] px-4 py-2 text-white">Filtra</button></form>
 <div className="mt-10">{guides===null?<EmptyState title="Le Guide non sono disponibili in questo momento." description="Riprova tra qualche minuto."/>:guides.items.length===0?<EmptyState title="Nessuna Guida pubblicata per questi filtri." description="Cambia Area o Argomento, oppure torna presto."/>:<ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{guides.items.map(guide=><li key={guide.slug}><EditorialCard href={`/guide/${guide.slug}`} title={guide.title} excerpt={guide.excerpt??undefined} category={guide.topic?.name??guide.area?.name} imageSrc={guide.cover_image?.url ?? resolvePublicImageUrl(guide.og_image_path) ?? "/images/placeholders/editorial-generic.png"} imageAlt={guide.cover_image?.alt_text || guide.title}/></li>)}</ul>}</div></Container>;
}
