# Changelog

## Session 6 — Vérification visuelle en vrai navigateur (19/09/2026)

Voir `RAPPORT-ANALYSE-2026-09-19-F.md` pour le détail complet.

### Corrigé
- Planning : le filet de couleur du `h3` centré `#calTitle` flottait seul à gauche du titre du mois (régression S5).
- Boîtes de dialogue : elles s'affichaient en haut à gauche de l'écran (le reset `*{margin:0}` écrasait le
  `margin:auto` natif) ; maintenant centrées.
- Réglages → Matières : le nom de la matière était recouvert par la case du coefficient depuis l'ajout du
  bouton d'export (S4) ; contrôles regroupés et passés à la ligne si besoin.
- Mobile : la barre de navigation du bas ne montre plus les libellés de groupe ni le trait d'indicateur latéral.
- `sw.js` : cache `r18` → `r19`.


## Session 5 — Logo & hiérarchie des titres (18/09/2026)

Voir `RAPPORT-ANALYSE-2026-09-18-E.md` pour le détail complet.

### Décidé et livré
- Logo (`.brand`) : tracking `-.01em` → `.05em`, graisse `800` → `700` (option choisie par
  Kenny parmi trois variantes présentées).
- `h3` (sous-titres, titres de boîtes de dialogue) : graisse `700` explicite + filet de couleur
  (`var(--p)`, 3px) à gauche. Le `h2` de page n'a pas changé. **S'applique à tous les `h3` de
  l'appli**, y compris les boîtes de dialogue (voir la note dans le rapport si ce n'est pas
  souhaité partout).
- `sw.js` : cache `r17` → `r18`.

Les deux points « design en arbitrage » listés depuis la session B sont désormais clos.

## Session 4 — Export de matière, historique Drive (18/09/2026)

Voir `RAPPORT-ANALYSE-2026-09-18-D.md` pour le détail complet.

### Ajouté
- Réglages → liste des matières : bouton d'export d'une matière seule (notes, devoirs,
  remarques, fichiers) en JSON autonome. Export à sens unique pour l'instant (pas de
  ré-import dédié à ce format partiel).
