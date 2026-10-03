# RELAIS COMPLET — KENNY'S MOAS (état au 02/10/2026, après le LOT 2)

> À lire en premier par toute personne ou IA qui reprend le projet. Ce fichier remplace `RELAIS-LOT3.md` (gardé pour mémoire).

## 1. Qui est l'utilisateur et comment lui parler
- Il s'appelle Agba Jean Kenny Ivann. Il a conçu le projet (design, fonctionnalités, noms) mais **n'écrit aucun code** et se dit « handicapé informatique » : pas de JavaScript sur son PC, il ne comprend pas le jargon.
- **Règle d'or** : faire le travail technique soi-même ; ne lui demander que de **simples clics dans le navigateur**, expliqués en mots simples. Pas de ligne de commande, pas d'« installe X ».
- Il utilise plusieurs IA sur des plans gratuits (limites d'usage serrées) : réponses courtes, rapports simples. Il fait parfois relire les rapports par une autre IA et colle ses recommandations.
- Il veut une application qui « vit toute seule » : « je pousse et je n'ai plus rien à faire ».
- Ce qu'il apprécie : honnêteté sur ce qui est testé / non testé (« ne dis pas que ça marche si tu ne l'as pas exécuté »), petits lots, arrêt après chaque lot.

## 2. Le projet en deux phrases
Application scolaire (PWA, local-first, zéro compte, zéro serveur) : bibliothèque PDF + lecteur, devoirs, planning, révisions (pomodoro, Leitner), notes pondérées, remarques (ex-erreurs), objectifs, recherche, entraînement à parler en public, export/import JSON, sauvegarde auto, sauvegarde optionnelle Google Drive, export .ics. Publiée sur **GitHub Pages** (branche `main`, dossier racine). Version produit : **1.5.0-p5f** (`source/package.json`, affichée en bas de Réglages).

## 3. Structure du dépôt
- **Racine** = ce qui est publié (index.html, app.js, app.css, sw.js compilés + manifest, icônes, PDF.js local, config.local.js, diagnostic.html, legacy/).
- `source/` = code React/TypeScript (`src/`), tests (`tests/`), outils (`tools/build-standalone.mjs`, `tools/verify-sync.mjs`), `public/` (fichiers statiques copiés à la racine), `figma-only/` (ancienne chaîne Vite/Figma ARCHIVÉE, inutilisable hors Figma).
- `.github/workflows/` : `build.yml` (compiler, tester, publier) et `generer-verrou.yml` (une seule fois).
- `docs/` : REPRISE.md (ancien), rapports, pack de pièces, ce fichier. `docs/rapports/LOT-0-ETAT-DES-LIEUX-P5f.md` = audit complet (liste P0/P1/P2 — **à relire pour la suite**).
- `docs/outils/banc-essai-hors-ligne.sh` = script utilisé pour tester sans réseau (voir §7).

