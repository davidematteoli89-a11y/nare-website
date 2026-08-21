/**
 * Modello dati editoriale per gli interventi RAI di Cristina di Narè.
 *
 * Fase 4B: popolato con i primi dati reali forniti dal cliente (14 video
 * "Uno Mattina" / "Uno Mattina Estate", Rai1, 2023-2026, cartella
 * _materiali-fase4b/Rai/<anno>/<data>/). Titolo, programma e data sono presi
 * da: nome file (quando descrittivo) o testo effettivamente leggibile a
 * schermo nei lower-third (logo programma, sottopancia con il tema, in un
 * caso il nominativo completo "Cristina Nigrelli — Esperta di economia
 * domestica"). Nessun dato è stato inventato: dove il nome file non conteneva
 * un titolo (5 video), il titolo/tema qui sotto riflette solo ciò che era
 * leggibile nel frame del video stesso (sottopancia), mai un'ipotesi.
 *
 * IMPORTANTE (Step 4B.8, corretto in Fase 4C): _internalRightsStatus è uno
 * stato solo DOCUMENTALE/INTERNO, usato per decidere come e se pubblicare
 * ciascun video — NON deve mai essere mostrato nella UI pubblica.
 *
 * CORREZIONE FASE 4C: i 14 video erano stati marcati erroneamente come
 * "owned_file_rights_confirmed" solo perché i file sono stati forniti
 * direttamente dal cliente. Questo è sbagliato: possedere/ricevere un file
 * video NON equivale ad avere i diritti di ripubblicazione di un contenuto
 * televisivo Rai. Finché Cristina/Davide non confermano esplicitamente il
 * diritto di ripubblicazione, lo stato corretto è "rights_unknown".
 *
 * AGGIORNAMENTO (22 ago 2026): Davide ha confermato esplicitamente che i
 * video sono stati ricaricati su un canale YouTube personale/di Cristina
 * (non il canale ufficiale RAI) — quindi il controllo del contenuto è
 * diretto, non un embed di una fonte terza. 13 dei 14 interventi hanno
 * quindi videoType "youtube" + videoUrl valorizzato e
 * _internalRightsStatus "owned_file_rights_confirmed". L'intervento del
 * 15 aprile 2025 ("Macchie grasse...") resta "none"/"rights_unknown": il
 * link YouTube non è stato fornito ("non disponibile al momento") e non va
 * inventato. Quando sarà disponibile, va aggiornato con lo stesso schema.
 */

/**
 * Tipo di sorgente video per un intervento. "none" indica un intervento
 * documentato solo testualmente/con poster, senza alcun video embeddabile
 * pubblicato (caso di tutti gli interventi in questa fase: i file sorgente
 * esistono ma non sono ancora stati preparati/ospitati per la pubblicazione).
 */
export type RaiVideoType = "cloudflare" | "youtube" | "raiplay" | "external" | "none";

/**
 * Stato interno/documentale dei diritti d'uso di un video — mai esposto in UI.
 * - owned_file_rights_confirmed: il cliente ha confermato ESPLICITAMENTE il diritto di
 *   ripubblicazione del contenuto (non basta possedere/aver ricevuto il file).
 * - official_embed_available: esiste un embed ufficiale RaiPlay/YouTube RAI utilizzabile.
 * - link_only: si può linkare solo la fonte ufficiale, nessun file/embed disponibile.
 * - rights_unknown: file disponibile ma diritto di ripubblicazione NON ancora confermato
 *   dal cliente — stato di default per qualunque file ricevuto senza conferma esplicita.
 *   NON pubblicare in nessuna forma (nessun player, nessun videoUrl, nessun VideoObject).
 */
export type RaiInternalRightsStatus =
  | "owned_file_rights_confirmed"
  | "official_embed_available"
  | "link_only"
  | "rights_unknown";

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
  /**
   * Stato interno dei diritti — SOLO uso editoriale/decisionale, non renderizzare mai
   * in una pagina pubblica. Vedi Step 4B.8.
   */
  _internalRightsStatus: RaiInternalRightsStatus;
}

/**
 * 14 interventi reali, ordinati dal più recente al più vecchio. Tutti con
 * videoType "none" e _internalRightsStatus "rights_unknown" (diritti di
 * ripubblicazione non ancora confermati dal cliente — vedi nota sopra):
 * nessun player pubblico, nessun videoUrl. Poster reale estratto dal file
 * video fornito (frame con Cristina/il tema visibile, nessun logo RAI
 * riprodotto separatamente sul poster) — utilizzabile come archivio
 * editoriale a prescindere dallo stato dei diritti del video stesso.
 */
