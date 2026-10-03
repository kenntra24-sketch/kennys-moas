# RAPPORT-P2C — Pièce 2, sous-pièce c (matières personnalisables, version limitée)

## Fait
- **Couleur par matière** (Réglages → Matières & coefficients) : 14 pastilles + sélecteur de couleur libre + bouton « Couleur automatique ». Stockée dans `Subj.color` (champ déjà prévu au modèle). `subjColor()` (`lib/calc.ts`) lit cette couleur, sinon garde la couleur automatique d'avant → appliquée partout (Bibliothèque, Devoirs, Emploi du temps, Notes, Remarques, Révisions, tableau de bord) sans autre changement.
- **Réordonner** : boutons Monter / Descendre (ordre conservé au rechargement).
- Renommer conserve la couleur (le renommage copie déjà les champs).

## Vérifié (Chromium, sortie réelle)
Choisir rose pour Français → `stocké: {"name":"Français","coef":5,"color":"#be185d",...}` ; Monter Anglais → `['Anglais','Français','Allemand']` ; après rechargement : ordre et couleur conservés (`pressed: true`) ; « Couleur automatique » → `pressed: false` ; 0 erreur console. `verify-sync` ✓ ; `tests/p1.test.ts` 14/14.

## Pas fait
- **Icône par matière** (champ `icon` prévu, non utilisé) ; **réaffectation à la suppression d'une matière** ; contraste clair/sombre des couleurs non contrôlé ; glisser-déposer (remplacé par ↑/↓) ; rendu téléphone de cette carte non vu ; `pnpm build`/`tsc` non lancés ; polices toujours non embarquées (réseau bloqué).
- Les couleurs automatiques de deux matières peuvent se ressembler (ex. Géographie et le rose choisi) : à choisir à la main.

## Fichiers modifiés
`src/lib/calc.ts`, `src/views/Settings.tsx`, `public/sw.js` + `sw.js` (v17), `package.json` (1.5.0-p2c), `app.js`, `app.css`, docs.