- Réglages → carte Google Drive : historique des 3 dernières versions du fichier de données
  (basé sur l'historique de révisions natif de Google Drive), avec restauration possible des
  2 précédentes (sauvegarde de sécurité locale automatique avant restauration).

## Session 3 — Devoirs, quasi-doublons, renommage (18/09/2026)

Voir `RAPPORT-ANALYSE-2026-09-18-C.md` pour le détail complet.

### Ajouté
- Devoirs : contexte de matière (dernière matière utilisée, ou matière consultée dans la
  Bibliothèque) pré-remplit le formulaire « Ajouter un devoir » et l'import « Importer un
  travail » ; suggestion automatique de matière par nom de fichier si le contexte est vide,
  sur le même principe que la Bibliothèque.
- Import : détection de quasi-doublons (nom de fichier « nettoyé » des suffixes de copie/
  version identique à un fichier déjà présent) avec proposition de remplacement.
- Import : rappel de renommage pour les fichiers au nom peu clair (photos/scans type
  `IMG_...`, `Scan_...`, noms entièrement numériques).

### Corrigé
- Un devoir créé par import recevait toujours une matière vide, même quand elle était déjà
  connue (bloquait le premier point ci-dessus).

### Décidé (sans changement de code)
- PDF.js reste précaché au démarrage (choix explicite de Kenny) : la lecture PDF hors-ligne
  dès le premier lancement est conservée, au prix d'un démarrage un peu plus lourd (~1,6 Mo).

## Session — Audit approfondi & corrections (18/09/2026)

Voir `RAPPORT-ANALYSE-2026-09-18.md` pour le détail complet (méthode, constats, priorités).

### Corrigé
- **Sécurité (critique)** : un vrai Client ID OAuth Google et une vraie clé API Google étaient
  codés en dur dans `index.html` et publiés sur le dépôt GitHub **public** (au lieu du
  placeholder `REMPLACE_...` prévu par le code lui-même). Remplacés par des placeholders ;
  **action requise côté utilisateur** : révoquer ces identifiants dans Google Cloud Console si
  le site a déjà été déployé avec (voir rapport).
- Faille XSS mineure : le titre d'un événement de calendrier lié à une session de révision
  s'affichait sans échappement HTML (`sessionLinkLabel`). Corrigé (`esc()` ajouté).
- Écrans de démarrage iOS (`splash/*.png`) : référencés dans `index.html` depuis la session
  précédente mais jamais livrés dans le ZIP (flash blanc probable à chaque lancement depuis
  l'écran d'accueil iOS). Les 9 images sont maintenant générées et incluses, précachées par le
  service worker (`sw.js` → `r14`).

### Ajouté
- Détection de doublons à l'import de fichiers (Bibliothèque, devoirs, notes) : un même fichier
  (même nom + même taille) déjà présent dans la classe active est désormais ignoré au lieu
  d'être importé une seconde fois, avec un message clair indiquant combien de doublons ont été
  ignorés.

### Inchangé
- Aucune fonctionnalité existante retirée ; toutes les archives de sessions précédentes
  conservées telles quelles (voir note ajoutée en tête de `BOITE-NOIRE.md`, non modifiée sur le
  fond, pour signaler qu'elle décrit une architecture antérieure).

---

## Session — Synchronisation Google Drive (cette session)

### Ajouté
- Connexion Google réelle (Google Identity Services, flux "token
  client" côté navigateur, sans backend) — Réglages → Google Drive.
- Intégration Google Drive : création/retrouvaille automatique d'un
  dossier applicatif `KENNY'S MOAS` (+ sous-dossier `Bibliothèque`)
  dans le Drive de l'utilisateur, sans doublon d'un lancement à
  l'autre.
- Synchronisation bidirectionnelle des données (notes, devoirs,
  matières, réglages…) via un fichier `kennys-moas-data.json` sur
  Drive, avec détection de conflit (timestamp + hash local) et
  résolution par choix explicite de l'utilisateur (aucune perte
  silencieuse — sauvegarde automatique prise avant toute résolution).
- Synchronisation incrémentale des fichiers de la Bibliothèque (un
  fichier Drive par document, envoyé une seule fois, jamais
  retéléchargé si déjà présent).
- Synchronisation au démarrage (silencieuse, ne bloque jamais
  l'affichage de l'app), synchronisation automatique configurable
  (désactivée / 10 / 30 / 60 min, défaut 30), et bouton
  "Synchroniser maintenant" (protégé contre les exécutions
  concurrentes).
- Import multiple depuis Google Drive via le sélecteur natif Google
  (Picker) : sélection de plusieurs fichiers en une opération,
  intégration dans la Bibliothèque existante (même logique que
  l'import local), avec détection des doublons déjà importés.
- Gestion d'erreurs dédiée : session expirée, refus d'autorisation,
  absence d'Internet, quota Drive dépassé, fichier introuvable/
  invalide — chaque cas affiche un message clair sans jamais faire
  planter le reste de l'application.
- Indicateurs d'état dans Réglages → Google Drive : connecté / non
  connecté, en cours de synchronisation, dernière synchronisation,
  hors-ligne, conflit, erreur.
- `.gitignore` ajouté (hygiène de dépôt / préparation GitHub Pages).
- `app.py` : port local fixe (8765, avec repli automatique si occupé)
  nécessaire pour déclarer une origine OAuth stable auprès de Google.
- `sw.js` : nom de cache incrémenté (`r13`) pour que les utilisateurs
  ayant déjà installé l'app en PWA reçoivent bien cette mise à jour.
- Documentation : `SETUP.md`, `HANDOFF_TO_NEXT_AI.md`,
  `TROUBLESHOOTING.md`, `PROJECT_INVENTORY.md`, `MANIFEST.json`,
  `FINAL_VERIFICATION.md`, et ce `CHANGELOG.md`.

### Inchangé
- Aucune fonctionnalité existante (navigation, notes, devoirs, emploi
  du temps, bibliothèque, export/import JSON, sauvegarde automatique
  locale, thèmes, etc.) n'a été modifiée ou retirée. Tout continue de
  fonctionner sans connexion Google.

### Non fait / documenté comme limite
- Voir `HANDOFF_TO_NEXT_AI.md` (section Limitations) et
  `TROUBLESHOOTING.md`.

---

## [Session 18/09/2026 — B] Refonte intelligente (Bibliothèque, recherche, import)

Voir `RAPPORT-ANALYSE-2026-09-18-B.md` pour le détail complet. Résumé :

### Ajouté
- Bibliothèque : accès direct « ★ Mes favoris » / « 🕒 Mes derniers documents » depuis
  l'écran d'entrée, toutes matières confondues (avant : seulement à l'intérieur d'une
  matière déjà choisie).
- Renommage global d'un tag (« Renommer ce tag partout »), sur le modèle du renommage de
  matière déjà existant.
- Suggestion de matière à l'import basée sur le nom du fichier (locale, sans analyse de
  contenu, jamais automatique — bouton explicite dans un toast).
- Tri « Matière puis date » dans la Bibliothèque.
- `sw.js` : cache `r14` → `r15`.

### Amélioré
- Import de fichiers (glisser-déposer, « Ajouter un fichier », « Ajouter un cours ») :
  pré-remplit désormais la matière si l'utilisateur est déjà en train de la consulter,
  au lieu de la redemander.
- Recherche globale : reconnaît maintenant aussi les tags, le type de document et les
  matières elles-mêmes (résultat direct, pas seulement le nom des fichiers).

### Sécurité — décision prise, action restante côté utilisateur
- Les identifiants Google (`GD_CLIENT_ID`/`GD_API_KEY`) redactés par l'audit du matin même
  (fuite confirmée sur dépôt public) sont volontairement **restés** en placeholders — non
  restaurés depuis l'ancien ZIP, conformément à la clause de sécurité du cahier des charges.
  Toute la logique Google Drive existante (authentification, sync, Picker...) est intacte et
  n'attend que deux valeurs à coller une fois les identifiants régénérés. Voir
  `RAPPORT-ANALYSE-2026-09-18-B.md` §3 et `SETUP.md`.

### Inchangé
- Lecteur PDF, stockage local/IndexedDB, service worker (hors incrément de version), thèmes,
  export/import JSON, notes/devoirs/calendrier/révisions/erreurs/objectifs : aucune ligne
  touchée cette session.

### Non fait / documenté comme limite
- Voir `RAPPORT-ANALYSE-2026-09-18-B.md` §6 (« À continuer ») et §7 (« À tester »).

---

## Sessions précédentes

Voir `RAPPORT-ANALYSE.md` et `HANDOFF.md` pour l'historique détaillé
des sessions antérieures (correctif d'édition des notes, lecteur PDF
hors-ligne, refonte cosmétique, fusion de fonctionnalités, etc.).
