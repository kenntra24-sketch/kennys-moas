# PIÈCE 3 — Bibliothèque par matière + catégories + Remarques
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

## TA PIÈCE : Bibliothèque par matière + catégories + Remarques

Objectif : le cœur fonctionnel de ma demande — **classement par matière, catégories, interconnexion, Remarques**.
1. **Navigation** : une entrée claire « Bibliothèque » avec deux façons de voir, changeables en un clic : **Par matière** (cartes de matières colorées → dedans, onglets Cours · Fiches · Exercices · Notes · Remarques) et **Par catégorie** (Cours, Fiches, Exercices, Notes, Remarques → dedans, filtre par matière). Cartes de matière : « N documents · dernier ouvert … » (aucune fausse barre de progression). Depuis `Ajouter → Fichier` dans une vue filtrée par matière, transmets cette matière.
2. **Dans chaque catégorie** : bouton **« Ajouter »** qui propose (a) **Importer un fichier** (demande la matière et la catégorie ; doublon exact = message clair et on sélectionne l'existant) ou (b) **Choisir un fichier déjà importé** (recherche + filtre, y compris ceux d'une autre catégorie). Un même fichier peut apparaître dans plusieurs catégories via un lien (sans copie du blob) ; règle claire : la catégorie « propre » du fichier + les catégories où il est associé.
3. **Interconnexion** via `relations.ts` : sur chaque objet (fichier, devoir, exercice, note, remarque, événement, séance de révision), une section **« Associé à »** listant les liens avec icône par type ; un clic ouvre l'objet lié ; on peut retirer un lien ; champ « Éléments associés » (multi-sélection avec recherche) dans les formulaires. Ajouter un lien depuis A le fait apparaître sur B ; supprimer A le retire de B.
4. **Remarques** : l'onglet « Mes erreurs » est **renommé « Remarques »** partout (menu, titres, textes d'aide, recherche). Une remarque a un genre (erreur, à retenir, question, idée), une matière, du texte, et un lien optionnel vers un objet. Elle apparaît dans l'onglet Remarques **et** dans la section « Associé à » de l'objet d'origine. La révision espacée (Leitner) reste disponible pour les remarques de genre `erreur` (ne rien casser). Création d'une remarque possible depuis le lecteur (bouton « Faire une remarque » — la version « sélection de texte → remarque » viendra en pièce 4) et depuis l'onglet Remarques.
5. **Menu `⋯`** sur chaque carte/ligne de fichier (grille et liste) : Ouvrir · Reprendre · Favori · Modifier · Changer de matière/catégorie · Associer à… · Supprimer. Accessible (`aria-haspopup="menu"`, `aria-expanded`, `Échap`, flèches, focus rendu). Un clic sur `⋯` n'ouvre pas le fichier. Supprime l'astuce « passe en vue liste… ».
6. **État de lecture exact** : « 67 % lu · Page 18 · Dernière lecture : hier » + bouton **Reprendre** (ouvre à la bonne page) ou « Commencer ». Rien de faux : pas de pourcentage sans donnée fiable.
7. **Recherche globale (Ctrl/⌘ K)** : un résultat ouvre **l'objet exact** (mécanisme `navigateTo({view,id})` consommé au montage) ; résultats en `<button>`, navigation ↑ ↓ Entrée. Cherche aussi dans les remarques.
8. Écran de **premier lancement** (classe, matières, option samedi) affiché **uniquement** aux installations neuves sans aucune donnée — jamais à un utilisateur existant ; ignorable (« Plus tard »).
9. Tests automatisés de bout en bout (Playwright) pour : import par catégorie, sélection d'un fichier existant, remarque liée visible des deux côtés, suppression sans orphelin, remplacement de fichier.


## Livraison (identique pour chaque pièce)
Produis **`KENNYS-MOAS-v1.5.0-P3.zip`** qui contient TOUT ce qu'il faut pour publier sur GitHub Pages, sans `node_modules` ni `dist` :
- `source/` complet + **bundle racine recompilé** (`index.html`, `app.js`, `app.css`, assets générés) : `index.html` doit référencer des fichiers qui existent réellement ;
- conservés tels quels : `config.local.js` (mes identifiants Google, inclus volontairement), `config.local.example.js`, `manifest.webmanifest`, icônes, `splash/`, `pdf.*.mjs`, `serve.py`, `LANCER.bat`, `.nojekyll`, `legacy/`, `reference/`, `docs/` (les icônes/logo ne changent que si ta pièce les refait) ;
- `sw.js` avec `CACHE` incrémenté (et racine = `source/public/sw.js`) ;
- `README.md` avec « Reconstruire l'application » (commandes exactes) et **« Publier sur GitHub »** pas à pas (commandes `git`, activer Pages sur la branche, adresse finale) ;
- `docs/REPRISE.md` : **journal de reprise** que tu mets à jour à chaque pièce (ce qui est fait, décisions, modèle de données actuel, fichiers clés, ce qui reste). C'est ce qui permet à une nouvelle conversation de reprendre sans rien perdre ;
- `CHANGELOG.md` mis à jour, `package.json` en `1.5.0-p3` ;
- **`RAPPORT-P3.md`** court : fait / pas fait, commandes lancées avec sortie réelle, captures d'écran si possible, décisions, limites, fichiers modifiés.
Ajoute `tools/verify-sync.mjs` (s'il n'existe pas) qui échoue si un libellé clé de la source est absent du bundle racine, et lance-le.
Termine ta réponse par : « Prochaine pièce à coller : … ».
