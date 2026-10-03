# Chaîne Figma / Vite — ARCHIVÉE, hors production

Ces fichiers viennent de l'environnement Figma Make (`vite.config.ts` importe `./.figma/make/site.json` et des plugins Figma, absents d'un clone normal).
**`vite build` ne peut pas fonctionner depuis ce dépôt** : ce n'est PAS la chaîne de production.

La chaîne officielle est le build esbuild (`pnpm run build` dans `source/`). Voir `README.md` à la racine.
Conservés ici par prudence (historique) ; ils peuvent être supprimés sans effet sur l'application.

`pnpm-lock.ARCHIVE-figma-obsolete.yaml` est le verrou de CETTE ancienne chaîne (react 19.2.4, Vite 8…). Il ne correspond plus au projet et n'est PAS le verrou officiel (celui-ci est `source/pnpm-lock.yaml`). Il a été renommé pour qu'on ne le confonde jamais avec lui.
