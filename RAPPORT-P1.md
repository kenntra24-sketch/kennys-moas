# RAPPORT — Pièce 1 (modèle de données) · v1.5.0-p1

## Fait
- Remarques (ex-erreurs) avec genre ; `relations.ts` ; migration idempotente ; catégories ; remplacement de fichier à id conservé ; suppression avec liens ; intégrité au démarrage ; tests ; bundle racine recompilé ; `verify-sync.mjs`.

## Pas fait / limites (honnêtement)
- **`pnpm build` (Vite + Tailwind) non lancé** : pas de `pnpm` ni de réseau ici. Le bundle racine vient du **build autonome esbuild** (`tools/build-standalone.mjs`), identique au procédé déjà utilisé par le dépôt.
- **Les vues TSX ne sont pas vérifiées par `tsc`** (`@types/react` indisponible). `tsc --strict` a été passé sur les modules `lib/` modifiés (relations, migrate, files, deletion, backup) : 0 erreur hors l'absence de types React.
- Les jeux de données de test sont **reconstitués** (forme v1.4.1), pas un export réel de l'utilisateur. Le test unitaire utilise un IndexedDB **simulé** ; l'e2e ci-dessous utilise le vrai IndexedDB de Chromium.
- Pas de captures d'écran fournies. Pas de test mobile / Safari / Firefox. Génération d'un ZIP GitHub-prêt : non poussé sur GitHub (pas de réseau).

## Commandes lancées (sorties réelles)
- `tsx --test tests/p1.test.ts` → `# tests 14 · # pass 14 · # fail 0` (liens, délien, idempotence, suppression + undo, réaffectation, orphelins, migration v1.4.1, catégories, migration des fichiers, `replaceFile` qui conserve l'id).
- `node tools/build-standalone.mjs` → `OK → dist/ (21 entrées)`.
- `node tools/verify-sync.mjs` → `✓ 10 libellés présents, 3 libellés retirés absents, sw.js et index.html cohérents` (et vérifié qu'il **échoue** quand un libellé est retiré du bundle).
- E2E Playwright/Chromium sur le build (http local), 14 contrôles tous OK : migration au démarrage (genre, boîte Leitner 3, `linkId` conservés), vue Remarques, import « Devoir » → `category=exercice` + devoir créé et relié, quasi-doublon → « Remplacer l'ancien » → **1 seul fichier, même id, nouveau contenu, nom d'origine**, message « Ancien fichier remplacé — associations conservées », suppression → « 1 devoir utilise ce fichier » + option devoir créé à l'import, aucune référence orpheline, « Annuler » restaure fichier et lien, 0 erreur JS/console.

## Décisions
Voir `docs/REPRISE.md` (clé `errors` conservée, catégories, remplacement, suppression, intégrité).

## Fichiers modifiés
`src/lib/{model,relations(new),migrate(new),deletion(new),files,db,backup}.ts` · `src/views/{Errors,Library,Homework,Grades,Schedule}.tsx` · `src/components/{Sidebar,Topbar,SearchOverlay}.tsx` · `src/{App,main}.tsx` · `tests/p1.test.ts` · `tools/verify-sync.mjs` · `sw.js` (+ `source/public/sw.js`) · `app.js`, `app.css` · `README.md`, `CHANGELOG.md`, `docs/REPRISE.md`, `docs/pack/`, `package.json` (1.5.0-p1).
