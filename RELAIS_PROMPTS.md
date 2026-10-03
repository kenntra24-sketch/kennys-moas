# RELAIS_PROMPTS.md — Kenny's Moas UI Redesign

## Contexte du projet

**Application :** KENNY'S MOAS — application scolaire PWA (Progressive Web App) tout-en-un pour lycéens francophones.
**Stack originale :** Monofichier HTML + CSS + JS vanilla (~3250 lignes), stockage IndexedDB + localStorage, Service Worker pour PWA hors-ligne, Google Drive sync via GAPI, PDF.js embarqué.
**Stack de la refonte (Figma Make) :** React 19 + Vite 8 + Tailwind CSS v4 + TypeScript 5.7.

---

## Ce qui a été accompli en Phase 1

### 1. Design System Base

**Fichier :** `src/index.css`

- **Polices Google Fonts :** Lora (serif, titres) + Inter (sans, corps de texte), importées via `@import` en tête du CSS.
- **Palette warm editorial** (conserve l'identité de l'app originale) :
  - Light: bg `#f2ede2` (papier), card `#fffdf8` (crème), primary `#24345c` (marine), accent `#3f7d56` (forêt)
  - Dark: bg `#151310`, card `#1e1b16`, primary `#8ea3d6`, accent `#63b581`
- **Tokens CSS custom properties :** `--p`, `--s`, `--bg`, `--card`, `--txt`, `--mut`, `--bd`, `--sh`, `--sh2`, `--nav-w`, `--nav-collapsed`, `--topbar-h`, `--font-main`, `--font-head`.
- **`[data-theme="dark"]`** : switché via `document.documentElement.setAttribute('data-theme','dark')`, persisté dans `localStorage`.
- Mapping `@theme inline` Tailwind v4 pour les classes `bg-primary`, etc.

### 2. Architecture React

```
src/
  types.ts                    — Types partagés (ViewId, DriveStatus, Theme, Subject, etc.)
  App.tsx                     — Shell principal : routing, sidebar, topbar, search overlay, thème
  index.css                   — Tokens + styles globaux + composants CSS
  components/
    Icons.tsx                 — Bibliothèque d'icônes SVG inline (IcoHome, IcoBook, IcoDrive, etc.)
    Sidebar.tsx               — Navigation latérale collapsible (3 sections + footer)
    Topbar.tsx                — Barre en haut : search bar, Drive status, toggle thème, timer chip
    SearchOverlay.tsx         — Overlay de recherche globale avec clavier (↑↓, ↵, Esc, ⌘K)
    DropZone.tsx              — Zone drag & drop ultra-ergonomique avec retours visuels fluides
  views/
    Dashboard.tsx             — Tableau de bord : 4 stat cards, devoirs, moyennes/matières, fichiers récents
    Library.tsx               — Bibliothèque : vue sujets + vue fichiers, toolbar de filtres, grid/list toggle
    StubViews.tsx             — HomeworkView, ScheduleView, GradesView, ReviewsView, ErrorsView, GoalsView, SettingsView, FaqView
```

### 3. Navigation & Routing

- **Sidebar collapsible** (`var(--nav-w): 240px` → `var(--nav-collapsed): 64px`) avec animation CSS.
- Trois sections : « Travail scolaire » (Accueil, Bibliothèque, Devoirs, Emploi du temps, Notes) + « Suivi » (Révisions, Erreurs, Objectifs) + footer (Réglages, Aide/FAQ + bouton toggle collapse).
- **Breadcrumb** sous le topbar sur toutes les vues sauf le dashboard.
- **Mobile dock** (bottom nav) pour les 5 vues principales, masqué ≥769px.
- **SearchOverlay** (⌘K / Ctrl+K) avec navigation clavier, résultats filtrés en temps réel.

### 4. Dashboard

- 4 stat cards : Moyenne générale, Devoirs en attente, Fichiers importés, Sessions de révision.
- Colonne gauche : devoirs à venir (avec indicateurs urgents) + chart de moyennes par matière (barres CSS).
- Colonne droite : actions rapides + fichiers récents + conseil du jour.
- Layout responsive : 2 colonnes → 1 colonne < 1100px.

### 5. Bibliothèque & Import

- **DropZone** (`src/components/DropZone.tsx`) :
  - Drag & drop natif (dragEnter/dragLeave/drop) + input file en fallback.
  - Retour visuel : scale, border-color, shadow animée au survol et pendant le drag.
  - Pastilles de types acceptés (PDF, Images, Word, Excel, PowerPoint, Audio).
