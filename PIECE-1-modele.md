# PIÈCE 1 — Modèle de données : matières, catégories, liens
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

## TA PIÈCE : Modèle de données : matières, catégories, liens

Objectif : poser **la fondation** sur laquelle tout le reste s'appuie. Peu de visuel ici.
1. **Catégories de document** (champ unique, remplace/complète `libraryType`) : `cours`, `fiche`, `exercice`, `notes`. Libellés affichés : « Cours », « Fiche » (jamais « Fiche informative »/« Fiche de révision »), « Exercice », « Notes ». Migration : mappe les anciennes valeurs (`Fiche résumé`, `Fiche méthode`, `Fiche de révision`, `Note de classe`, `Autre travail`…) vers ces 4 catégories **sans perdre l'info d'origine** (garde l'ancien champ). « Autre travail » → `exercice` ou catégorie « Autre » si tu juges qu'elle est nécessaire : décide et documente.
2. **Remarque** = nouvel objet remplaçant « Mes erreurs » : `{ id, texte, genre ('erreur' | 'à retenir' | 'question' | 'idée'), matière, source: Link|null, créée, … }`. **Toutes les erreurs existantes deviennent des remarques de genre `erreur`, avec leur boîte Leitner, leur prochaine révision et leurs liens intacts.** Rien ne doit être perdu ; migration idempotente + test.
3. **`source/src/lib/relations.ts`** (module unique, aucune logique de lien dans les vues) : type `Link = { type: 'file'|'homework'|'remark'|'session'|'result'|'event'|'note'; id: string; page?: number }` (le champ `page` est optionnel : il servira à « remarque faite à la page 17 » — n'affiche jamais de page tant qu'elle n'est pas stockée). API : `linkObjects` (bidirectionnel, idempotent), `unlinkObjects`, `getRelated(ref)` (groupé par type), `removeAllReferencesTo(ref)`, `repointReferences(old,new)`, `checkIntegrity()`. Les anciens champs `fileId`, `linkType`/`linkId` restent lus ; migration idempotente vers `links: Link[]` sans supprimer les anciens champs. Toute écriture passe par `store` (`update`/`notifyStore`).
4. **Remplacement de fichier** (« Remplacer l'ancien » dans `files.ts`) : ne plus supprimer/recréer. Écraser blob, taille, type MIME, date sur l'enregistrement existant en **gardant l'id**, la matière, la catégorie, les favoris, les tags et toutes les associations. Progression de lecture et marque-pages : remise à zéro **avec message clair** (contenu changé) — documente. Message : « Ancien fichier remplacé — associations conservées ».
5. **Suppression propre** d'un fichier/devoir/remarque/note/événement : confirmation qui dit **ce qui est lié** (« 2 devoirs et 3 remarques utilisent ce fichier »), nettoyage via `removeAllReferencesTo`, devoir créé à l'import : conserver (sans fichier) par défaut ou supprimer avec. « Annuler » là où il existe déjà. `checkIntegrity()` au démarrage en silence : orphelins réparés + journal console.
6. Matières : un objet matière `{ id, nom, couleur, icône, … }` (la personnalisation visuelle complète viendra en pièce 2 ; prévois seulement les champs et la migration depuis l'existant).
7. Tests automatisés (Vitest ou script Node) : lien, délien, idempotence, suppression, réaffectation, orphelins, migration d'anciennes données (jeu de données v1.4.1 réel ou reconstitué), **remplacement de fichier qui conserve `fileId`**.


## Livraison (identique pour chaque pièce)
Produis **`KENNYS-MOAS-v1.5.0-P1.zip`** qui contient TOUT ce qu'il faut pour publier sur GitHub Pages, sans `node_modules` ni `dist` :
- `source/` complet + **bundle racine recompilé** (`index.html`, `app.js`, `app.css`, assets générés) : `index.html` doit référencer des fichiers qui existent réellement ;
- conservés tels quels : `config.local.js` (mes identifiants Google, inclus volontairement), `config.local.example.js`, `manifest.webmanifest`, icônes, `splash/`, `pdf.*.mjs`, `serve.py`, `LANCER.bat`, `.nojekyll`, `legacy/`, `reference/`, `docs/` (les icônes/logo ne changent que si ta pièce les refait) ;
- `sw.js` avec `CACHE` incrémenté (et racine = `source/public/sw.js`) ;
- `README.md` avec « Reconstruire l'application » (commandes exactes) et **« Publier sur GitHub »** pas à pas (commandes `git`, activer Pages sur la branche, adresse finale) ;
- `docs/REPRISE.md` : **journal de reprise** que tu mets à jour à chaque pièce (ce qui est fait, décisions, modèle de données actuel, fichiers clés, ce qui reste). C'est ce qui permet à une nouvelle conversation de reprendre sans rien perdre ;
- `CHANGELOG.md` mis à jour, `package.json` en `1.5.0-p1` ;
- **`RAPPORT-P1.md`** court : fait / pas fait, commandes lancées avec sortie réelle, captures d'écran si possible, décisions, limites, fichiers modifiés.
Ajoute `tools/verify-sync.mjs` (s'il n'existe pas) qui échoue si un libellé clé de la source est absent du bundle racine, et lance-le.
Termine ta réponse par : « Prochaine pièce à coller : … ».
