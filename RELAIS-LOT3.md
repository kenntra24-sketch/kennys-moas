# Relais pour la prochaine conversation (état au 02/10/2026)
Projet : KENNY'S MOAS 1.5.0-p5f. L'utilisateur n'est PAS technique : il ne doit avoir à faire que de simples clics (voir `source/` pour le code, `README.md` pour la chaîne).
Méthode : un lot à la fois, périmètre étroit, tests, rapport simple (fait / testé / non testé), puis STOP.
Faits : LOT 0 audit ; LOT 1 build esbuild ; LOT 1.1 pnpm unique ; LOT 1.2 workflows ; LOT 2 suppressions/liens (57 tests).
À faire côté GitHub (clics) : Actions → « Générer le verrou pnpm » → Run workflow (crée `source/pnpm-lock.yaml` puis lance le build). Jamais exécuté pour de vrai.
Prochain : LOT 3 = restauration/sauvegardes (audit P0 n°4 dans `LOT-0-ETAT-DES-LIEUX-P5f.md`) : restauration exacte et transactionnelle (valider avant d'écrire, fichiers puis données, rollback), message clair sur sauvegarde « légère ». Puis LOT 4 Drive (dossier retrouvé par id), LOT 5 lecteur PDF/annotations.
Ne pas proposer Figma pour le code (chaîne Figma archivée dans `source/figma-only/`).
