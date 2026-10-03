# RELAIS-FUSION.md — état de la fusion (à lire en premier)

**Base :** `UI_UX_Redesign_Phase_1` (React 19 + Vite + Tailwind v4 — design « éditorial chaud » Lora/Inter, marine #24345c, forêt #3f7d56, sidebar repliable, dock mobile, recherche ⌘K).
**Apport :** `Kenny-s-Moas-Web-refonte-2026-09-19-F` (app d'origine, monofichier HTML/JS, toutes les fonctionnalités réelles).

Constat important : `src/imports/index.html` de la Phase 1 est **octet pour octet** l'`index.html` de la refonte 2026-09-19-F
(md5 identique). La Phase 1 est donc une maquette React (données factices) de cette app ; la fusion consiste à brancher
les vraies fonctionnalités sur le design React sans rien retirer ni du design ni des fonctions.

## Règles de la fusion
1. Design de la Phase 1 intact (tokens `src/index.css`, composants, vues). On ajoute, on ne remplace pas le look.
2. Aucune fonctionnalité de la Phase 1 retirée (nav groupée, Drive status, DropZone, ⌘K, breadcrumb, dock mobile, thème sombre, Pomodoro…).
3. Les données sont lues/écrites avec **le même schéma que l'app d'origine** (`me:<classe>:<clé>` en localStorage, IndexedDB `monEcoleV2`)
   → les données déjà saisies par Kenny restent utilisables, et `public/legacy/` (app d'origine complète) reste ouvrable sur la même origine.

## Contenu du ZIP
- `src/` … app React (design Phase 1)
- `public/` … PWA : `manifest.webmanifest`, `sw.js`, icônes, `splash/` iOS, `pdf.min.mjs` + `pdf.worker.min.mjs` (PDF.js local)
- `public/legacy/index.html` … **app d'origine complète et fonctionnelle** (filet de sécurité, accessible à `/legacy/index.html`)
- `desktop/app.py` … fenêtre bureau pywebview, sert `dist/` (après `pnpm build`)
- `docs/legacy/` … tous les documents de relais/rapports de l'app d'origine (HANDOFF_TO_NEXT_AI, RAPPORT-ANALYSE-*, CHANGELOG, SETUP, TROUBLESHOOTING…)
- `src/imports/` … copie de référence de l'original (ne pas importer dans le bundle)
- `RELAIS_PROMPTS.md` … relais d'origine de la Phase 1 (contexte design)

## État du portage (version React, données réelles)

**Vérifié** : logique pure testée en Node (moyennes pondérées, Leitner, .ics) et **parcours complet exécuté dans Chromium (Playwright)** sur le build autonome, en `file://` et en `http://` : ajout devoir/note/événement/cellule d'emploi du temps, export .ics, remarque + séance Leitner, objectif, chrono, import PDF + lecteur PDF.js (canvas rendu), recherche ⌘K, thème sombre + couleur, sauvegarde automatique, persistance après rechargement → 0 erreur JS. **Non vérifié** : rendu mobile réel, Brave/Firefox/Safari, `pnpm dev`/`pnpm build` (Vite + Tailwind, pas de réseau pour les installer) — à faire en premier.

| Zone | Statut React | Fichiers |
|---|---|---|
| Couche données (schéma identique à l'original, multi-classes, réactive, sync entre onglets) | fait | `src/lib/store.ts`, `model.ts`, `db.ts` |
| Tableau de bord réel (moyenne/objectif, devoirs, aujourd'hui, événements 7 j, remarques à revoir, fichiers récents, conseil) | fait | `views/Dashboard.tsx` |
| Devoirs (CRUD, catégories, priorité, urgence/retard, rappel, filtres, annuler la suppression, vider les terminés) | fait | `views/Homework.tsx` |
| Notes (barèmes, coef, type, date, devoir associé, modif/suppression annulable, moyennes) | fait | `views/Grades.tsx` |
| Emploi du temps (créneaux ajoutables, cellules éditables) + calendrier mensuel + événements (périodes multi-jours, rappel) + export .ics | fait | `views/Schedule.tsx`, `lib/ics.ts` |
| Erreurs/remarques + répétition espacée (Leitner) + séance de révision | fait | `views/Errors.tsx`, `lib/leitner.ts` |
| Objectifs | fait | `views/Goals.tsx` |
| Révisions : chrono persistant (survit au rechargement), tag de matière, récap hebdo, méthodes | fait | `views/Reviews.tsx`, `lib/timer.ts` |
| Bibliothèque réelle (IndexedDB, import glisser-déposer, par matière, filtres, favoris, étiquettes, renommer/déplacer, suppression annulable) + lecteur PDF.js local (reprise à la dernière page) + images | fait | `views/Library.tsx`, `components/FileViewer.tsx`, `lib/files.ts` |
| Recherche globale ⌘K sur toutes les données + commandes rapides actives | fait | `components/SearchOverlay.tsx` |
| Réglages : classes (dont personnalisées), matières (coef, renommage propagé partout, suppression, export d'une matière), thème/densité/couleur/police, export léger/complet, import, .ics, sauvegardes automatiques + restauration, réinitialisation | fait | `views/Settings.tsx`, `lib/backup.ts` |
| Rappels par notification (événements + devoirs) | fait | `lib/reminders.ts` |
| PWA (manifest, icônes, splash iOS, service worker) + fenêtre bureau | fait | `public/`, `desktop/app.py` |
| **Synchronisation Google Drive** (OAuth, sync données + fichiers, conflits, historique, Picker) | **À PORTER** — fonctionne dans `public/legacy/index.html` (mêmes données) ; bouton dans Réglages → Google Drive | original : `src/imports/index.html` lignes ~2418-3000 et ~3218 |
| Pièce jointe/preuve sur notes, devoirs, événements (`fileId`, via `<FileField>`) — **fait (session I)** ; remarques liées à une note/un devoir (`linkType`/`linkId`) et annotations du lecteur (store `annot`) — **à porter** | partiel | original : `openGrade`, `openHW`, `openRemarksPanel`, lecteur (~1963-2137) ; nouveau : `src/components/ui.tsx` (`FileField`, `AskHost`), `src/lib/ask.ts` |
| Import d'un fichier en tant que devoir, détection de quasi-doublons avancée, rappel de renommage, types de bibliothèque | **À PORTER** (l'import React détecte seulement même nom + même taille) | original ~1590-1963 |
| Bandeaux (migration, digest de retour, rappel d'export), présentation/guide, sélecteur de classe au premier lancement, graphiques de notes, icônes SVG par matière, `startPomodoroTagged` depuis un contrôle | **À PORTER** | original ~2328-2407, ~850-950 |

Tant que ces derniers points ne sont pas portés, **`/legacy/index.html` reste la référence fonctionnelle** : il partage localStorage/IndexedDB avec l'app React (même origine).

## Points d'attention
- Les polices Lora/Inter sont chargées depuis Google Fonts (héritage Phase 1) : hors-ligne, le repli système s'applique. Pour un 100 % local, embarquer les polices dans `public/fonts/`.
- Thème : l'app React garde `km:theme` (Phase 1) et écrit aussi `mode` dans `me:settings` ; la couleur principale personnalisée n'est appliquée que si choisie dans Réglages (`primaryCustom`), pour ne pas écraser le marine #24345c de la Phase 1 avec l'ancien bleu par défaut de l'original.
- Ne jamais réduire un objet à un sous-ensemble de champs à l'écriture (`...cur` est déjà utilisé partout) : l'app d'origine s'appuie sur des champs que l'interface React n'expose pas encore.

## Lancer
- **Utilisateur (Windows)** : double-clic sur `LANCER.bat` → `serve.py` sert `dist/` sur http://127.0.0.1:8765 (même origine que l'ancienne app bureau → anciennes données retrouvées) et ouvre le navigateur. Voir `LISEZ-MOI.txt`.
- **Ne pas ouvrir `index.html` de la racine en double-clic** : c'est l'entrée source de Vite (référence `/src/main.tsx`) → page blanche. `dist/index.html` fonctionne en double-clic (secours, sans lecteur PDF ni hors-ligne).
- `dist/` livré = build autonome `node tools/build-standalone.mjs` (esbuild, bundle IIFE, CSS sans Tailwind + « preflight » équivalent). Il a besoin de `esbuild`, `react`, `react-dom` dans `node_modules`.
- **Développeur** : `pnpm install` ; `pnpm dev` ; `pnpm build` (Vite + Tailwind v4, écrase `dist/`) ; `python desktop/app.py` (fenêtre pywebview).

## Session G — 19 septembre 2026 (suite, à la demande de Kenny « Continue »)
- **Astuce d'environnement** : `react`, `react-dom` et `esbuild` (via le paquet `tsx`) sont présents globalement dans le conteneur
  (`/home/claude/.npm-global/lib/node_modules`). En les symlinkant dans `node_modules/`, `node tools/build-standalone.mjs`
  fonctionne **sans réseau** → a permis de vérifier le vrai `src/` dans Chromium (Playwright), pas seulement de lire le code.
  `pnpm build` (Vite+Tailwind) reste impossible ici (ces deux paquets ne sont pas dans le cache global).
- **Bug corrigé** : sur mobile (≤768px), 5 sections sur 10 (Révisions, Mes erreurs, Objectifs, Réglages, Aide/FAQ) étaient
  **inatteignables** — le bouton hamburger existait déjà dans `Topbar.tsx` (icône, id, prop `onMobileMenu`) mais avait
  `display:none` en dur et n'était jamais câblé. Corrigé : `App.tsx` (état `mobileMenuOpen`), `Sidebar.tsx` (tiroir
  off-canvas avec bouton fermer + clic sur fond + Échap), `index.css` (`.sidebar-backdrop`, `.mobile-open`, media query).
  Vérifié dans Chromium 390×844 : ouverture/fermeture, navigation vers une section auparavant inaccessible, 0 erreur console.
- **Vérification large** : les 9 vues testées en 1280×900 et 390×844, thèmes clair/sombre → 0 erreur console/page partout.
- **Reste à faire** (inchangé, voir tableau plus haut) : synchronisation Google Drive, pièces jointes notes/devoirs/événements,
  import fichier→devoir avec détection de quasi-doublons avancée, bandeaux/présentation/graphiques de notes.

## Session H — 19 septembre 2026 (suite, à la demande de Kenny « Continue »)
- **Porté** : détection de quasi-doublon à l'import + rappel de renommage pour les noms de photo/scan peu clairs
  (ligne « Import d'un fichier… » du tableau ci-dessus, partiellement — reste la variante « import en tant que
  devoir » avec sa propre suggestion de matière, non touchée cette session). Portage fidèle des deux heuristiques de
  `public/legacy/index.html` (`coreFileName()`, `looksLikeUnclearFileName()`) vers `src/lib/files.ts`
  (`importFiles()`) : un seul quasi-doublon dans le lot → toast avec bouton « Remplacer l'ancien » (supprime l'ancien
  fichier IndexedDB) ; un seul nom peu clair → toast avec bouton « Renommer » (utilise `window.prompt`, l'app React
  n'a pas encore l'équivalent de la boîte de dialogue `askText` de l'original — voir Limites) ; plusieurs noms peu
  clairs → simple message groupé, comme l'original. Ne change rien au comportement existant (doublon exact toujours
  compté séparément dans `dup`, jamais de remplacement/renommage automatique).
- **Vérifié dans Chromium (Playwright)**, sur le build autonome (`node tools/build-standalone.mjs`, symlinks
  `react`/`react-dom`/`esbuild` déjà documentés en session G) servi en `http://` : import simple, toast de nom peu
  clair + clic sur « Renommer » (le prompt renomme bien le fichier dans la Bibliothèque), import d'un quasi-doublon
  (`Rapport.pdf` puis `Rapport (1).pdf`) + clic sur « Remplacer l'ancien » (l'ancien fichier disparaît bien de la
  liste, le nouveau reste). 0 erreur console dans les trois scénarios.
- **Limite connue (corrigée en session I — voir plus bas)** : le renommage utilisait `window.prompt()`
  (natif du navigateur), pas une boîte de dialogue stylée cohérente avec le reste de l'app.
- `public/sw.js` : cache `kennys-moas-react-v1` → `kennys-moas-react-v2` (et `dist/sw.js` régénéré en conséquence).
- **Reste à faire** (inchangé sinon) : synchronisation Google Drive, pièces jointes notes/devoirs/événements, import
  fichier→devoir avec sa propre détection de quasi-doublons, bandeaux/présentation/graphiques de notes, boîte de
  dialogue de renommage stylée (voir Limite connue ci-dessus).

## Session I — 19 septembre 2026 (suite, à la demande de Kenny « Continue »)
- **Porté** : « Pièce jointe/preuve sur notes, devoirs, événements » (ligne du tableau ci-dessus). Nouveau composant
  partagé `<FileField>` (`src/components/ui.tsx`) — portage de `fileFieldHTML()`/`fillFileSelect()`/
  `wireFileImport()` de l'app d'origine : liste déroulante des fichiers déjà dans la Bibliothèque de la classe
  active (`listFiles()`) + bouton « Importer » qui ajoute un nouveau fichier via `importFiles()` (donc les
  vérifications de quasi-doublon/nom peu clair de la session H s'appliquent aussi ici) et le sélectionne aussitôt.
  Câblé dans les trois formulaires qui ont un champ `fileId` dans le modèle de données mais aucun moyen de le
  renseigner côté UI : `Homework.tsx` (`HomeworkForm`), `Grades.tsx` (`GradeForm`), `Schedule.tsx` (`EventForm`).
  Rien d'autre modifié dans ces formulaires ; le champ `fileId` était déjà conservé à l'écriture (spread `...cur`/
  `...g`), donc aucune perte de données pour les entrées créées avant cette session.
  **Non porté cette session** (reste dans le tableau) : `linkType`/`linkId` des remarques (Erreurs) reliées à une
  note/un devoir, et les annotations du lecteur PDF (store `annot`) — deux chantiers distincts de celui-ci.
- **Corrigé au passage** : le rappel de renommage de la session H utilisait `window.prompt()` (boîte native du
  navigateur, visuellement incohérente avec le reste de l'app) faute d'équivalent React au `askText()` de
  l'original — en fait le composant `<AskText>` existait déjà dans `ui.tsx` (utilisé par `Schedule.tsx`), simplement
  pas utilisable depuis du code hors composant comme `lib/files.ts`. Ajout de `src/lib/ask.ts` (`askText()`) sur le
  même principe pub/sub que `toast.ts`, plus un composant hôte `<AskHost>` (monté une fois dans `App.tsx`, à côté de
  `<ToastHost>`) qui affiche `<AskText>` sur demande. `lib/files.ts` utilise maintenant `askText()` au lieu de
  `window.prompt()`. Aucun autre appel à `window.prompt`/`window.confirm`/`window.alert` ailleurs dans `src/`.
- **Vérifié dans Chromium (Playwright)**, build autonome servi en `http://` : import de fichier avec attachement
  direct dans un devoir (le fichier importé apparaît sélectionné dans le menu déroulant, le devoir s'enregistre
  correctement) ; rappel de renommage → boîte de dialogue stylée `<AskText>` confirmée (titre « Renommer le
  fichier », champ pré-rempli avec le nom actuel, **zéro `dialog` natif du navigateur déclenché** — vérifié en
  écoutant l'événement Playwright `dialog`, qui ne s'est jamais déclenché) → renommage appliqué et visible dans la
  Bibliothèque. Balayage complet des 9 vues + formulaires Devoirs/Notes/Emploi du temps (qui ouvrent tous
  maintenant un `<FileField>`), en 1280×900 clair/sombre et 390×844 (tiroir mobile) : **0 erreur console partout**.
- `public/sw.js` : cache `kennys-moas-react-v2` → `kennys-moas-react-v3` (et `dist/sw.js` régénéré en conséquence).
- **Reste à faire** : synchronisation Google Drive, `linkType`/`linkId` des remarques + annotations du lecteur PDF,
  import fichier→devoir avec sa propre détection de quasi-doublons, bandeaux/présentation/graphiques de notes.

## Emploi du temps — retours du 20/09/2026

- **Créneaux impossibles à supprimer** : seules les heures ajoutées à la main (`extraHours`) avaient une croix. Les heures du
  socle par défaut (`HOURS`, 08h→17h) sont maintenant masquables aussi (`hiddenHours`, nouveau champ, réversible via une puce
  « + 08h » qui réapparaît). Idem pour les jours (`hiddenDays`) : chaque colonne a sa propre croix (visible au survol de
  l'en-tête), pour raccourcir la semaine à Lundi–Vendredi si l'établissement ne fait pas cours le samedi.
- **Créneaux « superposés »** : `AskText` acceptait "8h" en plus de "08h" (regex `\d{1,2}h`), créant deux lignes pour la même
  heure réelle. Ajout de `normHour()` (calc.ts) : normalise la saisie et compare par valeur (minutes), plus par égalité de
  chaîne — un doublon fusionne désormais avec la ligne existante au lieu d'en créer une nouvelle.
- **Couleurs de matières peu distinctes** : l'ancienne palette (11 teintes) avait deux verts, deux violets, deux oranges et
  deux bleus proches. Nouvelle palette de 14 teintes, une seule par famille (`calc.ts`). Opacité de fond des cases remplies
  relevée (8 %→15 %) et bordure plus marquée (33 %→50 %) pour que la couleur se voie mieux sur les surfaces claires.
  Légende des matières utilisées ajoutée sous la grille.
- Suppression toujours réversible immédiatement (toast « Annuler »named comme ailleurs dans l'app) ; la puce de créneau/jour
  masqué le réaffiche vide (les cours qu'il contenait restent supprimés une fois le toast disparu — comme pour les devoirs).
- **Vérifié** dans Chromium : suppression avec confirmation si occupé / sans confirmation si vide, undo immédiat, anti-doublon
  ("8h" fusionne avec "08h"), persistance après rechargement, rendu clair/sombre/Verre. Vue Calendrier (mensuelle) non
  affectée : elle colore par TYPE d'événement (`EVCOLORS`), pas par matière.

## Session J — 23 septembre 2026 (passe de polish UI, à la demande de Kenny)

Reçu un pack de continuation (`PROMPT_FOR_NEXT_AI.md` + 4 captures annotées) demandant une passe de densité/hiérarchie
UI, **à faire partie par partie** (Emploi du temps → Notes → Erreurs → Bibliothèque → Barre latérale), sans
redesign ni changement d'architecture. Build vérifié après **chaque** partie avec `node tools/build-standalone.mjs`
(react/react-dom/esbuild symlinkés depuis les paquets globaux du conteneur, comme en session G — toujours pas de
réseau ici pour `pnpm install`/`pnpm build`). **Aucun accès navigateur (Playwright) cette session** — pas de
Chromium en cache et pas de réseau pour l'installer ; les changements sont donc vérifiés par relecture de code +
build sans erreur, **pas par capture d'écran réelle**. À vérifier visuellement en priorité à la prochaine session.

**Fait (parties A–D)** :
- **A. Emploi du temps** (`views/Schedule.tsx`) : la grille masque par défaut les lignes d'heures vides en dehors de
  la plage réellement utilisée (+1h de marge de chaque côté), via un bouton « + N heures masquées » /
  « Réduire la grille ». Aucune donnée touchée (`hrs`/`hiddenHours`/`extraHours`/`schedule` intacts) — uniquement un
  filtre d'affichage (`collapsedHrs`/`showAllHours`). `index.css` : `.edt td` 46px→40px, `border-spacing` 5→4px.
- **B. Notes** (`views/Grades.tsx`) : cartes de résumé resserrées (padding/marge réduits), libellés factuels
  renommés (« Meilleure moyenne » / « Moyenne la plus basse »). `.grid-tbl td` padding 9→7px. Calculs
  (`overallAvg`/`subjAvg`) non touchés.
- **C. Mes erreurs** (`views/Errors.tsx`, `components/ui.tsx`) : nouvelle variante `size="md"` du `Modal` (600px,
  `.modal.md` dans `index.css`, à côté de `.modal.wide` existant à 720px utilisé par `FileViewer` — non touché).
  Matière + Chapitre regroupés dans un `<Cols>` (déjà responsive, empile <480px).
- **D. Bibliothèque** (`index.css` `.subjects-grid`/`.subj-card`/`.subj-ico`/`.subj-name`/`.subj-count`) : grille
  resserrée (`minmax` 180→148px, padding/gap/icône réduits).

**Reste à faire (vérification visuelle globale uniquement — les 5 parties sont codées)** :
- Idéalement, rejouer la vérification Playwright (parcours + captures) une fois Chromium disponible, sur les 5
  zones ci-dessus, desktop (1280×900) et mobile (390×844), thèmes clair/sombre — comme en session G/H/I.
- `public/sw.js` → `v7` cette session (copié aussi à la racine du dépôt) : à réincrémenter si une prochaine session
  modifie encore des fichiers livrés.

**E. Barre latérale** (`components/Sidebar.tsx`, `index.css`) — fait dans la foulée de la partie D, même session :
largeur réduite (`--nav-w` 240→226px en normal, 266→250px en large, 222→210px en étroit), padding/`gap` des
`.nav-btn`/`.sidebar-brand` resserrés, icônes 30→28px, `max-width` du libellé ajusté (180→165px, l'ellipsis
existant absorbe le reste). Mode réduit (`--nav-collapsed`, 64px, inchangé), tooltips (`title` sur `NavBtn` quand
`collapsed`), navigation et état actif non touchés.

Le pack de continuation original (prompt + captures) reste dans `docs/handoff-2026-09-23/` à la racine du dépôt
pour référence si une vérification visuelle doit être reprise.

## Session K — 28/09/2026 — Phase 0 + Phase 2 (v1.4.1-convergence)

**Décision `progress`** (déléguée par Kenny) : `files.progress` = pourcentage ; page de reprise dans `read`. Anciennes valeurs ni migrées ni remises à zéro (rien de silencieux) : ignorées pour la reprise, réécrites à la prochaine ouverture.
**Fichiers** : `src/components/FileViewer.tsx` (réécrit : portail sur `<body>`, `#root` inert, `body.noscroll`, Échap, flèches, restitution du focus), `src/lib/files.ts` (`progressPct`, `getRead`, `saveRead`), `src/lib/db.ts` (type `ReadState`), `src/index.css` (`.reader`, `.rd-*`), `public/legacy/index.html` + `legacy/index.html` (polyfill), `public/sw.js` (v8), `package.json`.
**Vérifié en navigateur réel (Chromium, Playwright, 1280×900 et 390×844)** : lecteur = 100 % du viewport ; canvas peint ; `#root` inert pendant la lecture puis rétabli ; Échap et « Retour » ferment ; page 3 → `progress` = 75 et `read.page` = 3 ; réouverture reprend à la page 3 ; 0 erreur console.
**Non fait / non testé** : vérification visuelle de la session J ; `pnpm build` ; Safari/iOS réel ; test du polyfill `legacy` en navigateur. L'échelle du PDF reste fixe (1,4, réduite par CSS si trop large) : zoom et « ajuster largeur/page » = Phase 3.
**Suite** : Phase 3 (contrôles du lecteur).

## Session L — 28/09/2026 — Phase 3 (contrôles du lecteur)

**Fichiers** : `src/components/FileViewer.tsx` (zoom, ajustements, marque-page, menu « plus », impression), `src/components/Icons.tsx` (IcoMinus/FitWidth/FitPage/Print/Bookmark/More), `src/index.css` (`.rd-tools`, `.rd-menu`), `public/sw.js` (v9).
**Modèle `read`** : `zoom` garde le sens de l'app d'origine (multiplicateur de la largeur, 1 = ajuster largeur) ; `fit` (`'width'|'page'`) est un champ optionnel ajouté ; `bookmarks:[{p,label}]` comme Ronde 11 ; `mode` intact.
**Vérifié en navigateur réel (Chromium, 1280×900 et 390×844)** : 100 % = largeur exacte de la zone ; + → 115 %, largeur du canvas ×1,15 ; max 300 % (bouton + désactivé) ; ajuster page → page entière visible (43 % sur desktop, 100 % sur mobile car limitée par la largeur) ; marque-page ajouté/retiré et persistant après rechargement complet ; zoom 70 % restitué à la réouverture ; Imprimer ouvre un onglet `blob:` ; Échap ferme le menu puis le lecteur ; 0 erreur console.
**Non fait / non testé** : impression réelle sur imprimante ; pincer-pour-zoomer tactile ; Safari/iOS réel ; liste des marque-pages (Phase 4).
**Suite** : Phase 4 (panneau de marque-pages, « Reprendre à la page N ? »).

## Session M — 28/09/2026 — Phase 4 (position de lecture + marque-pages)

**Fichiers** : `src/components/FileViewer.tsx` (panneau, bandeau de reprise, sauvegarde finale, garde d'erreur de rendu), `src/components/Icons.tsx` (IcoBookmarkList, IcoX), `src/index.css` (`.rd-bm`, `.rd-panel`, `.rd-resume`), `public/sw.js` (v10).
**Décision** : au lieu de la question Ronde 11 (« Reprendre à la page N ? », page 1 d'abord), on ouvre directement à la page N avec un bandeau « Depuis le début » : pas de double rendu, et aucun risque d'écraser la position sauvegardée.
**Modèle `read`** inchangé : `{id, page, zoom, fit?, mode, bookmarks:[{p,label}]}` ; `files.progress` = % (règle Phase 0).
**Vérifié en navigateur réel (Chromium, 1280×900 et 390×844)** : panneau vide puis 2 marque-pages listés (p.1, p.3, compteur 2) ; clic → page 3 et panneau fermé ; suppression persistée dans `read.bookmarks` ; flèche puis Échap immédiat → `read.page` = 4 et `progress` = 100 ; réouverture → page 4 + bandeau ; « Depuis le début » → page 1 ; rechargement complet → position et marque-page conservés ; 0 erreur console.
**Non fait / non testé** : renommer un marque-page (libellé = « Page N ») ; Safari/iOS réel.
**Suite** : Phase 5 (couche de texte sélectionnable, `TextLayer`).

## Session N — 28/09/2026 — Phase 5 (couche de texte sélectionnable)

**Fichiers** : `src/components/FileViewer.tsx` (conteneur `.rd-page` = canvas + `.textLayer`, `TextLayer` PDF.js 5 annulable), `src/index.css` (`.rd-page`, `.textLayer`), `public/sw.js` (v11), `docs/convergence/tests/verify-phase5.mjs`.
**Choix techniques** : API `pdfjsLib.TextLayer` + `page.streamTextContent()` (pas `renderTextLayer`, absent de 5.6.205 — audit F5). Couche rendue APRÈS le canvas, dans son propre `try/catch` : si elle échoue, la page reste lisible (simple `console.warn`). Elle est annulée et vidée à chaque changement de page/zoom/fermeture (même logique que `renderTask`). `--scale-factor` = échelle CSS (sans dpr) recalculée à chaque rendu. Aucun changement du modèle de données (`read`, `annot`, `files` intacts) ; les rects de la Phase 6 se calculeront relativement à `.rd-page`.
**Vérifié en navigateur réel (Chromium, 1280×900 et 390×844)** : 2 spans attendus / 2 obtenus, à la bonne position (dans le canvas, x = 40 pt → 119 px à l'échelle 2,98) ; triple-clic souris → « Cours de test page 1 Pythagore » ; sélection de toute la couche → texte exact des deux lignes ; page suivante → texte de la page 2, aucun résidu de la page 1 ; zoom + → `--scale-factor` recalculé, 2 spans ; changements de page rapides puis Échap en plein rendu → aucune erreur ; réouverture → reprise page 2 + texte présent ; 0 erreur/avertissement console.
**Non fait / non testé** : PDF scannés sans texte (couche vide, comportement normal) ; gros PDF (>100 pages) ; sélection tactile longue sur iOS/Android réel ; Safari/iOS réel ; `pnpm build`.
**Suite** : Phase 6 (surlignage persistant ancré sur le texte sélectionné, extension `hl` du magasin `annot`).
