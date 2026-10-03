# REPRISE — journal de reprise (à mettre à jour à chaque pièce)

Lis ce fichier en premier. Il permet à une nouvelle conversation (autre IA, forfait gratuit) de reprendre sans rien perdre.

## Où on en est
- **À LIRE AVANT 2b/3/4/5/6/7 : `docs/retours/RETOURS-UTILISATEUR-2026-09-30.md`** (emploi du temps réel du lycée + retours de l'utilisateur, cahier des charges réel).
- **Version** : 1.5.0-p5f (`source/package.json`, affichée dans Réglages). Cache du service worker : `kennys-moas-<BUILD_ID>`, BUILD_ID calculé automatiquement par le build (plus de numéro à incrémenter).
- **Pièce 0 (stabilisation)** : PAS faite — elle exige `pnpm` + réseau + navigateur. Le build utilisé ici est le **build autonome** (`source/tools/build-standalone.mjs`, esbuild). `pnpm build` (Vite + Tailwind) n'a jamais été lancé depuis cette session.
- **Pièce 1 (données)** : faite et vérifiée (voir `RAPPORT-P1.md`).
- **Pièce 2 (identité) — découpée en 2a / 2b / 2c** :
  - **2a FAIT** (voir `RAPPORT-P2A.md`) : nouveau logo (`public/logo.svg`, « K » crème sur marine + pastille verte), générateur `source/tools/make-icons.mjs` (sharp) → `icon*.png`, `icon.ico`, maskable, `splash/*` ; symbole Drive = nuage + flèche (`IcoCloudUp`, `IcoDrive` en est l'alias) avec libellé « Sauvegarde Drive » et états honnêtes (Non connecté / Connecté / Sauvegarde en cours… / Hors ligne / Erreur / « Dernière sauvegarde : HH:MM ») ; `km:driveLastSave` (localStorage, hors sauvegardes) ; faux texte retiré (« Drive synchronisé », « Importer depuis Drive » n'existait pas).
  - **2b VÉRIFIÉ (30/09, session suivante)** : build autonome lancé, bundle racine régénéré, vu dans Chromium (desktop + 390 px), 0 erreur console, 0 bouton sans nom, zones tactiles ≥ 44 px (voir `RAPPORT-P2B.md`). Pour compiler ici : lier `react`, `react-dom`, `esbuild` (global, via tsx) dans `source/node_modules` puis `node tools/build-standalone.mjs` (ne pas livrer `node_modules`). Reste : polices embarquées (réseau requis).
  - **2b PARTIEL (30/09)** : FAIT = 10 icônes de navigation redessinées (bicolores, `Icons.tsx`), couleur par section (`NAV_COLORS` dans `Sidebar.tsx` + fin d'`index.css`), textes honnêtes (`DropZone`, `FileViewer`). NON recompilé (pas d'esbuild hors-ligne) : lancer le build autonome pour régénérer `app.js`/`app.css` racine. + réglage « Taille du texte et de l'affichage » (`textSize`, CSS `zoom`, Réglages → Apparence). Apparence déjà existante : thème, accent, 2 couleurs, polices, surface, arrondis, densité. RESTE = audit des boutons ; polices encore chargées depuis Google Fonts (pas embarquées → hors-ligne = police système) ; rien de tout ça n'a été compilé ni testé à l'écran.
  - **2b (reste) À FAIRE** : audit des boutons (liste avant → après), design system (`index.css` : variables, états, densité), réglages d'apparence (thème, accent, **5 polices réellement chargées + embarquées localement**, taille du texte, arrondi).
  - **2c PARTIEL FAIT (30/09)** : couleur par matière (pastilles + libre + automatique) et réordonnancement ↑/↓ dans Réglages, testé dans Chromium (`RAPPORT-P2C.md`). RESTE : icône par matière, réaffectation à la suppression, contraste clair/sombre. Puis pièce 3.
  - **2c (plan initial)** : matières personnalisables (couleur libre + icône + réordonner, réaffectation à la suppression), couleur appliquée partout, contraste clair/sombre ; remplacer/valider le jeu d'icônes (le jeu actuel est déjà de style trait 1,9 px sur grille 24 — à vérifier icône par icône, surtout emploi du temps).
- **Pièce 5 — 5a FAIT (30/09)** : voir `RAPPORT-P5A.md`. Modèle `lib/timetable.ts` (`ClassTimetable = {id,name,school?,room?,days,slots,blocks,teachers}`), écran `views/ClassTimetable.tsx`, modèle TA1 prérempli (3 cases « ? » à confirmer).
- **Pièce 5 — 5b FAIT (30/09)** : voir `RAPPORT-P5B.md`. Plusieurs emplois du temps (actif = clé `timetable`, rangés = NOUVELLE clé `timetables` ; fonctions pures `addTimetable/switchTimetable/removeActive/duplicateTimetable`), horaires modifiables (`validateSlots`), export `.ics` du nouveau modèle (`lib/timetableIcs.ts`, fuseau Africa/Abidjan), rappels locaux avant cours (`getTtRemind`, clé `me:ttRemind`), cours du jour sur le tableau de bord. L'ancienne `schedule` reste intacte (ne jamais la supprimer).
- **Pièce 5 — 5c À FAIRE** : semaines A/B, jours supplémentaires (Sam/Dim), copier-coller/glisser, affichage compact, réglages du calendrier (plage horaire, premier jour, récurrence modifiable), Google Agenda en direct. Tester le `.ics` dans un vrai agenda.
- **Pièces 3, 4, 6, 7, 8** : à faire, dans l'ordre. Les fiches sont dans `docs/pack/pieces/`, le prompt maître dans `docs/pack/01_Super_Prompt_Maitre.md`.

## Décisions de la pièce 1 (à respecter ensuite)
1. **La clé de stockage reste `errors`** (`me:<classe>:errors`) : une « Remarque » est une ancienne « erreur » avec des champs en plus (`genre`, `texte`, `source`). Ainsi `legacy/index.html` et les sauvegardes existantes restent lisibles. « Créée le » = le champ `date` existant.
2. **On ajoute, on ne supprime jamais** : `fileId`, `linkType`/`linkId`, `homeworkId`, `libraryType`, `homeworkType` sont conservés et lus par `relations.ts`.
3. **Fichiers (IndexedDB)** : pas de liens écrits côté fichier ; ils sont dérivés (`getRelated({type:'file', id})` relit devoirs/notes/remarques/événements). Le champ `page` d'un lien n'existe que sur un lien vers un fichier, et n'est jamais affiché tant qu'il n'est pas stocké.
4. **Catégories** : `cours | fiche | exercice | notes`. « Autre support » → cours ; devoir / exercice / « Autre travail » → exercice ; rien de reconnu → `null` (« Non classé »), on n'invente rien. Pas de catégorie « Autre ».
5. **Remplacement de fichier** : id conservé ; nom, matière, catégorie, favori, étiquettes, chapitre, dernière ouverture conservés ; blob/taille/type/date remplacés ; progression et marque-pages (`read`) remis à zéro ; les annotations (`annot`) ne sont pas touchées.
6. **Suppression** : confirmation seulement quand l'objet est relié (sinon l'ancien « Annuler » suffit) ; pour un fichier, la confirmation est toujours demandée. Les devoirs créés à l'import sont conservés par défaut (option « supprimer aussi »).
7. **Intégrité au démarrage** : si la Bibliothèque est vide, aucun lien vers un fichier n'est supprimé (stockage évincé → une restauration pourrait ramener les fichiers).
8. Matières : `{ name, coef, id?, color?, icon? }` — `name` reste la clé des données existantes ; `id` ajouté par migration ; `color`/`icon` seront gérés en pièce 2.

