# LOT 0 — État des lieux exact de la P5f

Référence auditée : `KENNYS-MOAS-v1_5_0-P5f-ORAL-GITHUB-PRET.zip` (extrait tel quel).
**Aucun fichier du projet n'a été modifié.** Les seules commandes exécutées sont : lecture, `verify-sync`, build esbuild dans `source/dist` (jetable), tests.

## OBJECTIF
Inventaire, incohérences de version, chemins de build, fichiers manquants, dépendances, état des tests, bugs manifestes.

## TESTÉ / NON TESTÉ

| Élément | Statut |
|---|---|
| Tests unitaires (p1, p5, p5b, speech, sw) : 39 | ✅ exécutés, 39/39 |
| Build esbuild (`build-standalone.mjs`) depuis le source | ✅ exécuté ; `app.js`, `app.css`, `index.html`, `sw.js` identiques octet pour octet à la racine |
| `verify-sync.mjs` | ✅ exécuté → **ÉCHEC (3 erreurs)** |
| Fichiers référencés (`index.html`, `sw.js` STATIC, manifest, icônes, splash, worker PDF) | ✅ tous présents |
| `pnpm build` / `vite build` | ❌ **non exécuté** (pas de pnpm ni de réseau ici). Échec **certain par lecture** : `vite.config.ts` importe `./.figma/make/site.json`, absent du zip |
| Typecheck TypeScript des vues | ❌ non réalisable ici (pas de `@types/node` ; TS signale `baseUrl` déprécié). Jamais validé |
| Workflow GitHub Actions | ❌ non exécuté (lu seulement) |
| Safari iOS, Android réel | ❌ non testés |
| Import réel Google/Apple/Outlook (.ics) | ❌ non testé |
| Google Drive avec un vrai compte (dossier visible) | ❌ non testé (simulation seulement) |
| Mesure de voix (micro) | ❌ non testée |
| Mode « Explique ton cours » avec remarques de l'utilisateur | ❌ non testé |

## PROBLÈMES CLASSÉS

### P0 — à corriger avant toute version « durable »

1. **Chaîne de build : trois chemins, aucun fiable de bout en bout.**
   - Production réelle = esbuild (`tools/build-standalone.mjs`) + fichiers compilés commités à la racine. Reproductible **si** la même version d'esbuild est utilisée.
   - Le workflow installe `npm i --no-save esbuild react react-dom` **sans version figée** : deux builds à des dates différentes peuvent différer.
   - `package.json` annonce `build: vite build` qui **ne peut pas fonctionner** (fichier Figma absent, plugins Figma dans la config). Faux build « officiel ».
   - Le workflow est manuel (`workflow_dispatch`) : pas de build/test/déploiement au push.
2. **`verify-sync.mjs` est rouge sur l'état livré** (erreur de ma part : je ne l'avais pas lancé) :
   - cherche `kennys-moas-react-vN` dans `sw.js` (nom supprimé depuis le BUILD_ID automatique) ;
   - exige `sw.js` racine == `source/public/sw.js` (faux par construction : la racine est estampillée, la source contient `__BUILD_ID__`) ;
   - cherche un libellé Drive qui n'existe plus. Il teste des **textes**, pas des invariants.
