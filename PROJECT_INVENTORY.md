# Inventaire du projet

| Fichier / dossier | Rôle |
|---|---|
| `index.html` | L'application entière (HTML + CSS + JS en un seul fichier, ~3100 lignes). Contient le module de synchronisation Google Drive (bloc `SYNCHRONISATION GOOGLE DRIVE`) et, depuis le 18/09/2026 (session B), les améliorations Bibliothèque/recherche/import détaillées dans `RAPPORT-ANALYSE-2026-09-18-B.md`. |
| `app.py` | Lance l'app comme logiciel de bureau (serveur HTTP local + fenêtre `pywebview`, sans navigateur visible). Port fixe 8765 (voir `SETUP.md`). |
| `manifest.webmanifest` | Manifeste PWA (nom, icônes, couleurs, installation sur téléphone/ordinateur). |
| `sw.js` | Service worker : cache l'app pour un fonctionnement hors-ligne une fois chargée une première fois (stratégie "cache d'abord", voir `TROUBLESHOOTING.md`). |
| `pdf.min.mjs`, `pdf.worker.min.mjs` | PDF.js (build officiel Mozilla), embarqué en local pour le lecteur PDF intégré, 100% hors-ligne. |
| `icon*.png`, `icon.ico` | Icônes de l'app (PWA, bureau, iOS). |
| `splash/*.png` | Écrans de démarrage iOS (évite le flash blanc à l'ouverture depuis l'écran d'accueil). **Corrigé le 18/09/2026** : ces 9 fichiers étaient référencés dans `index.html` (`<link rel="apple-touch-startup-image">`) mais n'étaient jamais réellement livrés dans le ZIP — l'écran de démarrage iOS n'a donc probablement jamais fonctionné avant cette session malgré `RELAIS-iOS-DESIGN.md` l'annonçant comme fait. Générés à partir de `icon-512.png` sur fond `#f2ede2` (couleur du manifeste), maintenant bien présents. |
| `.gitignore` | Exclut les artefacts de build (`dist/`, `build/`, `*.spec`), fichiers Python compilés, fichiers d'OS/éditeurs. Aucun secret n'existe dans ce projet à exclure (voir `SETUP.md`). |
| `README.md` | Présentation générale, lancement, fonctionnalités. |
| `SETUP.md` | Configuration Google obligatoire pour activer la connexion/synchronisation Drive. |
| `HANDOFF_TO_NEXT_AI.md` | Document de relais technique détaillé pour reprendre le projet. |
| `CHANGELOG.md` | Historique des modifications, dont celles de cette session. |
| `TROUBLESHOOTING.md` | Problèmes courants et solutions. |
| `PROJECT_INVENTORY.md` | Ce fichier. |
| `MANIFEST.json` | Métadonnées de version/intégrité du livrable (à ne pas confondre avec `manifest.webmanifest`, le manifeste PWA). |
| `FINAL_VERIFICATION.md` | Rapport final de vérification (build, ZIP, SHA-256, tests, limites). |
| `GUIDE.md` | Guide utilisateur pour lancer l'app de bureau (`pip install pywebview`, `python app.py`, création d'un `.exe`). |
| `RAPPORT-ANALYSE.md`, `HANDOFF.md`, `RELAIS-iOS-DESIGN.md` | Archives des sessions de travail précédentes (conservées telles quelles, non modifiées). |
| `RAPPORT-ANALYSE-2026-09-18.md` | Audit du 18/09/2026 (session A) : failles trouvées (dont des identifiants Google réels publiés par erreur, maintenant retirés — voir ce rapport pour la marche à suivre), corrections apportées, pistes d'amélioration (design, navigation, nouvelles fonctionnalités). |
| `RAPPORT-ANALYSE-2026-09-18-B.md` | Session du 18/09/2026 (session B, suite directe de la précédente) : refonte ciblée de la Bibliothèque, de la recherche globale et de l'import (favoris/récents toutes matières, renommage global de tag, contexte intelligent, suggestion de matière), plus la décision prise sur les identifiants Google (non restaurés, marche à suivre pour toi). Contient le détail FAIT/AMÉLIORÉ/AJOUTÉ/À CONTINUER/À TESTER. |
| `RAPPORT-ANALYSE-2026-09-18-C.md` | Session du 18/09/2026 (session C, suite directe de la précédente) : Devoirs (contexte de matière + suggestion à l'import), import (quasi-doublons, rappel de renommage), décision actée de garder PDF.js précaché. Contient le détail FAIT/CORRIGÉ/À CONTINUER/À TESTER. |
| `RAPPORT-ANALYSE-2026-09-18-D.md` | Session du 18/09/2026 (session D, suite directe de la précédente) : export d'une matière seule, historique de sauvegardes Drive (basé sur les révisions natives de l'API Drive). Contient le détail FAIT/À CONTINUER/À TESTER. |
| `RAPPORT-ANALYSE-2026-09-19-F.md` | Session du 19/09/2026 (F) : vérification visuelle en vrai navigateur (Chromium/Playwright) des rendus de la session E ; quatre défauts CSS corrigés (calTitle, dialogues centrés, lignes de matières, nav mobile). |
| `RAPPORT-ANALYSE-2026-09-18-E.md` | Session du 18/09/2026 (session E, suite directe de la précédente) : les deux derniers points design en arbitrage (logo, hiérarchie h2/h3) tranchés avec Kenny à partir de variantes concrètes, puis implémentés. Contient le détail FAIT/À CONTINUER/À TESTER, dont un point d'attention sur la portée globale du filet de couleur ajouté aux `h3`. |

## Où se trouve la logique de synchronisation Google Drive ?

Tout le code ajouté cette session est regroupé dans **un seul bloc**
à l'intérieur de `index.html`, clairement délimité par le commentaire
`/* ================= SYNCHRONISATION GOOGLE DRIVE ================= */`,
juste avant le module `EXPORT CALENDRIER NATIF (.ICS)` existant. Il
est écrit comme une IIFE autonome (`(function(){ ... })();`) qui ne
touche à aucune fonction existante, sauf :

- un appel ajouté en fin de `renderSettings()` (`renderGDriveUI()`) ;
- un `addEventListener('online', ...)` supplémentaire (en plus de
  celui déjà existant, sans le remplacer) pour relancer la
  synchronisation à la reconnexion réseau ;
- une nouvelle carte `<div class="card" id="gdriveCard">` ajoutée
  dans la section Réglages (aucune carte existante modifiée).

Voir `HANDOFF_TO_NEXT_AI.md` pour le détail de l'architecture.
