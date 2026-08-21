/**
 * Modello dati editoriale per gli interventi RAI di Cristina di Narè.
 *
 * Fase 4 (Step 4A/4D): al momento della stesura di questo file NON esiste
 * nel repository nessun dato reale su interventi RAI (nessuna data,
 * programma, titolo, link ufficiale o video verificato) — confermato via
 * audit del repository (cartelle public/images/rai/, public/images/cristina/
 * vuote, nessun file editoriale con questi dati). Per rispettare il vincolo
 * esplicito "NON creare interventi finti / NON inventare informazioni
 * mancanti", questo file predispone solo la struttura tipizzata e la
 * esporta popolata con un array vuoto.
 *
 * Quando saranno disponibili dati reali (forniti dal cliente, verificati
 * per titolo/programma/data/diritti d'uso — vedi Fase 0 punto 8), andranno
 * aggiunti come oggetti RaiAppearance in `raiAppearances` qui sotto. Nessun
 * database in questa fase: file dati locale, letto sia da /cristina-in-rai
 * sia dalla sezione "Cristina in RAI" della Home, per evitare duplicazione
 * e disallineamento tra le due viste.
 */

/**
 * Tipo di sorgente video per un intervento. "none" indica un intervento
 * documentato solo testualmente (titolo/programma/data), senza alcun video
 * embeddabile disponibile o con diritti d'uso non ancora verificati.
 */
export type RaiVideoType = "cloudflare" | "youtube" | "raiplay" | "external" | "none";

export interface RaiAppearance {
  /** Identificativo stabile, usato come slug/key (es. per anchor o key React). */
  id: string;
  /** Titolo dell'intervento o del segmento. */
  title: string;
  /** Nome del programma RAI (es. "Uno Mattina"). */
  programme: string;
  /** Data dell'intervento, formato ISO (YYYY-MM-DD), se nota. */
  date?: string;
  /** Argomento/tema trattato, se pertinente da evidenziare. */
  topic?: string;
  /** Breve descrizione editoriale dell'intervento (1-3 frasi), solo se reale. */
  description?: string;
  /** Percorso dell'immagine poster/thumbnail, se disponibile (mai loghi RAI). */
  poster?: string;
  /** Origine del video, se presente. */
  videoType: RaiVideoType;
  /** URL del video (solo se i diritti d'uso sono stati verificati). */
  videoUrl?: string;
  /** Link alla pagina ufficiale RAI/RaiPlay del programma o della puntata, se noto. */
  officialUrl?: string;
  /** Contenuti Narè collegati editorialmente a questo intervento (es. una ricetta mostrata in trasmissione). */
  relatedLinks?: { label: string; href: string }[];
}

/**
 * Nessun intervento reale è ancora stato fornito/verificato: array
 * intenzionalmente vuoto. Le pagine che consumano questo dato (archivio
 * /cristina-in-rai e sezione Home) devono gestire correttamente il caso 0
 * elementi con un empty state editoriale, non con un errore.
 */
export const raiAppearances: RaiAppearance[] = [];