3. **Suppression en masse « Vider les terminés » (Devoirs)** : filtre directement la collection, **sans** `removeAllReferencesTo` → relations, fichiers liés, événements peuvent rester orphelins ; l'annulation ne restaure que la collection. Même défaut sur la suppression d'une remarque depuis le lecteur (`FileViewer.deleteRemark`, pas d'annulation).
4. **Restauration non déterministe et non transactionnelle** (`importJSON`, `restoreAutoBackup`) :
   - fusionne clé par clé : les clés `me:` absentes de la sauvegarde restent en place ; les fichiers présents mais absents de la sauvegarde ne sont jamais retirés → « Restaurer » ≠ retour à l'état sauvegardé ;
   - écrit `localStorage` **avant** les fichiers : une erreur au milieu (quota, Data URL corrompue) laisse un état à moitié restauré ; aucune validation de schéma ; pas de rollback ;
   - la sauvegarde auto est « légère » (aucun blob) mais l'interface ne dit pas clairement ce qu'on récupère si on perd le navigateur.
5. **Lecteur PDF : pas de vraies annotations.** Le magasin IndexedDB `annot` existe mais **n'est utilisé nulle part**. La « remarque sur la sélection » ne garde que le texte et une page. Défaut manifeste : la page est déduite du **seul `anchorNode`** → une sélection qui commence page 7 et finit page 8 est silencieusement enregistrée « page 7 ». Le défaut de surlignage vu dans ta vidéo (« lim » avec indice) **n'a jamais été reproduit ni diagnostiqué** par moi.

### P1

6. **Versions incohérentes** : `package.json` = `1.5.0-p5b` ; `etat_projet.md` (en-tête) = p5b ; `docs/REPRISE.md` = p5b + cache « v21 » (obsolète) ; CHANGELOG parle de p5c→p5f ; aucune version visible dans l'application ; `BUILD_ID` (technique) non distingué de la version produit.
7. **Interface utilisateur trop technique / trompeuse** (Réglages) : message « Google Drive n'est pas encore configuré… » avec référence au fichier de configuration ; lien « Ouvre la synchronisation avancée (version d'origine) » vers `legacy/`.
8. **Drive** : le dossier est retrouvé **par son nom** à chaque fois ; seul le lien est mémorisé, pas l'identifiant → deux dossiers « KENNY'S MOAS » possibles. Les erreurs sont déjà bien différenciées (hors-ligne/popup/annulé/API/403), bon point. `config.local.js` est commité avec `clientId` et `apiKey` : c'est le choix assumé, mais la sécurité repose **entièrement** sur les restrictions Google Cloud (API + référents HTTP + origines OAuth) — à vérifier.
9. **Accessibilité** : `Modal` annonce « focus piégé » en commentaire mais ne fait que focaliser le 1er champ et gérer Échap — **pas de piège de Tab** (commentaire faux). 16 éléments `div/span/li` avec `onClick` (SearchOverlay, Topbar, Sidebar, Dashboard, DropZone, Schedule, App, FileViewer). Résultats de recherche non navigables au clavier (↑ ↓ Entrée) et menant à des pages, pas à l'objet exact.
10. **Actions au survol** : `.frow:hover .frow-actions` (Bibliothèque, vue liste) — non accessibles au toucher.
11. **Remplacement de fichier** : les annotations n'existent pas encore, mais la règle (conserver ou invalider après remplacement) doit être décidée **avant** le lot annotations.
12. **Service Worker** : scénario v1→v2 + hors-ligne testé sous Chromium uniquement ; Safari iOS non testé.

### P2

13. Minuteur : `setInterval` créé **au chargement du module** (`lib/timer.ts`) et tournant en permanence, même arrêté.
14. Taille du texte : `zoom` CSS appliqué à la racine (`Settings.tsx`) ; effets possibles sur lecteur, éléments fixes, safe-area : non audité.
15. « Fichiers récents » (tableau de bord) : le champ `lastOpened` existe (`openTracked`) ; l'usage exact dans le tri n'a pas été confirmé.
16. Export complet en JSON/Data URL : acceptable pour petite bibliothèque, risque mémoire pour grosse ; à évaluer plus tard, pas urgent.
17. Chargement du lecteur : PDF.js déjà chargé à la demande (bon). Bundle 422 Ko + 64 Ko CSS : acceptable.

## POINTS SOLIDES CONFIRMÉS
Build esbuild reproductible (mêmes octets) ; 39 tests verts ; aucun fichier référencé manquant ; PDF.js local + worker présents ; migrations/relations testées (p1) ; Service Worker réseau-d'abord avec BUILD_ID automatique ; messages d'erreur Drive différenciés ; lecteur : rendu à la demande + plafond mémoire du canvas.

## LIMITES RESTANTES
Aucune correction faite dans ce lot (par conception). Le diagnostic du surlignage décalé et la validation mobile réelle restent à faire.

## PROCHAIN LOT RECOMMANDÉ
**LOT 1 — Build / release** : une seule chaîne canonique (esbuild, versions **figées** avec `package-lock`), retirer ou isoler le faux `vite build` Figma, réécrire `verify-sync` sur des invariants (fichiers présents, BUILD_ID cohérent, artefacts du même build), workflow `push → build → tests → verify → déploiement`, version produit unique (`package.json` → README/REPRISE/CHANGELOG/diagnostic/Réglages). Puis LOT 2 (suppressions/relations) et LOT 3 (restauration) : ce sont les deux risques de perte de données.