- **Library** (`src/views/Library.tsx`) :
  - Vue « par matière » (grid avec color-top-border par matière, count, progress bar).
  - Vue « fichiers » avec filtres (recherche, matière, type), toggle grille/liste.
  - Carte fichier (grid) : cover colorée + nom + tags + métadonnées.
  - Ligne fichier (list) : icône + nom + méta + actions au survol.

### 6. Google Drive Status (topbar)

- Composant `drive-status` dans `Topbar.tsx` : pastille colorée + icône Drive.
- Classe CSS `.drive-dot` avec variantes : `ok` (vert + glow), `syncing` (orange + animation pulse), `offline` (gris), `error` (rouge).
- Clic → navigue vers Réglages → carte `#gdriveCard`.
- **Logique Drive non implémentée en Phase 1** : les constantes `GD_CLIENT_ID` / `GD_API_KEY` restent à configurer par l'utilisateur (voir SETUP.md original). Le code Drive complet est dans `index.html` original, à porter en Phase 2.

### 7. Vues stub (fonctionnelles, UI complète)

- **Devoirs** : liste avec toggle done/pending, indicateurs urgents, filtres.
- **Emploi du temps** : grille hebdomadaire avec cours colorés par matière.
- **Notes** : table par matière + stat cards + barres de progression.
- **Révisions** : minuteur Pomodoro fonctionnel (Start/Pause/Stop) + grille des méthodes de révision.
- **Erreurs** : stats + liste récente.
- **Objectifs** : placeholder vide avec CTA.
- **Réglages** : matières/coefs, carte Google Drive, apparence, sauvegarde.
- **FAQ** : accordéon de questions + carte « À propos ».

---

## État actuel du code

### Fichiers clés et leurs emplacements

| Fichier | Rôle |
|---|---|
| `src/App.tsx:1` | Shell, state global (view, theme, sidebarCollapsed, searchOpen), kbd shortcuts |
| `src/App.tsx:37` | `useEffect` application du thème + persistance localStorage |
| `src/App.tsx:50` | Shortcut ⌘K pour search overlay |
| `src/components/Sidebar.tsx:1` | Sidebar collapsible, sections nav |
| `src/components/Topbar.tsx:1` | Topbar : search, Drive status, theme toggle |
| `src/components/SearchOverlay.tsx:1` | Overlay recherche globale (mock) |
| `src/components/DropZone.tsx:1` | Zone drag & drop |
| `src/views/Dashboard.tsx:1` | Tableau de bord complet |
| `src/views/Library.tsx:1` | Bibliothèque (sujets + fichiers + filtres) |
| `src/views/StubViews.tsx:1` | Toutes les autres vues |
| `src/index.css:1` | Tokens CSS + tous les styles |
| `src/types.ts:1` | Types TypeScript partagés |

### Données mock (à remplacer par localStorage/IndexedDB)

- `Dashboard.tsx` : `STATS`, `UPCOMING_HW`, `RECENT_FILES`, `SUBJ_AVGS`
- `Library.tsx` : `SUBJECTS`, `MOCK_FILES`
- `StubViews.tsx` : `HW_ITEMS`, `SCHEDULE_CELLS`, `GRADES_DATA`, `METHODS`, `FAQ_ITEMS`

### Ce qui est intentionnellement absent de Phase 1

