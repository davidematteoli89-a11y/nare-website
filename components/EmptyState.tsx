/** Stato vuoto editoriale — usato finché un archivio (Ricette, Guide, Workshop) non ha ancora contenuti pubblicati. */
export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)] px-6 py-12 text-center">
      <p className="text-h3 text-[var(--color-foreground)]">{title}</p>
      {description && <p className="text-small mt-2 text-[var(--color-foreground-muted)]">{description}</p>}
    </div>
  );
}
