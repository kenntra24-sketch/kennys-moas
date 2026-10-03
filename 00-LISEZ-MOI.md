# Comment utiliser ces prompts

Ton projet est découpé en **9 pièces**, à coller **une par une, dans l'ordre**, dans une IA qui a Node/pnpm, un réseau et un navigateur. Chaque pièce est autonome (elle rappelle le contexte et les règles).

| Pièce | Contenu |
|---|---|
| 0 | Stabilisation : build, bundle à jour, service worker, lanceur |
| 1 | Données : matières, catégories (Cours/Fiche/Exercice/Notes), Remarques, liens, remplacement/suppression sûrs |
| 2 | Logo, icônes, Drive, boutons vivants, polices, couleurs des matières |
| 3 | Bibliothèque par matière et par catégorie, interconnexion, Remarques, recherche |
| 4 | Lecteurs de fichiers (PDF, images, texte, Word), sélection de texte → remarque |
| 5 | Emploi du temps (ton modèle), modèles multiples, calendrier, export vers ton agenda |
| 6 | Résultats, objectifs personnalisables, données calculées |
| 7 | Guide / FAQ détaillé + méthodes de révision cliquables |
| 8 | Finition, tests complets, déploiement GitHub |

**À chaque pièce** : colle le prompt, **joins le dernier ZIP livré** (pour la pièce 0, l'archive A2 d'origine). Pour la pièce 5, joins aussi **ton emploi du temps**.
Chaque pièce se termine par un ZIP déployable et met à jour `docs/REPRISE.md`, qui permet à une nouvelle conversation de reprendre sans rien perdre (utile sur forfait gratuit).
Si une pièce est trop grosse, l'IA doit la couper en sous-pièces (3a, 3b…) au lieu de bâcler.
