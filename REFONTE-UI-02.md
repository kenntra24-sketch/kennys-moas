# KENNY'S MOAS — Refonte UI 02

Cette version applique une direction visuelle plus éditoriale et plus sobre :

- suppression des emoji de l'interface au profit d'icônes SVG cohérentes ;
- palette sourde et naturelle, avec la couleur réservée aux éléments de sens ;
- suppression des dégradés et des ombres lumineuses de type « LED » ;
- nouveau menu global « + Ajouter » accessible depuis la barre supérieure, avec créations directes pour matière, fichier, devoir, note, événement, révision, erreur et objectif ;
- raccourci clavier `+` pour ouvrir le menu global ;
- nouvelles options de personnalisation dans Réglages : couleur d'accent, couleur secondaire, surface, arrondis, densité, police du texte, police des titres, largeur de navigation ;
- nouvelles familles typographiques sélectionnables ;
- amélioration de la hiérarchie visuelle des cartes, statistiques, formulaires, recherche, navigation et bibliothèque ;
- icônes vectorielles ajoutées pour fichiers, téléchargement, édition, suppression et types de documents.

## Vérification

Le parseur TypeScript a validé tous les fichiers `.ts` / `.tsx` modifiés sans erreur de syntaxe.

Le build Vite complet n'a pas pu être régénéré dans l'environnement de travail : l'installation des dépendances npm a dépassé le délai disponible et `node_modules` n'était pas présent au départ. Le code source à utiliser est donc la version mise à jour dans `src/`.

## Session suivante — 19 septembre 2026

- **Bug corrigé (bloquant)** : la refonte 02 ne se compilait pas — `src/components/Icons.tsx` avait perdu quatre icônes encore
  importées ailleurs (`IcoClose`, `IcoMenu`, `IcoArrowRight`, `IcoStar`). Rajoutées. Conséquence : `dist/app.js` du zip précédent
  était l'ancien bundle (sans menu « + Ajouter » ni nouveaux réglages) avec le nouveau CSS. `dist/` est maintenant régénéré
  (`node tools/build-standalone.mjs`) à partir de `src/` actuel.
- **Nouveau : surface « Verre »** (Réglages › Surface › « Verre (translucide) », option, non activée par défaut). Panneaux en verre dépoli
  (`backdrop-filter`), bordure lumineuse fine, ombre douce, arrondis plus généreux, fond à halos flous dérivés de la couleur
  d'accent. Clair + sombre. Replis opaques si le navigateur ne gère pas le flou ou si « réduire la transparence » est activé.
  Code : bloc « Surface Verre » en fin de `src/index.css` (piloté par `<html data-surface="glass">`) + `SURFACES` et `applyAppearance()`
  dans `src/views/Settings.tsx`. Aucun autre style modifié : les surfaces Papier / Lin / Blanc cassé sont intactes.
- **Vérifié dans Chromium (Playwright)** sur le build autonome servi en http:// : chargement, raccourci `+` (menu ouvert), bascule sur
  Verre, thème sombre, persistance après rechargement, viewport mobile 390×844 → 0 erreur JS/console.
  **Non vérifié** : Safari/iOS réel (le flou y est bien supporté via `-webkit-backdrop-filter`), Brave, `pnpm build` (Vite+Tailwind).
- `public/sw.js` : cache `kennys-moas-react-v3` → `v4`.

## Google Drive (20 septembre 2026)

- **Identifiants** (ID client OAuth + clé API) : depuis la v1.1.0 ils ne sont PLUS dans le code. Ils sont lus dans `config.local.js`
  (`window.KM_GOOGLE`, modèle : `public/config.local.example.js`), fichier versionné volontairement dans cette édition du dépôt, chargé par l'appli React ET par la synchro
  d'origine (`public/legacy/index.html`, synchro complète : fichiers, historique, Google Picker, scope `drive.file`, dossier visible « KENNY'S MOAS »).
  Un incident de publication d'identifiants sur un dépôt public a déjà eu lieu (cf. avertissement du 18/09 dans le fichier legacy).
- **Nouveau `src/lib/drive.ts`** : connexion Google Identity Services (jeton en mémoire seulement), sauvegarde/restauration d'un JSON
  (`kennys-moas-sauvegarde.json` : localStorage `me:*` + métadonnées des fichiers, sans leur contenu) dans le dossier **privé** de l'appli
  (scope `drive.appdata`, invisible dans « Mon Drive »). Restauration = même fusion que « Importer une sauvegarde ».
  Pastille « Drive » de la barre du haut branchée sur l'état réel (`useDriveStatus`). Carte « Google Drive » dans Réglages
  (`#gdriveCard`) : Se connecter / Sauvegarder / Restaurer / Vérifier / Se déconnecter + lien vers la synchro avancée (legacy).
  `backup.ts` : `lightPayload()` factorisé (utilisé par l'export léger et par Drive).
- **Deux synchros distinctes** (fichiers différents : `kennys-moas-data.json` dossier visible côté legacy, `kennys-moas-sauvegarde.json`
  dossier privé côté React) — elles ne s'écrasent pas.
- **Vérifié** avec un FAUX Google (scripts Playwright, réseau simulé) : scope et ID client transmis, multipart valide, POST puis GET, restauration
  effective, jeton jamais écrit dans localStorage, révocation à la déconnexion, page legacy charge sans erreur ni « pas encore configurée ».
  **NON vérifié : la vraie connexion Google** (pas de réseau dans l'environnement de dev).
- Prérequis Google Cloud : API Google Drive activée (+ Picker API pour la synchro avancée) ; origines JS autorisées `http://127.0.0.1:8765`
  et `http://localhost:8765` ; compte Google ajouté en « utilisateur test » ; si la clé API est restreinte, y autoriser Drive API + Picker API.
