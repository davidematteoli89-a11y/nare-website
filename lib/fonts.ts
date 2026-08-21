// Typography foundation (Step 1E, riattivata Fase 9V).
//
// Direzione: SERIF editoriale per titoli importanti + SANS pulita per
// body/UI.
//
// STORIA (per riferimento): dalla Fase 1V a tutta la Fase 8, questo file
// usava uno stack di font di sistema (Georgia/-apple-system) invece di
// Fraunces/Inter via next/font/google, perché l'ambiente sandbox di
// sviluppo blocca (403) le richieste a fonts.googleapis.com necessarie al
// self-hosting di next/font/google durante il build. Non era possibile
// verificare qui un build con i font Google.
//
// Fase 9V: next/font/google è stato riattivato. Il build reale avviene su
// Vercel (accesso di rete pieno, nessun blocco), quindi il fetch dei font
// funziona lì senza problemi — next/font/google scarica i file font UNA
// VOLTA in fase di build e li self-hosta come asset statici, non fa alcuna
// richiesta runtime nel browser dell'utente (nessuna richiesta a Google
// Fonts lato client, nessun cookie/tracking Google Fonts — privacy-safe,
// coerente con l'audit cookie di Fase 9M).
//
// NOTA build sandbox: qui in sandbox `npm run build` con questa versione
// fallirebbe per lo stesso blocco di rete storico — è un limite
// dell'ambiente di sviluppo, non del codice. Verificato che il build reale
// va comunque testato su Vercel (deploy automatico da GitHub) prima di
// considerare il cambio confermato.
import { Fraunces, Inter } from "next/font/google";

export const editorialSerif = Fraunces({
  subsets: ["latin"],
  variable: "--font-editorial-serif",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const uiSans = Inter({
  subsets: ["latin"],
  variable: "--font-ui-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
