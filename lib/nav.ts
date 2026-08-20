// Config centralizzata dei link di navigazione primaria.
// Workshop NON è incluso qui di proposito (Step 1G): va aggiunto quando
// esisteranno Workshop pubblici reali pubblicati via aiDady Publishing.
export const PRIMARY_NAV = [
  { label: "Ricette", href: "/ricette" },
  { label: "Guide", href: "/guide" },
  { label: "Cristina", href: "/cristina" },
  { label: "Cristina in RAI", href: "/cristina-in-rai" },
] as const;

export const FOOTER_LEGAL_NAV = [
  { label: "Privacy", href: "/privacy" },
  { label: "Cookie", href: "/cookie" },
] as const;