## 4. Historique de cette conversation (chronologique)
1. **LOT 0 — audit P5f** (déjà fait avant mon intervention, rapport fourni) : 39 tests verts ; verify-sync rouge ; trois chemins de build dont un faux (`vite build`, dépend d'un fichier Figma absent) ; suppression en masse sans nettoyage des liens ; restauration non transactionnelle ; lecteur PDF sans vraies annotations ; etc.
2. **LOT 1 — build / mise en ligne** (fait avant, rapport fourni) : chaîne unique esbuild, versions figées, verify-sync réécrit sur des invariants, workflow push→build→tests→verify→publication, version unique visible. 44 tests.
3. **Message d'une autre IA relue par l'utilisateur** : a relevé que le workflow disait utiliser `npm ci` sans `package-lock.json`, alors qu'un `pnpm-lock.yaml` semblait exister ; a demandé un **LOT 1.1** (un seul gestionnaire, un seul verrou, reproductible).
4. **LOT 1.1 (moi)** : j'ai constaté que le seul `pnpm-lock.yaml` du zip était dans `source/figma-only/` et **obsolète** (react 19.2.4, Vite 8, sans tsx/esbuild) → renommé `pnpm-lock.ARCHIVE-figma-obsolete.yaml`. Choix : **pnpm 10.34.3** (`packageManager`, version reprise de l'ancien `.mise.toml`, non vérifiée sur le registre). Workflow en `pnpm install --frozen-lockfile`, plus aucun repli sans verrou ; nouveau workflow manuel « Générer le verrou pnpm » ; verify-sync étendu (`--require-lock`) ; 50 tests.
5. **L'utilisateur** : « je suis handicapé informatique, je ne veux rien faire, démerde-toi » → j'ai expliqué que tout se passe sur GitHub (quelques clics) et que le site actuel continue de marcher sans rien faire.
6. **Nouveau conseil de l'autre IA → LOT 1.2** : vérifier ce que déclenche le commit du verrou. J'ai consulté la documentation GitHub : un commit fait avec `GITHUB_TOKEN` **ne déclenche pas** d'autre workflow (sauf `workflow_dispatch`). Donc `generer-verrou.yml` lance lui-même `build.yml` (`gh workflow run`, permission `actions: write`). Node figé à 22.22.2. verify-sync interdit `continue-on-error` / `|| true`, impose Node exact, impose que la publication vienne après tests et `verify:ci`. 52 tests.
7. **Question « puis-je tout déposer sur Figma ? »** : réponse = non pour le code. La chaîne Figma est archivée ; les retours d'utilisateurs (forums Figma, non officiels) signalent un import GitHub qui casse parfois la structure et un envoi vers GitHub qui écrase le contenu du dépôt (et seulement vers un dépôt créé par Figma, branche main). Figma peut servir aux **maquettes**, pas au code.
8. **LOT 2 — suppressions et liens** : « Vider les terminés » nettoie maintenant les liens de chaque devoir (fonction `removeObjects` dans `src/lib/deletion.ts`), la confirmation indique combien sont encore reliés, un seul « Annuler » remet devoirs + liens. Suppression d'une remarque depuis le lecteur (`FileViewer.deleteRemark`) : « Annuler » ajouté. Aucun autre chemin de suppression en masse trouvé (la suppression d'une matière garde ses notes volontairement). 57 tests (`tests/lot2.test.ts`).
9. L'utilisateur, limité par ses quotas, demande ce **zip de relais complet** pour le confier à quelqu'un d'autre.

## 5. État réel : ce qui est vérifié / ce qui ne l'est PAS
**Vérifié (exécuté)** : build esbuild (0.27.7), 57 tests sur 57, verify 136 invariants (140 avec `--rebuild`), racine publiée = recompilation du source octet pour octet, YAML des workflows valide.
**NON vérifié — à ne jamais présenter comme validé** :
- **Aucun vrai `pnpm install` n'a jamais tourné** (pas de réseau côté assistant, registre en 403). `pnpm-lock.yaml` **n'existe pas encore**. La version pnpm 10.34.3 n'est pas confirmée.
- **Aucun workflow n'a tourné sur GitHub.** L'étape qui lance `build.yml` depuis `generer-verrou.yml` n'est pas testée.
- Le bouton « Vider les terminés » n'a pas été cliqué dans un vrai navigateur ; Safari iOS / Android réels, import .ics réel, Google Drive réel, micro, mode « Explique ton cours » : jamais testés.
- Vérification des types TypeScript : jamais validée.

## 6. Actions à faire (clics, côté GitHub) — dans l'ordre
1. Envoyer le contenu de ce zip dans le dépôt (comme d'habitude, voir `GITHUB-PAGES.md`).
2. Onglet **Actions** → **Générer le verrou pnpm** → **Run workflow** : crée `source/pnpm-lock.yaml`, prouve qu'il s'installe, le commite, puis lance « Compiler, tester, publier ».
3. Si une étape devient rouge : copier le message d'erreur (ou une capture) et le donner à l'IA. Le site déjà en ligne reste intact en cas d'échec (rien n'est publié).
4. Réglages Pages à ne pas changer : « Deploy from a branch » → `main` → `/ (root)`.

