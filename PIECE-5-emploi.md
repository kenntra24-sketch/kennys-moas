# PIÈCE 5 — Emploi du temps et calendrier
> À coller tel quel dans une IA qui a accès au dépôt **avec Node/pnpm, réseau et navigateur** (Chromium/Playwright). Joindre le dernier ZIP livré **ET le fichier de mon emploi du temps** (photo, PDF, Excel ou capture).

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

## TA PIÈCE : Emploi du temps et calendrier

Objectif : un emploi du temps **fidèle à mon modèle** et très personnalisable, plus un calendrier riche, plus un export qui crée vraiment les créneaux.
1. **Je joins mon emploi du temps** (fichier/photo). **Regarde-le attentivement** : reproduis sa structure (colonnes = jours ? lignes = heures ?, longueur des créneaux, pauses/récréations, midi, semaines A/B éventuelles, couleurs, taille des cases, ce qui est écrit dans une case : matière, salle, professeur…). L'emploi du temps par défaut de l'app doit **ressembler** à mon modèle. Si le fichier n'est pas joint, ARRÊTE-TOI et demande-le-moi avant de coder cette partie.
2. **Plusieurs modèles d'emploi du temps** : garder « Mon emploi du temps » (mon modèle), et proposer des modèles de départ (semaine simple, journée par blocs, format collège/lycée/université…). L'utilisateur peut **créer, dupliquer, renommer, supprimer** plusieurs emplois du temps et choisir lequel est actif. Ne casse pas l'emploi du temps existant : migration idempotente vers le nouveau format, ancien conservé.
3. **Personnalisation** : jours affichés (dont samedi/dimanche), heure de début/fin, durée des créneaux (fixe ou libre), pauses, semaines A/B, ce qui s'affiche dans chaque case, couleur par matière (utilise les couleurs de la pièce 2), taille du texte, mode compact. Édition simple : toucher une case → choisir matière/salle/professeur ; copier-coller un créneau ; glisser pour allonger.
4. **Calendrier** (jour/semaine/mois, existants) : plus de réglages — plage horaire visible, premier jour de la semaine, vue par défaut, affichage des devoirs/échéances/examens/séances de révision, couleurs par matière ou par type, fuseau horaire correct (mon appareil est en Afrique de l'Ouest/GMT). Événements récurrents (hebdo, jusqu'à une date) modifiables « cette occurrence / toutes ». Clic sur un événement → détail + « Associé à » (pièce 3).
5. **Export vers mon agenda — sois honnête sur ce qui est possible** :
   a. **Google Agenda en direct** : avec les identifiants de `config.local.js` (Google Identity Services + API Calendar), bouton « Envoyer vers Google Agenda » qui **crée réellement les événements** (récurrents pour l'emploi du temps) dans un agenda dédié « KENNY'S MOAS », sans doublons si on relance (mémorise les IDs créés, mets à jour/supprime proprement). Explique dans le README les étapes de la console Google Cloud : activer l'API Google Calendar, ajouter la portée `calendar.events`, ajouter mon compte comme utilisateur de test, autoriser l'adresse GitHub Pages ; ces étapes sont manuelles de mon côté, dis-moi lesquelles.
   b. **Fichier `.ics`** valide (RRULE pour les récurrences, VTIMEZONE correct, rappels/`VALARM` optionnels) : sur téléphone et PC, l'ouvrir ajoute les créneaux à l'agenda natif (Apple, Outlook, Google). Une **PWA ne peut pas écrire directement dans l'agenda natif du téléphone/PC sans passer par un de ces deux chemins** : écris-le clairement dans l'interface, sans jamais prétendre le contraire.
   c. Teste l'ICS (import dans un parseur ICS/validation) ; teste l'appel Google en simulant l'API si tu ne peux pas te connecter, et dis-le.
6. Vérifie les 3 vues du calendrier, l'emploi du temps, l'export et l'affichage sur téléphone (capture 390 px).


## Livraison (identique pour chaque pièce)
Produis **`KENNYS-MOAS-v1.5.0-P5.zip`** qui contient TOUT ce qu'il faut pour publier sur GitHub Pages, sans `node_modules` ni `dist` :
- `source/` complet + **bundle racine recompilé** (`index.html`, `app.js`, `app.css`, assets générés) : `index.html` doit référencer des fichiers qui existent réellement ;
- conservés tels quels : `config.local.js` (mes identifiants Google, inclus volontairement), `config.local.example.js`, `manifest.webmanifest`, icônes, `splash/`, `pdf.*.mjs`, `serve.py`, `LANCER.bat`, `.nojekyll`, `legacy/`, `reference/`, `docs/` (les icônes/logo ne changent que si ta pièce les refait) ;
- `sw.js` avec `CACHE` incrémenté (et racine = `source/public/sw.js`) ;
- `README.md` avec « Reconstruire l'application » (commandes exactes) et **« Publier sur GitHub »** pas à pas (commandes `git`, activer Pages sur la branche, adresse finale) ;
- `docs/REPRISE.md` : **journal de reprise** que tu mets à jour à chaque pièce (ce qui est fait, décisions, modèle de données actuel, fichiers clés, ce qui reste). C'est ce qui permet à une nouvelle conversation de reprendre sans rien perdre ;
- `CHANGELOG.md` mis à jour, `package.json` en `1.5.0-p5` ;
- **`RAPPORT-P5.md`** court : fait / pas fait, commandes lancées avec sortie réelle, captures d'écran si possible, décisions, limites, fichiers modifiés.
Ajoute `tools/verify-sync.mjs` (s'il n'existe pas) qui échoue si un libellé clé de la source est absent du bundle racine, et lance-le.
Termine ta réponse par : « Prochaine pièce à coller : … ».
