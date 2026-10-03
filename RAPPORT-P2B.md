# RAPPORT-P2B — Pièce 2, sous-pièce b (vérification et zones tactiles)

## Fait
- **Build réellement lancé** (l'environnement précédent n'avait pas esbuild ; celui-ci a esbuild, React et Chromium) : `node tools/build-standalone.mjs` → `OK → dist/ (22 entrées)`, `app.js` 346 ko. Bundle racine (`app.js`, `app.css`) régénéré : il contient maintenant les icônes de navigation bicolores, la couleur par section, la « Taille du texte », les textes honnêtes.
- **Vu à l'écran (Chromium, 1280 px et 390 px)** : tableau de bord OK — logo « K », icônes de navigation colorées par section, pastille « Sauvegarde Drive · Non connecté », barre du bas sur téléphone. 0 erreur de console sur les 10 vues.
- **Audit des boutons** (script Playwright, 10 vues) : 0 bouton sans nom accessible. Sur écran tactile, des boutons faisaient 33–38 px → règle `@media (pointer: coarse)` ajoutée à la fin d'`index.css` (boutons, champs, navigation ≥ 44 px ; l'ordinateur ne change pas). Contrôle après : il ne reste que « Ajouter » (38×44, largeur) et les cases du calendrier (42×56, grille de 7 jours).
- `sw.js` : cache `kennys-moas-react-v16` (racine = `source/public/sw.js`). `package.json` : `1.5.0-p2b`.

## Commandes lancées (sortie réelle)
- `node tools/verify-sync.mjs` → `✓ 14 libellés présents, 5 libellés retirés absents, sw.js et index.html cohérents`
- `tsx tests/p1.test.ts` → 14 tests, 14 réussis, 0 échec

## Pas fait / limites
- **Polices non embarquées** : le registre npm et les sites de polices sont bloqués ici (403) ; les polices restent chargées depuis Google Fonts (hors-ligne = police système). À faire avec réseau.
- `pnpm build` (Vite/Tailwind) et `tsc` toujours non lancés (registre bloqué). Build autonome uniquement.
- Flux Google (connexion/sauvegarde) non testé. Safari/iOS non testé (Chromium seulement).
- Audit des boutons = vérification automatique (nom, taille) ; pas de revue « liste avant → après » bouton par bouton.
- Restent : 2c (matières personnalisables), puis pièces 3 à 8. La pièce 5 doit partir de `docs/retours/RETOURS-UTILISATEUR-2026-09-30.md` (emploi du temps réel : créneaux 07h15–08h10…, classe TA1).

## Fichiers modifiés
`src/index.css` (règle tactile), `public/sw.js`, `sw.js`, `package.json`, `app.js`, `app.css`, `docs/REPRISE.md`, `RAPPORT-P2B.md`.

## Ajout 2c (partiel)
Icône par matière + suggestions de matières (voir docs/REPRISE.md). Test Playwright réel : ajout « Espagnol » et « EDHC », icône « Musique » choisie, rechargement → conservés, 0 erreur console. verify-sync OK, 14/14 tests. Non fait : réaffectation à la suppression d'une matière ; icônes dans Devoirs/Emploi du temps/Bibliothèque ; Safari non testé.