## Modèle de données actuel (schéma 2)
- localStorage `me:<classe>:<clé>` : `subjects, grades, homework, errors(=remarques), events, sessions, schedule, extraHours, hiddenHours, hiddenDays, goal, schemaVersion`.
- `Link = { type: 'file'|'homework'|'remark'|'session'|'result'|'event'|'note'; id: string; page?: number }` (`result` = note chiffrée ; `session.id` = `String(session.date)` ; `note` réservé).
- IndexedDB `monEcoleV2` : `files` (`… libraryType, homeworkType, category`), `annot`, `read`, `backups`.

## Fichiers clés
`source/src/lib/relations.ts` (liens) · `lib/migrate.ts` (migration, `categoryFor`) · `lib/deletion.ts` (suppression d'objets) · `lib/files.ts` (import, `replaceFile`, `removeFile`) · `lib/model.ts` (types) · `views/Errors.tsx` (Remarques) · `tests/p1.test.ts` · `tools/verify-sync.mjs`.

## Ce qui reste / à surveiller
- Pièce 0 (partiellement faite au LOT 1 : chaîne unique esbuild, version dans Réglages, SW versionné) : reste la vérification des types TypeScript et la génération de `source/pnpm-lock.yaml` (LOT 1.1 : pnpm unique, workflow « Générer le verrou pnpm ») ; tester la mise à jour du service worker.
- Les vues TSX n'ont pas été vérifiées par `tsc` (pas de `@types/react` hors-ligne) : à faire en pièce 0.
- Les boutons « Remarque depuis le lecteur » et l'affichage des liens dans les vues sont prévus aux pièces 3-4 ; la page d'un lien (`page`) n'est pas encore alimentée.
- Rendu mobile réel, Safari/Firefox : non testés.
