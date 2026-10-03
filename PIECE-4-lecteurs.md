# PIÈCE 4 — Lecteurs de fichiers (priorité maximale)
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

## TA PIÈCE : Lecteurs de fichiers (priorité maximale)

Objectif : des lecteurs **excellents**. C'est la partie la plus importante pour moi. Audite d'abord `FileViewer.tsx` et `DropZone.tsx`, liste dans le rapport tout ce qui ne marche pas ou est pénible, puis corrige.
1. **PDF (PDF.js local, hors-ligne)** : défilement continu fluide (rendu paresseux des pages), zoom (boutons, molette + Ctrl, pincement tactile, raccourcis), ajuster à la largeur / à la page, rotation, plein écran, vignettes/plan du document, **aller à la page**, **recherche dans le document** avec surbrillance et résultats suivants/précédents, marque-pages nommables, thème lecture (clair, sépia, sombre/inversé), mémoire de page + zoom par fichier, gestion des gros fichiers (pas de blocage de l'interface, indicateur de chargement, erreur claire si le PDF est protégé/corrompu). Sélection et copie de texte fiables.
2. **Sélection de texte → Remarque** : quand je sélectionne du texte dans le cours, une petite barre propose « Faire une remarque », « Surligner » (stocké : page + texte + couleur, retrouvable) ; la remarque se crée **liée au fichier avec la page** (`Link.page`) et apparaît dans l'onglet Remarques avec « Cours de français, page 17 » — et **seulement** parce que la page est réellement stockée. Depuis la remarque, un clic rouvre le cours à cette page. Surlignages listés dans un panneau latéral.
3. **Images** (png, jpg, webp, gif, svg) : zoom, déplacement, rotation, plein écran. **Texte** (`.txt`, `.md`, `.csv`, `.json`) : lecture confortable, taille réglable, `.md` rendu. **Word `.docx`** : lecture (conversion locale, ex. `mammoth` embarqué au build, aucune requête réseau). **Autres formats** (pptx, xlsx, zip…) : ne prétends pas les lire ; affiche un état clair « Format non lisible ici » avec bouton **Télécharger / Ouvrir avec une autre application**. Ne promets aucun format que tu n'as pas testé.
4. **Ergonomie commune** : barre d'outils claire à icônes cohérentes (pièce 2), raccourcis clavier documentés, fermeture/retour propre à l'endroit d'où l'on vient, fonctionnement au doigt sur téléphone (barre qui ne déborde pas, zones ≥ 44 px), mode lecture sans distraction.
5. **Import de fichiers** : glisser-déposer, sélection multiple, barre de progression, message d'erreur explicite par fichier, limite/quota de stockage expliqué (avertis avant de saturer IndexedDB, propose `navigator.storage.persist()`).
6. Tests : PDF de plusieurs pages (générer un PDF de test), reprise de page, recherche, surlignage → remarque liée, docx, image, texte, fichier illisible, hors-ligne. Aucune erreur console non expliquée.


## Livraison (identique pour chaque pièce)
Produis **`KENNYS-MOAS-v1.5.0-P4.zip`** qui contient TOUT ce qu'il faut pour publier sur GitHub Pages, sans `node_modules` ni `dist` :
- `source/` complet + **bundle racine recompilé** (`index.html`, `app.js`, `app.css`, assets générés) : `index.html` doit référencer des fichiers qui existent réellement ;
- conservés tels quels : `config.local.js` (mes identifiants Google, inclus volontairement), `config.local.example.js`, `manifest.webmanifest`, icônes, `splash/`, `pdf.*.mjs`, `serve.py`, `LANCER.bat`, `.nojekyll`, `legacy/`, `reference/`, `docs/` (les icônes/logo ne changent que si ta pièce les refait) ;
- `sw.js` avec `CACHE` incrémenté (et racine = `source/public/sw.js`) ;
- `README.md` avec « Reconstruire l'application » (commandes exactes) et **« Publier sur GitHub »** pas à pas (commandes `git`, activer Pages sur la branche, adresse finale) ;
- `docs/REPRISE.md` : **journal de reprise** que tu mets à jour à chaque pièce (ce qui est fait, décisions, modèle de données actuel, fichiers clés, ce qui reste). C'est ce qui permet à une nouvelle conversation de reprendre sans rien perdre ;
- `CHANGELOG.md` mis à jour, `package.json` en `1.5.0-p4` ;
- **`RAPPORT-P4.md`** court : fait / pas fait, commandes lancées avec sortie réelle, captures d'écran si possible, décisions, limites, fichiers modifiés.
Ajoute `tools/verify-sync.mjs` (s'il n'existe pas) qui échoue si un libellé clé de la source est absent du bundle racine, et lance-le.
Termine ta réponse par : « Prochaine pièce à coller : … ».
