# Audit approfondi — KENNY'S MOAS
**Date :** 18 septembre 2026 · **Branche analysée :** `kenntra24-sketch-patch-1` · **Par :** Claude (à la demande de Kenny)

Ce rapport répond à la demande d'analyse approfondie : défauts, efficience, design,
logique, navigation dans les fichiers, identification des documents, renommage,
nouvelles fonctionnalités, amélioration des fonctionnalités existantes, et affichage
des erreurs. Il complète (sans les remplacer) `RAPPORT-ANALYSE.md`, `HANDOFF.md` et
`RELAIS-iOS-DESIGN.md`, conservés tels quels.

**Méthode :** lecture complète du code (`index.html` ~2900 lignes, `app.py`, `sw.js`,
`manifest.webmanifest`) et de toute la documentation livrée, comparaison entre ce que
les docs annoncent et ce que le code fait réellement, vérification de syntaxe
(`node --check`, `py_compile`) après chaque correctif.

---

## 1. Défauts trouvés — et déjà corrigés dans ce ZIP

### 🔴 1.1 Identifiants Google réels publiés sur un dépôt public (critique)
`index.html` contenait un **vrai** Client ID OAuth et une **vraie** clé API Google en
clair (`GD_CLIENT_ID`, `GD_API_KEY`), alors que le code lui-même prévoit un mécanisme
de placeholder (`configured()` vérifie que la valeur ne commence pas par `REMPLACE_`).
Comme le dépôt GitHub est **public**, n'importe qui pouvait copier ces identifiants et
les utiliser depuis son propre site (usurpation de quota, apparition de ton app dans
des contextes que tu ne contrôles pas).

**Corrigé :** les deux constantes sont remises à `REMPLACE_PAR_TON_CLIENT_ID` /
`REMPLACE_PAR_TA_CLE_API`. L'app redevient "non configurée" pour Google Drive jusqu'à
ce que tu suives `SETUP.md` avec **tes propres** identifiants.

**⚠️ Action que toi seul peux faire :** si le site a déjà été mis en ligne avec ces
identifiants (même brièvement), va dans **Google Cloud Console → API et services →
Identifiants**, **supprime** ce Client ID et cette clé API, puis recrée-en de
nouveaux. Une clé qui a fuité doit être révoquée, pas seulement retirée du code.

### 🟠 1.2 Faille XSS mineure dans les sessions de révision
`sessionLinkLabel()` insérait le titre d'un événement de calendrier lié
(`e.title`) directement dans le HTML, sans passer par `esc()` — contrairement au
reste du code, qui échappe systématiquement les entrées utilisateur. Un titre
d'événement contenant du HTML (ex. importé depuis un export JSON partagé par
quelqu'un d'autre) aurait pu s'exécuter dans la page.

**Corrigé :** `esc(e.title)` ajouté. Impact réel limité (app mono-utilisateur, pas de
serveur), mais autant fermer la porte.

### 🟠 1.3 Écrans de démarrage iOS jamais livrés (bug documenté comme corrigé, mais absent)
`RELAIS-iOS-DESIGN.md` annonçait des écrans `splash/splash-*.png` générés pour éviter
le flash blanc au lancement depuis l'écran d'accueil iOS, et `index.html` contient
bien 9 balises `<link rel="apple-touch-startup-image">` qui les référencent — **mais
le dossier `splash/` n'existait dans aucune des livraisons précédentes.** En clair :
sur iPhone, l'app a probablement toujours affiché un flash blanc au démarrage,
malgré la doc.

**Corrigé :** les 9 images ont été générées (fond `#f2ede2`, logo centré) et ajoutées
au ZIP + au cache du service worker (`sw.js` → `r14`).

### 🟡 1.4 Aucune détection de doublon à l'import local
La synchronisation Google Drive détecte déjà les doublons (`driveFileId`), mais
l'import local (glisser-déposer, bouton "Importer", "Ajouter un devoir/cours") ne
vérifiait rien : importer deux fois le même fichier par erreur créait deux entrées
identiques dans la Bibliothèque.

**Corrigé :** `importFiles()` ignore désormais un fichier si un fichier de même nom
**et** de même taille existe déjà dans la classe active, avec un message clair
("3 fichier(s) importé(s), 1 déjà présent, ignoré").

---

## 2. Défauts trouvés — non corrigés (nécessitent un choix ou plus de travail)