- Connexion Google Drive réelle (stubs UI uniquement, pas de GAPI)
- Service Worker (`sw.js` — existe dans l'app originale, à intégrer lors du build final)
- PDF.js (`pdf.min.mjs` / `pdf.worker.min.mjs` — à intégrer dans le reader, Phase 2)
- localStorage/IndexedDB réels (données mock seulement)
- Calendrier mensuel avancé (Phase 2)
- Lecteur PDF intégré (Phase 2)
- Export ICS / export JSON (Phase 2)
- Notifications (Phase 2)
- Sauvegarde automatique (Phase 2)
- Leitner / Flashcards (Phase 2)
- Palette de commandes avancée (stubs)

---

## Prompt exact pour Phase 2

```
# MISSION : REFONTE KENNY'S MOAS — PHASE 2

Tu reprends la Phase 1 déjà complétée d'une refonte React de l'application KENNY'S MOAS.
Lis ce fichier RELAIS_PROMPTS.md en entier avant de commencer.

## Contexte
Stack : React 19 + Vite 8 + Tailwind CSS v4 + TypeScript 5.7
Design system : `src/index.css` — palette warm editorial (Lora + Inter, navy #24345c, forêt #3f7d56)
Architecture : décrite ci-dessus dans « État actuel du code »
Données : actuellement mock, à brancher sur localStorage/IndexedDB

## ZÉRO PERTE DE FONCTIONNALITÉS
- Conserver Google Drive (logique IIFE de index.html original, bloc `SYNCHRONISATION GOOGLE DRIVE`)
- Conserver Service Worker (`sw.js` de l'app originale, à wirer dans `index.html` de Vite)
- Conserver PDF.js (`pdf.min.mjs` / `pdf.worker.min.mjs`) pour le lecteur intégré

## PÉRIMÈTRE DE LA PHASE 2

### A. Persistance des données
- Brancher toutes les vues sur localStorage (via un hook `useStore`)
- Brancher la Bibliothèque sur IndexedDB (`monEcoleV2`, stores: `files`, `annot`, `read`, `backups`)
- Reprendre les fonctions de l'app originale : `S` (Proxy store), `LS`, `dbPut/dbGet/dbAll/dbDel`
- Migrer les données mock → store réel

### B. Calendrier avancé
- Refonte complète de la vue Emploi du temps :
  - Vue mensuelle avec mini-calendrier + vue semaine détaillée
  - Gestion des événements (cours, devoirs, révisions) avec couleurs par matière
  - Export ICS (fonction `icsExportBtn` de l'original, à porter)
  - Congés scolaires (en vert dans le calendrier)

### C. Lecteur PDF intégré
- Intégrer PDF.js (`pdf.min.mjs` / `pdf.worker.min.mjs`) dans la vue Bibliothèque
- Recréer le reader overlay (`<div class="reader">`) avec :
  - Navigation page (précédent/suivant), zoom, mode affichage
  - Recherche dans le document
  - Annotations (surligneur, stylo, gomme, notes)
  - Marque-pages
  - Miniatures PDF réelles (via `pdfToThumb`, renderLibPdfThumbs)
  - Impression

### D. Google Drive (brancher le module existant)
- Porter le bloc IIFE `SYNCHRONISATION GOOGLE DRIVE` de index.html vers un module React
- Remplacer les placeholders `GD_CLIENT_ID` / `GD_API_KEY` par des variables d'environnement Vite (`import.meta.env.VITE_GD_CLIENT_ID`)
- Brancher le composant Drive status (topbar) sur le vrai état de synchronisation
- UI complète dans Réglages → carte #gdriveCard : connexion, sync manuelle, auto, historique

### E. PWA / Service Worker
- Créer `public/sw.js` (ou wirer le sw.js existant)
- Configurer `vite-plugin-pwa` ou équivalent pour l'enregistrement du SW
- Vérifier le manifest.webmanifest et les icônes

### F. Options de personnalisation
- Choix de matières + coefficients persistés
- Choix de couleur principale / secondaire (color pickers)
- Choix de police (système, serif, rond, mono)
- Choix de densité (compact/standard/spacieux)
- Choix de disposition (sidebar étendue/réduite par défaut)
- Classes scolaires (sélecteur de classe avec ses matières par défaut)

### G. Fonctionnalités manquantes
- Palette de commandes (⌘K) branchée sur actions réelles
- Révisions Leitner / flashcards (dialog leitnerDlg)
- Méthodes de révision avec fiches détaillées (REV_METHOD_DETAILS + openMethodDetail)
- Objectifs avec suivi de progression
- Sauvegarde automatique (IndexedDB store `backups`, rotation)
- Export JSON + import de sauvegarde
- Notifications navigateur (devoirs/événements)
- Quasi-doublons à l'import (détection par nom nettoyé)

## Fichier de référence
L'implémentation complète de référence est dans `783051a0_index.html` (app originale, ~3250 lignes).
Fonctions clés à porter :
- `importFiles()` — import de fichiers avec catégorisation
- `renderLib()` / `renderAll()` — rendu de la bibliothèque
- `syncDataBlob()` — synchronisation Drive
- `pdfToThumb()` / `renderLibPdfThumbs()` — miniatures PDF
- `openEvent()` / `renderCal()` — calendrier
- `collectLS()` / `collectLSForSync()` — export des données

Ne reproduis pas ce fichier tel quel. Porte les fonctions dans l'architecture React.
```

---

*Document généré automatiquement lors de la Phase 1 — 19 septembre 2026*