## 7. Comment travailler sur le code (pour l'IA qui reprend)
- Commandes officielles (dans `source/`) : `pnpm install --frozen-lockfile`, `pnpm run build`, `pnpm test`, `pnpm run verify:rebuild` (CI : `pnpm run verify:ci`). Gestionnaire unique : pnpm ; `package-lock.json` et `yarn.lock` sont interdits (verify échoue).
- Sans réseau : `docs/outils/banc-essai-hors-ligne.sh` copie le projet, lie `react`, `react-dom`, `esbuild`, `tsx` depuis une installation globale **aux mêmes versions** (react/react-dom 19.2.5, esbuild 0.27.7, tsx 4.21.0), compile, teste, vérifie. Adapter les chemins. Ce n'est PAS un vrai `pnpm install`.
- **Après toute modification de `source/src`** : recompiler et **copier à la racine** `source/dist/{index.html,app.js,app.css,sw.js}` (sw.js est estampillé par le build). Vérifier ensuite octet pour octet que la racine = recompilation. Les chaînes accentuées apparaissent échappées dans app.js (`\xE9`) : chercher avec ce format.
- **Erreur à ne pas répéter** (commise pendant le LOT 2) : une copie de fichiers avec une écriture abrégée `{a,b,c}` a échoué en silence, et un zip a failli partir avec l'ancienne racine. Toujours copier fichier par fichier et comparer avec `cmp` avant de zipper.
- Règles de méthode : un lot à la fois, périmètre étroit, tests avant/après, rapport « fait / testé / non testé / limites », puis STOP. Ne jamais écrire « ça devrait marcher ».

## 8. Feuille de route (ordre décidé, l'intégrité des données passe avant les nouveautés)
- **LOT 3 — restauration / sauvegardes (PROCHAIN)**. Audit P0 n°4 : `importJSON` et `restoreAutoBackup` **fusionnent** au lieu de restaurer exactement (clés absentes de la sauvegarde conservées ; fichiers absents jamais retirés), écrivent le localStorage **avant** les fichiers sans retour arrière, ne valident aucun schéma. À faire : validation complète avant toute écriture, restauration exacte, ordre fichiers puis données avec rollback en cas d'erreur, message clair sur la sauvegarde auto « légère » (sans fichiers), tests de panne en cours de route.
- **LOT 4 — Google Drive** : retrouver le dossier par **identifiant** (aujourd'hui par nom → doublons possibles) ; vérifier les restrictions Google Cloud (clé API + origines) car `config.local.js` est publié ; test avec un vrai compte.
- **LOT 5 — lecteur PDF / annotations** : le magasin IndexedDB `annot` existe mais n'est pas utilisé ; la page d'une remarque vient du seul `anchorNode` (sélection page 7→8 enregistrée « page 7 ») ; surlignage décalé vu dans une vidéo de l'utilisateur jamais reproduit ; décider la règle « remplacement de fichier » avant d'implémenter les annotations.
- **P1/P2 restants de l'audit** : accessibilité (Modal sans piège de Tab, 16 éléments cliquables non-boutons, recherche non navigable au clavier), actions visibles seulement au survol (Bibliothèque), textes techniques dans Réglages (Drive, lien « version d'origine »), minuteur qui tourne en permanence (`lib/timer.ts`), zoom CSS de la taille du texte, tri des « fichiers récents », export JSON lourd pour grosse bibliothèque, test du Service Worker sur Safari.

## 9. Pièges connus
- Ne pas redonner le code à Figma Make (voir §4.7). Ne pas réintroduire `vite build`.
- Ne jamais supprimer un fichier de l'utilisateur sans demande ; `figma-only/` est conservé volontairement.
- `config.local.js` (clientId + apiKey Google) est publié : choix assumé, la sécurité repose sur les restrictions Google Cloud.
- Les rondes antérieures (Ronde 5 à 11, v1.2 → p5c) sont décrites dans `source/RELAIS-FUSION.md`, `etat_projet.md`, `docs/REPRISE.md` (partiellement obsolètes sur la chaîne de build : se fier à ce fichier-ci et au README).
