import type { NextConfig } from "next";

// Security headers (Fase 9S) — solo headers "sicuri per default", che non
// rischiano di rompere funzionalità esistenti o future (embed YouTube,
// eventuali iframe). Deliberatamente NON include una CSP: una CSP rigida
// richiede un audit approfondito di ogni script/risorsa/embed (incluso
// l'iframe YouTube in components/VideoModal.tsx, oggi dormiente ma pronto
// a essere attivato) e un errore di configurazione romperebbe il sito in
// modo silenzioso — rimandato a quando ci sarà tempo per testarla
// adeguatamente, per non introdurre regressioni in questa fase.
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Impedisce al browser di indovinare il MIME type di una risposta
          // diverso da quello dichiarato — mitiga alcuni attacchi di tipo
          // MIME-sniffing.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Limita quali informazioni sull'URL di provenienza vengono
          // inviate quando si naviga verso un altro sito — buon compromesso
          // privacy/compatibilità per un sito editoriale pubblico.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disabilita esplicitamente le API del browser che il sito non
          // usa (nessuna camera/microfono/geolocalizzazione da nessuna
          // pagina) — riduce la superficie di attacco senza impatto su
          // funzionalità esistenti.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
