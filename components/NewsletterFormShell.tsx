"use client";

import { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";

type Status = "idle" | "loading" | "success" | "error";

/**
 * SOLO UI del form newsletter (Step 1Q). Nessuna integrazione Brevo, nessun
 * salvataggio email da nessuna parte: il submit è intenzionalmente finto,
 * serve solo a mostrare i 4 stati visuali (idle/loading/success/error) che
 * il form avrà quando in futuro verrà collegato a un backend reale.
 */
export function NewsletterFormShell({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Nessun backend collegato in questa fase: submit disattivato di proposito.
    // Simula solo il passaggio di stato per verificare la UI.
    setStatus("loading");
    setTimeout(() => setStatus("success"), 600);
  }

  if (status === "success") {
    return (
      <p role="status" className="rounded-[var(--radius-md)] bg-[var(--color-success-bg)] px-4 py-3 text-sm text-[var(--color-success)]">
        Grazie! (Demo — nessuna iscrizione reale è stata salvata: newsletter non ancora collegata.)
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "flex flex-col gap-3 sm:flex-row" : "flex flex-col gap-3"} noValidate>
      <div className="flex-1">
        <Input label="Email" hideLabel={compact} type="email" name="email" placeholder="La tua email" required disabled={status === "loading"} />
      </div>
      {!compact && <Input label="Nome (opzionale)" name="name" placeholder="Nome (opzionale)" disabled={status === "loading"} />}
      <Button type="submit" disabled={status === "loading"} className={compact ? "shrink-0" : undefined}>
        {status === "loading" ? "Invio…" : "Iscriviti"}
      </Button>
      {status === "error" && (
        <p role="alert" className="text-sm text-[var(--color-danger)]">
          Qualcosa non ha funzionato. Riprova più tardi.
        </p>
      )}
    </form>
  );
}
