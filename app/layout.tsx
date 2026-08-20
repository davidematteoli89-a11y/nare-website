import type { Metadata } from "next";
import { editorialSerif, uiSans } from "@/lib/fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// SEO foundation (Step 1N): metadataBase, title template, description base.
// Nessun structured data completo in questa fase — solo la foundation.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MeLoProduco",
    template: "%s · MeLoProduco",
  },
  description:
    "MeLoProduco è la guida pratica e prudente di Cristina di Narè all'autoproduzione quotidiana: ricette, guide e workshop su casa, detergenza, cosmesi naturale e cucina.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = {
    [editorialSerif.variable]: editorialSerif.style.fontFamily,
    [uiSans.variable]: uiSans.style.fontFamily,
  } as React.CSSProperties;

  return (
    <html lang="it" className="h-full antialiased" style={fontVars}>
      <body className="flex min-h-full flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
