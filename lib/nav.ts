// Config centralizzata dei link di navigazione primaria.
//
// Brand architecture (Fase 1B): Narè è il brand ombrello, Cristina di Narè
// la figura centrale. MeLoProduco, Narè Incontri, Narè Ritiri, Narè
// Famiglie, Narè In Viaggio sono i progetti/aree sotto l'ombrello.
//
// Navigazione MVP: header snello con le aree più consolidate. Ritiri,
// Famiglie, In Viaggio hanno contenuto editoriale reale da Fase 6 (non più
// solo skeleton), ma restano fuori dall'header per scelta di UX — Step 6S:
// "non aggiungere automaticamente tutte e tre le aree alla nav principale",
// per non affollare l'header con 7 voci. Restano comunque raggiungibili da
// Home ("I mondi Narè") e dal footer (vedi FUTURE_NAV sotto).
export const PRIMARY_NAV = [
  { label: "MeLoProduco", href: "/meloproduco" },
  { label: "Incontri", href: "/incontri" },
  { label: "Cristina", href: "/cristina" },
  { label: "In RAI", href: "/cristina-in-rai" },
] as const;

// Ritiri, Famiglie, In Viaggio (Fase 6: contenuto editoriale reale,
// nessuna più skeleton) — linkate da Home e footer, ma non dall'header
// principale (vedi nota sopra).
export const FUTURE_NAV = [
  { label: "Ritiri", href: "/ritiri" },
  { label: "Famiglie", href: "/famiglie" },
  { label: "In Viaggio", href: "/in-viaggio" },
] as const;

export const FOOTER_LEGAL_NAV = [
  { label: "Privacy", href: "/privacy" },
  { label: "Cookie", href: "/cookie" },
] as const;