- **Un seul fichier de 250 Ko / ~2900 lignes** pour tout le HTML+CSS+JS. Ça fonctionne
  (c'était un choix assumé pour éviter les 404 sur GitHub Pages, voir `BOITE-NOIRE.md`),
  mais ça reste difficile à naviguer même avec les commentaires de sections, et le
  moindre changement invalide tout le cache navigateur du fichier. Pas de vrai souci
  tant que le projet reste solo ; à surveiller si le fichier continue de grossir.
- **PDF.js embarqué (1,6 Mo à lui seul, `pdf.min.mjs` + `pdf.worker.min.mjs`)** chargé
  et précaché au premier lancement même si l'utilisateur n'ouvre jamais de PDF. Un
  chargement à la demande (import dynamique seulement à l'ouverture d'un PDF)
  réduirait le poids initial, au prix de perdre la lecture PDF 100 % hors-ligne dès
  le premier lancement. Compromis à trancher selon ton usage réel.
- **Pas de renommage global d'un tag.** Tu peux renommer un fichier (✎) et une matière
  (✎ dans Réglages, qui met à jour notes/devoirs/erreurs/événements/emploi du temps en
  cascade — bien fait). Mais un tag mal orthographié doit être retiré et rajouté
  fichier par fichier, il n'existe pas de "renommer ce tag partout".
- **Synchronisation auto uniquement onglet ouvert** (déjà documenté dans
  `TROUBLESHOOTING.md`) : limite technique d'une app sans backend, pas un bug, mais à
  garder en tête si tu comptais sur une synchro "en tâche de fond".
- **`BOITE-NOIRE.md` décrit une architecture différente du code actuel** (fichier
  `backup.json`, sync toutes les 30 secondes, placeholder `REMPLACE-MOI`) — c'est un
  document d'une session antérieure, jamais mis à jour après la refonte vers la sync
  actuelle (`kennys-moas-data.json`, 10/30/60 min). Je l'ai **gardé intact** (ton
  historique) mais j'ai ajouté un bandeau en tête pour éviter qu'on le suive par
  erreur.

---

## 3. Efficience — l'app dans son état actuel

Dans l'ensemble, **c'est du bon travail pour du solo/IA** : CSS via variables
(thème clair/sombre/auto, densité, police — 3 axes personnalisables proprement),
`esc()` systématique côté échappement (à 2 exceptions près, corrigées), gestion
d'erreurs cohérente (`try/catch` + toasts explicites plutôt que des plantages
silencieux), fichiers volumineux (PDF) en IndexedDB et non en `localStorage` (bon
réflexe, évite de saturer le quota 5-10 Mo de `localStorage`), service worker avec
vraie stratégie de cache versionné.

Points d'attention réels :
- Pas de pagination/virtualisation de la grille Bibliothèque : avec des centaines de
  documents, le rendu (`renderLib`) régénère tout le HTML à chaque filtre. Non
  problématique pour un usage scolaire normal (quelques dizaines à centaines de
  fichiers), à revoir seulement si la bibliothèque devient massive.
- `S` (le store de données) relit `localStorage` à chaque accès (`Proxy` sans cache) —
  négligeable en pratique vu le volume de données d'un usage scolaire, mais un cache
  mémoire simple éviterait des parsings JSON répétés si l'app grossit.

---

## 4. Pistes design

Le système de design existant est cohérent (tokens CSS, thèmes, densité) — je n'ai
pas touché à l'esthétique pour ne pas écraser tes choix. `RELAIS-iOS-DESIGN.md`
listait déjà, dans sa section "Reste à faire", plusieurs chantiers non terminés que
je confirme toujours valables après lecture du code actuel :
- Hiérarchie des poids de titres (h2/h3) à accentuer légèrement.
- Espacement des lettres sur `.brand` (le logo texte).
- Vérifier que les arrondis réduits (`--r`/`--r-sm`) n'ont pas cassé un élément qui
  comptait sur un arrondi plus généreux (boutons ronds, chips).

Piste supplémentaire : la grille "matières" de la Bibliothèque (écran d'entrée par
matière) utilise une icône + un fond uni par matière — un aperçu du document le plus
récent en mini-vignette derrière l'icône donnerait un repère visuel plus riche sans
complexifier le code existant (la logique de vignette PDF/image existe déjà,
`libCoverHTML`/`pdfToThumb`).

---

## 5. Navigation dans les fichiers, identification, renommage

