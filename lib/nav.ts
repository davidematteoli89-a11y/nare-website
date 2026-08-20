// Config centralizzata dei link di navigazione primaria.
//
// Brand architecture (Fase 1B): Narè è il brand ombrello, Cristina di Narè
// la figura centrale. MeLoProduco, Narè Incontri, Narè Ritiri, Narè
// Famiglie, Narè In Viaggio sono i progetti/aree sotto l'ombrello.
//
// Navigazione MVP: solo le aree con contenuto/servizio reale (o quasi)
// compaiono in nav primaria. Ritiri, Famiglie, In Viaggio hanno già la
// route predisposta (brand architecture pronta) ma restano fuori dalla nav
// finché non esistono contenuti/servizi reali — stesso principio già
// applicato a Workshop/Incontri e Learning in Fase 0/1.
export const PRIMARY_NAV = [
  { label: "MeLoProduco", href: "/meloproduco" },
  { label: "Incontri", href: "/incontri" },
  { label: "Cristina", href: "/cristina" },
  { label: "In RAI", href: "/cristina-in-rai" },
] as const;

// Aree predisposte (route esistono) ma non ancora in nav primaria.
// Tenute qui, separate, così è chiaro cosa manca di attivare quando avranno
// contenuto reale — nessuna sono linkate dall'header/footer principali.
export const FUTURE_NAV = [
  { label: "Ritiri", href: "/ritiri" },
  { label: "Famiglie", href: "/famiglie" },
  { label: "In Viaggio", href: "/in-viaggio" },
] as const;

export const FOOTER_LEGAL_NAV = [
  { label: "Privacy", href: "/privacy" },
  { label: "Cookie", href: "/cookie" },
] as const;
