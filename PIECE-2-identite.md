# PIÈCE 2 — Identité visuelle, icônes, personnalisation
> À coller tel quel dans une IA qui a accès au dépôt **avec Node/pnpm, réseau et navigateur** (Chromium/Playwright). Joindre le dernier ZIP livré ; joindre aussi, si tu en as une, une image du logo que tu préfères.

## Rôle
Tu es ingénieur front-end senior + designer produit. Tu travailles sur **KENNY'S MOAS** (PWA scolaire : React 19, Vite 8, Tailwind 4, TypeScript, IndexedDB, sauvegarde Google Drive). Lis d'abord `docs/REPRISE.md` s'il existe, puis `source/AGENTS.md`/`CLAUDE.md`.

## Vision finale (pour information — tu ne fais QUE ta pièce, voir règle 1)
KENNY'S MOAS devient une application scolaire complète, belle et personnalisable :
- tout se **classe par matière** (facile à voir) ET par **catégorie** : Cours · Fiche · Exercice · Notes · Remarques ;
- dans chaque catégorie on peut **importer** un fichier ou **choisir un fichier déjà importé** ailleurs ; une fois placé, il est **interconnecté** avec les autres catégories ;
- **Remarques** (remplace « Mes erreurs ») : en lisant un cours de français, je fais une remarque ; elle apparaît dans l'onglet Remarques avec le cours d'origine, et inversement ;
- objectifs plus nombreux, taux personnalisables, davantage de données calculées ;
- **lecteurs de fichiers** refaits (très important) ;
- interface, logo et icônes refaits (aujourd'hui trop simples et moches), tous les boutons réellement interactifs, un symbole Drive qui a du sens ;
- **emploi du temps** fidèle à mon modèle (fichier joint), plusieurs modèles personnalisables ; calendrier très personnalisable ; export qui crée directement les créneaux dans mon agenda ;
- couleurs des matières, police et apparence personnalisables ;
- **Guide / Aide / FAQ** détaillé, lisible par n'importe qui ; **méthodes de révision** cliquables avec explication complète ;
- version finale, propre, déployable sur GitHub.

## Règles (non négociables)
1. **Morceau par morceau.** Ne traite QUE la pièce décrite ci-dessous. Je suis sur un forfait gratuit : ta capacité de contexte est limitée. Si ta pièce est trop grosse, **découpe-la toi-même** en sous-pièces (ex. « 3a », « 3b »), livre un ZIP fonctionnel à la fin de chaque sous-pièce et dis-moi exactement quoi coller ensuite. **Interdit** : livrer un état à moitié cassé, ou sauter une partie sans me le dire.
2. **Aucune perte de données.** J'ai déjà des données (IndexedDB `files` + état : notes, devoirs, erreurs, événements, sessions, objectifs). Toute évolution de forme = **migration idempotente**, version de schéma incrémentée, valeurs par défaut pour l'ancien, **test avec d'anciennes données**. En cas de doute, choisis l'option la plus sûre pour les données et note-le dans le rapport.
3. **Vérité d'abord.** N'écris « testé » que si tu as réellement lancé la commande et vu la sortie. Colle les sorties réelles dans le rapport. Si tu n'as pas Node/pnpm, réseau ou navigateur, **dis-le clairement, ne fabrique pas de preuve**, et ne livre que ce qui est vérifiable, marqué « non compilé » sinon.
4. **Carte blanche.** J'autorise tout ce qui sert le projet : utiliser les identifiants Google de `config.local.js` (c'est mon usage personnel, je l'inclus volontairement dans le dépôt), utiliser les fichiers et données personnelles que je joins (emploi du temps, etc.), installer des dépendances de build, chercher sur le web, prendre toute décision de conception. Ne t'excuse pas, n'attends pas de validation : décide, fais, documente. **Seules limites** : (a) ne perds jamais mes données ; (b) n'écris aucun autre secret que ceux déjà présents dans `config.local.js` ; (c) n'invente aucune fonction que l'app ne fait pas réellement (pas de faux texte « synchronisé », « IA », « OCR »…).
5. **Un seul point d'entrée** : `index.html` à la racine ; code source dans `source/`. Ne duplique pas de pages. Style existant : TypeScript strict, composants fonctionnels, pub/sub `store`/`toast`/`ask`/`choose`, styles dans `index.css`. Commits en français, préfixés par le numéro de pièce.
6. **Langage de l'interface** : français simple, pour un élève. Pas de jargon. Chaque texte doit décrire ce que fait vraiment le bouton.
7. **Accessibilité de base** sur tout ce que tu touches : vrais `<button>`/`<a>`, `aria-label` sur les boutons-icônes, focus visible, `Échap` ferme les fenêtres, zones tactiles ≥ 44 px.

## TA PIÈCE : Identité visuelle, icônes, personnalisation

Objectif : l'app doit être **belle et cohérente**. Aujourd'hui : icônes trop simplistes et moches (surtout dans l'emploi du temps), logo moche, symbole Drive incompréhensible, boutons non interactifs.
1. **Système d'icônes** unique : remplace `Icons.tsx` par un jeu cohérent (même épaisseur de trait, même grille). Tu peux ajouter `lucide-react` (dépendance de build) ou dessiner un jeu SVG maison ; choisis, applique **partout** (navigation, boutons, badges de catégorie, matières, emploi du temps, tableau de bord). Chaque icône-bouton a un `aria-label` et une info-bulle.
2. **Logo** refait : sobre, moderne, lisible en 16 px et en 512 px, cohérent avec le nom « KENNY'S MOAS » ; régénère `icon*.png`, `icon.ico`, icônes maskable, `splash/*` (mêmes tailles qu'aujourd'hui), favicon et `manifest.webmanifest` si nécessaire. Trouve/compose l'outil de génération (script Node/Python) et **range-le dans `tools/`**.
3. **Symbole Drive** : remplace-le par quelque chose qui a un sens immédiat (nuage + flèche, avec le libellé « Sauvegarde Drive »). États honnêtes : « Non connecté », « Connecté », « Dernière sauvegarde : HH:MM », « Erreur ». La sauvegarde Drive sauvegarde les **données**, pas les fichiers de la bibliothèque : ne jamais écrire « synchronisé ».
4. **Audit des boutons** : parcours toute l'interface (tableau de bord, cartes, badges, puces, en-têtes) et liste chaque élément qui ressemble à un bouton mais ne fait rien. Pour chacun : le rendre interactif (il mène quelque part / ouvre quelque chose) ou le transformer visuellement en simple étiquette. Livre la liste avant → après dans le rapport.
5. **Design system** dans `index.css` : variables (couleurs, rayons, ombres, espacements, tailles de texte), états survol/actif/focus/désactivé homogènes, densité (confortable/compacte). Thème clair/sombre soigné. Pas de refonte de structure : seulement l'habillage et la cohérence.
6. **Réglages d'apparence** (persistants) : thème, couleur d'accent (palette + sélecteur libre), **police** (au moins 5 choix réellement chargés, dont une police système ; vérifie `document.fonts.check` et retire ce qui ne charge pas ; repli propre hors-ligne — polices embarquées localement de préférence), taille du texte, densité, arrondi des coins.
7. **Matières entièrement personnalisables** : ajouter/renommer/supprimer/réordonner ; **couleur libre** (sélecteur + palette) et **icône** par matière ; la couleur s'applique partout (cartes, badges, emploi du temps, graphiques). Renommer/supprimer une matière ne doit casser aucun fichier/devoir/remarque (proposer la réaffectation).
8. Vérifie contraste (texte lisible sur chaque couleur de matière, clair et sombre) et rends des captures avant/après dans le rapport.


## Livraison (identique pour chaque pièce)
Produis **`KENNYS-MOAS-v1.5.0-P2.zip`** qui contient TOUT ce qu'il faut pour publier sur GitHub Pages, sans `node_modules` ni `dist` :
- `source/` complet + **bundle racine recompilé** (`index.html`, `app.js`, `app.css`, assets générés) : `index.html` doit référencer des fichiers qui existent réellement ;
- conservés tels quels : `config.local.js` (mes identifiants Google, inclus volontairement), `config.local.example.js`, `manifest.webmanifest`, icônes, `splash/`, `pdf.*.mjs`, `serve.py`, `LANCER.bat`, `.nojekyll`, `legacy/`, `reference/`, `docs/` (les icônes/logo ne changent que si ta pièce les refait) ;
- `sw.js` avec `CACHE` incrémenté (et racine = `source/public/sw.js`) ;
- `README.md` avec « Reconstruire l'application » (commandes exactes) et **« Publier sur GitHub »** pas à pas (commandes `git`, activer Pages sur la branche, adresse finale) ;
- `docs/REPRISE.md` : **journal de reprise** que tu mets à jour à chaque pièce (ce qui est fait, décisions, modèle de données actuel, fichiers clés, ce qui reste). C'est ce qui permet à une nouvelle conversation de reprendre sans rien perdre ;
- `CHANGELOG.md` mis à jour, `package.json` en `1.5.0-p2` ;
- **`RAPPORT-P2.md`** court : fait / pas fait, commandes lancées avec sortie réelle, captures d'écran si possible, décisions, limites, fichiers modifiés.
Ajoute `tools/verify-sync.mjs` (s'il n'existe pas) qui échoue si un libellé clé de la source est absent du bundle racine, et lance-le.
Termine ta réponse par : « Prochaine pièce à coller : … ».