**Ce qui existe déjà et fonctionne bien** (à ne pas refaire) :
- Renommage de fichier en un clic (icône ✎ sur chaque carte).
- Renommage de matière en cascade (met à jour notes, devoirs, erreurs, événements,
  emploi du temps et fichiers liés — rien d'orphelin).
- Navigation en 2 niveaux : grille des matières → fichiers de la matière, avec
  filtres secondaires (catégorie, tags, recherche, favoris, récents).
- Système de tags libres par fichier.

**Pistes d'amélioration réalistes** (non implémentées ici — je préfère te les
proposer plutôt que modifier une UX qui fonctionne sans validation de ta part) :
1. **Identification plus intelligente à l'import** : aujourd'hui, un fichier importé
   garde son nom brut (ex. `IMG_20260917_142033.pdf`) et l'utilisateur choisit
   manuellement matière/type. On pourrait pré-remplir la matière suggérée en
   comparant le nom du fichier aux noms des matières existantes (ex. un fichier
   contenant "maths" ou "SVT" dans son nom), sans aucune analyse du contenu — simple,
   rapide, 100 % local.
2. **Renommage de tag global** (voir §2) : un clic "renommer ce tag" qui le remplace
   sur tous les fichiers concernés, sur le modèle exact du renommage de matière déjà
   en place.
3. **Recherche globale enrichie** : la recherche actuelle (`RECHERCHE GLOBALE`,
   ligne ~1964) filtre par nom — l'étendre aux tags et au type de document
   donnerait des résultats plus pertinents sans changer l'UI.
4. **Tri "par matière puis date"** en plus des tris existants (nom/taille/date), utile
   dès qu'on quitte la vue par matière (ex. depuis "Récents" ou "Favoris").

---

## 6. Nouvelles fonctionnalités suggérées

- **Export d'une matière seule** (au lieu de l'export complet uniquement) — utile pour
  partager les documents d'un seul cours sans tout exporter.
- **Historique des sauvegardes Drive** : actuellement un seul `kennys-moas-data.json`
  écrasé à chaque sync (choix assumé, voir `BOITE-NOIRE.md` §2.3) — une rotation sur
  2-3 versions protégerait contre une sync malheureuse qui écraserait une bonne
  version avec une mauvaise.
- **Rappel de renommage à l'import** : proposer de renommer un fichier juste après
  l'import (nom de fichier souvent peu clair, ex. scans/photos), en plus du
  renommage a posteriori déjà existant.

## 7. Amélioration des fonctionnalités existantes

- **Import** : dédoublonnage ajouté (§1.4) ; à terme, détecter aussi les quasi-
  doublons (même nom, taille différente = nouvelle version d'un même document) pour
  proposer "remplacer" plutôt que "dupliquer".
- **Toasts d'erreur** : déjà bien faits (`aria-live="assertive"` pour les erreurs,
  `"polite"` sinon — bon réflexe accessibilité) ; à généraliser, quelques rares
  branches `catch` se contentent d'un `console.error` sans toast utilisateur (ex.
  échec silencieux de génération de vignette PDF — sans conséquence visible, mais un
  petit indicateur "aperçu indisponible" serait plus honnête qu'une icône générique
  silencieuse).

## 8. Affichage des erreurs / manques constatés

- Les erreurs d'import/sync s'affichent clairement (toasts avec message précis) —
  point fort du projet, à conserver tel quel.
- Manque repéré et corrigé : les balises `<link rel="apple-touch-startup-image">`
  pointaient vers des fichiers absents (§1.3) — aucune erreur visible pour
  l'utilisateur (iOS ignore juste silencieusement un lien mort), mais un vrai manque
  fonctionnel maintenant comblé.

---

## 9. Contenu de ce ZIP par rapport au précédent

**Aucun fichier supprimé** — historique et rapports précédents intacts, comme demandé.
Rien n'a été jugé "obsolète à supprimer" au sens strict (le dépôt était déjà propre :
pas de cache, pas de fichiers de build, pas de doublons inutiles).

**Modifié :**
- `index.html` — identifiants Google redacted, faille XSS corrigée, dédoublonnage à
  l'import ajouté.
- `sw.js` — cache `r13` → `r14`, splash screens précachés.
- `BOITE-NOIRE.md` — bandeau d'avertissement ajouté en tête (contenu original intact).
- `PROJECT_INVENTORY.md`, `CHANGELOG.md` — mis à jour pour refléter cette session.

**Ajouté :**
- `splash/splash-*.png` (9 fichiers) — écrans de démarrage iOS réellement livrés.
- `RAPPORT-ANALYSE-2026-09-18.md` — ce document.

**Prochaine étape recommandée :** suivre `SETUP.md` pour générer tes propres
identifiants Google (les anciens doivent être considérés comme compromis, voir §1.1),
puis tester réellement l'app sur iPhone pour confirmer que le flash blanc a disparu.
