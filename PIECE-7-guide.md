# PIÈCE 7 — Guide / Aide / FAQ et méthodes de révision
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

## TA PIÈCE : Guide / Aide / FAQ et méthodes de révision

Objectif : un guide que **n'importe qui, même le premier venu**, comprend, et un catalogue de méthodes de révision cliquables.
1. **Guide / Aide / FAQ** (une entrée du menu, avec recherche) en 3 parties : (a) **Premiers pas** : parcours illustré en étapes courtes (choisir sa classe, créer ses matières, importer un premier cours, faire une remarque, créer un devoir, remplir l'emploi du temps, lancer une révision, sauvegarder) ; (b) **Comment faire pour…** : 40 questions pratiques minimum, formulées comme un élève les poserait (« Comment ajouter un fichier ? », « Comment retrouver une remarque ? », « Comment changer la couleur d'une matière ? », « Pourquoi mon fichier ne s'ouvre pas ? », « Où sont mes données ? », « Comment récupérer mes données sur un autre appareil ? », « Que fait la sauvegarde Drive ? », « Comment installer l'app sur mon téléphone ? », « Que faire si j'ai supprimé un fichier par erreur ? »…) ; (c) **Dépannage** (hors-ligne, stockage plein, Drive non connecté, mise à jour). Chaque réponse est **exacte par rapport à ce que l'app fait vraiment** : relis le code avant d'écrire. Quelques boutons « Ouvrir cette page » dans les réponses.
2. **Méthodes de révision** (vue dédiée, cartes cliquables) : **fais une vraie recherche** (web ; sources sérieuses : psychologie cognitive, sciences de l'éducation) et documente les sources dans `docs/`. Minimum 15 méthodes, par exemple : rappel actif, répétition espacée, Leitner, Pomodoro, technique de Feynman, méthode Cornell, SQ3R, cartes mentales, fiches de révision, palais de mémoire (loci), mnémotechniques, entrelacement, pratique par annales/examen blanc, blurting (écrire tout ce qu'on sait), auto-questionnement, enseigner à quelqu'un, résumé en une page, méthode des 3 couleurs, planification inversée. Au clic, une **page détaillée** : en une phrase, à quoi ça sert, pour quelles matières, durée conseillée, **étapes pas à pas**, exemple concret (un par matière courante), erreurs fréquentes, ce que dit la recherche (sans exagérer), et **un bouton « Essayer maintenant »** quand l'app peut l'appuyer réellement (Pomodoro → minuteur ; Leitner → séance de remarques ; rappel actif/blurting → création d'une séance guidée liée à un cours). Pas de bouton s'il n'y a pas de fonction derrière.
3. Recherche dans le guide et dans les méthodes intégrée à la recherche globale (Ctrl/⌘ K).
4. Ton : simple, chaleureux, phrases courtes, aucun jargon non expliqué. Relecture orthographique complète en français.
5. Test : chaque lien interne du guide ouvre la bonne vue ; aucune promesse de fonction inexistante ; captures des pages principales.


## Livraison (identique pour chaque pièce)
Produis **`KENNYS-MOAS-v1.5.0-P7.zip`** qui contient TOUT ce qu'il faut pour publier sur GitHub Pages, sans `node_modules` ni `dist` :
- `source/` complet + **bundle racine recompilé** (`index.html`, `app.js`, `app.css`, assets générés) : `index.html` doit référencer des fichiers qui existent réellement ;
- conservés tels quels : `config.local.js` (mes identifiants Google, inclus volontairement), `config.local.example.js`, `manifest.webmanifest`, icônes, `splash/`, `pdf.*.mjs`, `serve.py`, `LANCER.bat`, `.nojekyll`, `legacy/`, `reference/`, `docs/` (les icônes/logo ne changent que si ta pièce les refait) ;
- `sw.js` avec `CACHE` incrémenté (et racine = `source/public/sw.js`) ;
- `README.md` avec « Reconstruire l'application » (commandes exactes) et **« Publier sur GitHub »** pas à pas (commandes `git`, activer Pages sur la branche, adresse finale) ;
- `docs/REPRISE.md` : **journal de reprise** que tu mets à jour à chaque pièce (ce qui est fait, décisions, modèle de données actuel, fichiers clés, ce qui reste). C'est ce qui permet à une nouvelle conversation de reprendre sans rien perdre ;
- `CHANGELOG.md` mis à jour, `package.json` en `1.5.0-p7` ;
- **`RAPPORT-P7.md`** court : fait / pas fait, commandes lancées avec sortie réelle, captures d'écran si possible, décisions, limites, fichiers modifiés.
Ajoute `tools/verify-sync.mjs` (s'il n'existe pas) qui échoue si un libellé clé de la source est absent du bundle racine, et lance-le.
Termine ta réponse par : « Prochaine pièce à coller : … ».