export const raiAppearances: RaiAppearance[] = [
  {
    id: "unomattina-2026-08-04-condizionatore",
    title: "Salute e aria condizionata: come impostare il condizionatore",
    programme: "Uno Mattina",
    date: "2026-08-04",
    topic: "Casa ed elettrodomestici",
    poster: "/images/rai/rai-unomattina-condizionatore-2026-08-04.jpg",
    videoType: "youtube",
    videoUrl: "https://youtu.be/s58Gbygl4ko",
    _internalRightsStatus: "owned_file_rights_confirmed",
  },
  {
    id: "unomattina-2026-07-22",
    title: "Intervento a Uno Mattina",
    programme: "Uno Mattina",
    date: "2026-07-22",
    poster: "/images/rai/rai-unomattina-2026-07-22.jpg",
    videoType: "youtube",
    videoUrl: "https://youtu.be/dCokpaChbIk",
    _internalRightsStatus: "owned_file_rights_confirmed",
  },
  {
    id: "unomattina-2026-04-07-elettrodomestici",
    title: "Elettrodomestici: la manutenzione riduce consumi e guasti",
    programme: "Uno Mattina",
    date: "2026-04-07",
    topic: "Casa ed elettrodomestici",
    poster: "/images/rai/rai-unomattina-elettrodomestici-2026-04-07.jpg",
    videoType: "youtube",
    videoUrl: "https://youtu.be/7WN4MlLN02Q",
    _internalRightsStatus: "owned_file_rights_confirmed",
  },
  {
    id: "unomattina-2026-04-02-bicarbonato",
    title: "Bicarbonato e percarbonato di sodio: le differenze",
    programme: "Uno Mattina",
    date: "2026-04-02",
    topic: "Pulizia della casa",
    description: "Un confronto pratico tra bicarbonato e percarbonato di sodio per la pulizia domestica.",
    poster: "/images/rai/rai-unomattina-bicarbonato-2026-04-02.jpg",
    videoType: "youtube",
    videoUrl: "https://youtu.be/MGZiuONFEyU",
    _internalRightsStatus: "owned_file_rights_confirmed",
  },
  {
    id: "unomattina-2026-01-02-armadi",
    title: "Liberare spazio e riordinare armadi e cassetti",
    programme: "Uno Mattina",
    date: "2026-01-02",
    topic: "Organizzazione della casa",
    poster: "/images/rai/rai-unomattina-armadi-2026-01-02.jpg",
    videoType: "youtube",
    videoUrl: "https://youtu.be/eOiF1ysCmRE",
    _internalRightsStatus: "owned_file_rights_confirmed",
  },
  {
    id: "unomattina-estate-2025-07-08-salvaspazio",
    title: "Tutorial salva spazio in casa",
    programme: "Uno Mattina Estate",
    date: "2025-07-08",
    topic: "Organizzazione della casa",
    poster: "/images/rai/rai-unomattina-salvaspazio-2025-07-08.jpg",
    videoType: "youtube",
    videoUrl: "https://youtu.be/B64aUm78iVA",
    _internalRightsStatus: "owned_file_rights_confirmed",
  },
  {
    id: "unomattina-estate-2025-06-23",
    title: "Intervento a Uno Mattina Estate",
    programme: "Uno Mattina Estate",
    date: "2025-06-23",
    poster: "/images/rai/rai-unomattina-estate-2025-06-23.jpg",
    videoType: "youtube",
    videoUrl: "https://youtu.be/UiA6OxdnWqE",
    _internalRightsStatus: "owned_file_rights_confirmed",
  },
  {
    id: "unomattina-2025-04-29-acari",
    title: "Allergia agli acari: attenzione a tappeti e peluche",
    programme: "Uno Mattina",
    date: "2025-04-29",
    topic: "Casa e benessere",
    poster: "/images/rai/rai-unomattina-acari-2025-04-29.jpg",
    videoType: "youtube",
    videoUrl: "https://youtu.be/21WGzua_fF0",
    _internalRightsStatus: "owned_file_rights_confirmed",
  },
  {
    id: "unomattina-2025-04-15-macchie",
    title: "Macchie grasse: perché ricorrere subito all'acqua è sbagliato",
    programme: "Uno Mattina",
    date: "2025-04-15",
    topic: "Pulizia dei tessuti",
    poster: "/images/rai/rai-unomattina-macchie-2025-04-15.jpg",
    videoType: "none",
    _internalRightsStatus: "rights_unknown",
  },
  {
    id: "unomattina-estate-2024-08-28-farfalline",
    title: "Farfalline nella dispensa: cosa fare",
    programme: "Uno Mattina Estate",
    date: "2024-08-28",
    topic: "Casa e dispensa",
    poster: "/images/rai/rai-unomattina-farfalline-2024-08-28.jpg",
    videoType: "youtube",
    videoUrl: "https://youtu.be/SN3N4n3fnKM",
    _internalRightsStatus: "owned_file_rights_confirmed",
  },
  {
    id: "unomattina-estate-2024-06-21-condizionatori",
    title: "Condizionatori e ventilatori",
    programme: "Uno Mattina Estate",
    date: "2024-06-21",
    topic: "Casa ed elettrodomestici",
    poster: "/images/rai/rai-unomattina-condizionatori-2024-06-21.jpg",
    videoType: "youtube",
    videoUrl: "https://youtu.be/VRg9buTHDTU",
    _internalRightsStatus: "owned_file_rights_confirmed",
  },
  {
    id: "unomattina-2024-03-12-calcare",
    title: "Via il calcare da bagno e cucina",
    programme: "Uno Mattina",
    date: "2024-03-12",
    topic: "Pulizia della casa",
    poster: "/images/rai/rai-unomattina-calcare-2024-03-12.jpg",
    videoType: "youtube",
    videoUrl: "https://youtu.be/B0fjAFpaqs8",
    _internalRightsStatus: "owned_file_rights_confirmed",
  },
  {
    id: "unomattina-2024-01-26-lavandino",
    title: "Manutenzione in casa: come disostruire il lavandino",
    programme: "Uno Mattina",
    date: "2024-01-26",
    topic: "Manutenzione della casa",
    poster: "/images/rai/rai-unomattina-lavandino-2024-01-26.jpg",
    videoType: "youtube",
    videoUrl: "https://youtu.be/0mkhdtLTXiA",
    _internalRightsStatus: "owned_file_rights_confirmed",
  },
  {
    id: "unomattina-2023-10-17-pulizie-bagno",
    title: "Come igienizzare il pavimento del bagno",
    programme: "Uno Mattina",
    date: "2023-10-17",
    topic: "Pulizia della casa",
    poster: "/images/rai/rai-unomattina-pulizie-bagno-2023-10-17.jpg",
    videoType: "youtube",
    videoUrl: "https://youtu.be/K2WBj2-Bl50",
    _internalRightsStatus: "owned_file_rights_confirmed",
  },
];
