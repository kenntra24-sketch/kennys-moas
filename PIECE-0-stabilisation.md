# PIÈCE 0 — Stabilisation technique
> À coller tel quel dans une IA qui a accès au dépôt **avec Node/pnpm, réseau et navigateur** (Chromium/Playwright). Joindre le dernier ZIP livré.

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

## TA PIÈCE : Stabilisation technique

Objectif : rendre le projet **reconstruisible, lançable et vérifiable**. Rien de visuel ici.
1. Dans `source/` : `pnpm install --frozen-lockfile` puis `pnpm build`. Corrige toute erreur TypeScript/Vite sans désactiver de règle. Regarde `vite.config.ts`, `tools/build-standalone.mjs`, `docs/` et `README.md` pour savoir **comment le build est copié à la racine** ; ne devine pas, documente la procédure exacte en 4 commandes.
2. **Le bundle racine actuel (`app.js`/`app.css`) est périmé** : les libellés « Fiche de révision », « Fiche résumé », « Fiche méthode », « Note de classe », « Autre travail », `skipType`, « Ctrl K » y sont absents (vérifié : 0 occurrence). Régénère-le et remplace-le en conservant les fichiers listés en Livraison.
3. `tools/verify-sync.mjs` avec ces marqueurs minimum + `kennys-moas-react-v` dans `sw.js`. Lance-le, joins la sortie.
4. Affiche dans Réglages « Version 1.5.0-P0 · build <date> » (constante injectée au build).
5. **Service worker** : `sw.js` fait `skipWaiting()` + `clients.claim()` avec un cache stale-while-revalidate sur `app.js` : après une mise à jour l'utilisateur peut avoir un **ancien `app.js` avec le nouveau SW**. Teste (profil Chromium vierge, hors-ligne, mise à jour v→v+1) et corrige minimalement (ex. réseau d'abord pour `index.html`/`app.js`/`app.css`, ou versionner les assets). Vérifie : première visite sans 404 dans `CORE`, hors-ligne OK, mises à jour sans mélange, **données IndexedDB conservées**, appels Google jamais interceptés.
6. `serve.py`/`LANCER.bat` : j'ai testé `serve.py` sous Linux (`.mjs`→`text/javascript`, `.webmanifest`→`application/manifest+json`, OK). Reste à vérifier/corriger : ouverture du navigateur, **`py` présent mais sans Python installé** (passer à `python`), ni l'un ni l'autre (message clair, fenêtre qui reste ouverte), port 8765 occupé, chemin avec espaces/accents. Aucune dépendance côté utilisateur final.
7. Corrige la contradiction : `config.local.example.js` dit que `config.local.js` est ignoré par Git alors que `.gitignore` ne l'ignore pas. **Décision (mon choix, déjà assumé)** : `config.local.js` reste dans le dépôt ; corrige le commentaire du fichier exemple **sans toucher à `config.local.js`**. Dans le README, explique comment **restreindre la clé API et l'ID client à l'adresse GitHub Pages** dans la console Google Cloud (référents HTTP / origines autorisées), car une clé publiée est lisible par tous.
8. Smoke test scripté Playwright dans `tools/smoke/` sur le build racine servi par `serve.py` : démarrage, import d'un PDF, création d'un devoir, rechargement sans perte. Critère : 0 erreur console non expliquée.


## Livraison (identique pour chaque pièce)
Produis **`KENNYS-MOAS-v1.5.0-P0.zip`** qui contient TOUT ce qu'il faut pour publier sur GitHub Pages, sans `node_modules` ni `dist` :
- `source/` complet + **bundle racine recompilé** (`index.html`, `app.js`, `app.css`, assets générés) : `index.html` doit référencer des fichiers qui existent réellement ;
- conservés tels quels : `config.local.js` (mes identifiants Google, inclus volontairement), `config.local.example.js`, `manifest.webmanifest`, icônes, `splash/`, `pdf.*.mjs`, `serve.py`, `LANCER.bat`, `.nojekyll`, `legacy/`, `reference/`, `docs/` (les icônes/logo ne changent que si ta pièce les refait) ;
- `sw.js` avec `CACHE` incrémenté (et racine = `source/public/sw.js`) ;
- `README.md` avec « Reconstruire l'application » (commandes exactes) et **« Publier sur GitHub »** pas à pas (commandes `git`, activer Pages sur la branche, adresse finale) ;
- `docs/REPRISE.md` : **journal de reprise** que tu mets à jour à chaque pièce (ce qui est fait, décisions, modèle de données actuel, fichiers clés, ce qui reste). C'est ce qui permet à une nouvelle conversation de reprendre sans rien perdre ;
- `CHANGELOG.md` mis à jour, `package.json` en `1.5.0-p0` ;
- **`RAPPORT-P0.md`** court : fait / pas fait, commandes lancées avec sortie réelle, captures d'écran si possible, décisions, limites, fichiers modifiés.
Ajoute `tools/verify-sync.mjs` (s'il n'existe pas) qui échoue si un libellé clé de la source est absent du bundle racine, et lance-le.
Termine ta réponse par : « Prochaine pièce à coller : … ».
