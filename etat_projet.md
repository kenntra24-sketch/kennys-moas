# etat_projet.md — KENNY'S MOAS (à lire par la prochaine IA)

**Version** 1.5.0-p5f · un seul ZIP à rendre à chaque étape · plan : `docs/pack/pieces/` (Pièces 0 à 8) · prompt maître : `docs/pack/01_Super_Prompt_Maitre.md` · journal détaillé : `docs/REPRISE.md`.

## Fait
- Pièce 1 : Remarques (ex-erreurs, genres), liens entre objets (`relations.ts`), catégories Cours/Fiche/Exercice/Notes, remplacement de fichier à id conservé, suppression avec confirmation des liens, migration idempotente, tests (14/14 + e2e Chromium), bundle racine recompilé.

- Pièce 2a : nouveau logo + icônes/splash (`tools/make-icons.mjs`), symbole Drive nuage+flèche, états honnêtes, faux textes retirés (voir `RAPPORT-P2A.md`).

## Reste à faire
1. **Pièce 0** : FAIT au LOT 1 (chaîne unique esbuild, versions figées, SW auto-versionné, version dans Réglages, workflow push→publier) ; LOT 1.1 : gestionnaire unique pnpm (`packageManager` figé), verrou unique `source/pnpm-lock.yaml` **à générer** (workflow « Générer le verrou pnpm ») ; reste : typecheck des vues.
2. Pièce 2b (audit boutons, design system, apparence/polices) → 2c (matières : couleur/icône, jeu d'icônes) → 3 Bibliothèque par matière/catégorie → 4 lecteurs + remarque depuis le lecteur → 5 emploi du temps + .ics → 6 notes/objectifs → 7 guide/FAQ → 8 finition + GitHub.
3. Idées du prompt maître non commencées : dashboard visuel, streaks/XP, SRS étendu, thèmes/dark mode (déjà partiel), Pomodoro sur les fiches.

**Prochaine pièce à coller : PIÈCE 2 (`docs/pack/pieces/PIECE-2-identite.md`) en précisant « 2a est faite, fais 2b » ; la Pièce 0 reste à faire dans une IA avec pnpm + réseau.**


**Nouveau (30/09/2026)** : lire `docs/retours/RETOURS-UTILISATEUR-2026-09-30.md` avant toute pièce ≥ 2b (emploi du temps réel + retours). Aucun code modifié dans cette étape.


**Pièce 5 (30/09/2026)** : 5a (modèle TA1) et 5b (plusieurs emplois du temps, horaires, export .ics, rappels, cours du jour) faites — voir `RAPPORT-P5A.md`, `RAPPORT-P5B.md`. **Prochaine pièce : 5c** (A/B, jours en plus, copier-coller, réglages calendrier, Google Agenda), puis 2b/2c restants, 3, 4, 6, 7, 8.

**Session du 01/10/2026 (v1.5.0-p5c-lecteur)** : lecteur PDF en **défilement continu** (comme un webtoon ; bouton ↕ pour revenir à « page par page », zoom et reprise conservés), **remarques directement dans le lecteur** (sélectionner un passage → « Remarque sur la sélection », ou bouton remarque ; elles apparaissent dans Remarques avec la page, un clic ramène à la page), et **entraînement à parler en public** dans Révisions (`src/views/SpeechTrainer.tsx`, banque dans `src/lib/speechTopics.ts`). Tests 33/33 + parcours Chromium OK. À faire : test sur mobile réel, `pnpm build` officiel (Pièce 0).

**Drive (01/10/2026)** : scope passé de `drive.appdata` à `drive.file` ; dossier visible « KENNY'S MOAS » (`lib/drive.ts`). Une ancienne sauvegarde éventuelle dans l'espace caché n'est pas relue.

**02/10/2026** : sujets de prise de parole réécrits (127 sujets curés) + activités Impromptu / Deux camps / Explique ton cours ; mises à jour SW automatiques (réseau d'abord) ; correctifs mobile. Reste : voir « Reste à faire » ci-dessus (Pièce 0 build officiel ; 5c, 2b/2c, 3, 6, 7, 8) + README Google Cloud + RAPPORT-FINAL « Architecture finale et maintenance ».

**LOT 1 (02/10/2026)** : chaîne de build unique (esbuild), Vite/Figma archivé (`source/figma-only/`), `verify-sync` réécrit sur des invariants, workflow automatique, version produit unique 1.5.0-p5f. Voir CHANGELOG.
