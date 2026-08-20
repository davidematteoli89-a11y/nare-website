// Typography foundation (Step 1E).
//
// Direzione: SERIF editoriale per titoli importanti + SANS pulita per
// body/UI. La scelta finale del font (Fase 2 - Design System) sarà
// validata insieme alla palette definitiva.
//
// NOTA IMPORTANTE (Fase 1V — build): la scelta iniziale era next/font/google
// (Fraunces + Inter), che self-hosta i font durante il build fetchandoli da
// fonts.googleapis.com. In ambiente di sviluppo sandbox questa rete è
// bloccata dal proxy (403), quindi il build non è verificabile qui. Per non
// lasciare la Fase 1 senza un build verificato, si usa temporaneamente uno
// stack di font di sistema (nessuna richiesta di rete, quindi build sempre
// verificabile ovunque). La versione con Fraunces/Inter resta commentata
// sotto: è la coppia raccomandata da riattivare in Fase 2, quando il build
// avverrà in un ambiente (locale reale o Vercel) con accesso di rete
// completo — a quel punto next/font/google funzionerà senza modifiche.

export const editorialSerif = {
  variable: "--font-editorial-serif",
  // Stack di sistema con buon carattere editoriale: Georgia è la serif di
  // sistema più affidabile cross-platform per un tono "magazine".
  style: { fontFamily: 'Georgia, "Times New Roman", Times, serif' },
};

export const uiSans = {
  variable: "--font-ui-sans",
  style: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
};

/*
// Versione con font Google self-hosted via next/font — da riattivare in
// Fase 2 in un ambiente con accesso di rete a fonts.googleapis.com:
//
// import { Fraunces, Inter } from "next/font/google";
//
// export const editorialSerif = Fraunces({
//   subsets: ["latin"],
//   variable: "--font-editorial-serif",
//   display: "swap",
//   weight: ["400", "500", "600"],
//   style: ["normal", "italic"],
// });
//
// export const uiSans = Inter({
//   subsets: ["latin"],
//   variable: "--font-ui-sans",
//   display: "swap",
//   weight: ["400", "500", "600", "700"],
// });
*/
