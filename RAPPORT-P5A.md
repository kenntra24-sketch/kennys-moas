# RAPPORT-P5A — Pièce 5, sous-pièce a (emploi du temps de classe TA1)

## Fait
- **Nouveau modèle** `src/lib/timetable.ts` : créneaux libres `{id,label,start,end,kind:'cours'|'pause'}` (pas des heures rondes) + blocs `{day,slot,span,subject,kind,room,teacher,uncertain}` pouvant couvrir plusieurs créneaux. Stocké dans une NOUVELLE clé `me:<classe>:timetable` : l'ancienne « Semaine type » (`schedule`, `extraHours`, `hiddenHours`, `hiddenDays`) n'est ni modifiée ni supprimée (onglet renommé « Semaine type (ancien) »). Pas de migration nécessaire ; inclus automatiquement dans les sauvegardes (`me:*`).
- **Modèle TA1** (Lycée Moderne Goffry Kouassi Raymond, salle D'2) : M1–M6 (07h15–13h00, 55 min), récréation 10h00–10h15, pause déjeuner, S1–S4 (14h00–18h00, 60 min), 5 jours, blocs fusionnés, professeurs par matière. Grille vide aux mêmes horaires disponible. Matières manquantes ajoutées (jamais remplacées) : Histoire-Géographie, Espagnol, AP / Musique.
- **Écran** `views/ClassTimetable.tsx` (onglet « Emploi du temps » de la page Emploi du temps) : cases fusionnées, pauses, étude hachurée, icône+couleur des matières, volume horaire par matière calculé, édition d'une case (matière, durée limitée par les pauses/autres cours, salle, professeur, retirer avec Annuler), confirmation des cases incertaines, « Effacer » annulable. Zones tactiles ≥ 44 px.
- **Cases à confirmer (3, marquées « ? »)** : PHILO du vendredi (lu M1-M2), DEVOIR du mardi (lu S1–S4), EPS du lundi (lu S3-S4). Non confirmées par l'utilisateur.
- Petit correctif : coefficients par défaut pour les classes A1/A2 (avant : retombaient sur la table « Seconde »).

## Vérifié (commandes réellement lancées)
- `tsx tests/p5.test.ts` → 8 tests, 8 réussis (pas de chevauchement, aucun bloc ne traverse une pause, durées 55/15/60 min, volumes horaires, `maxSpan`, `blockAt`).
- `tsx tests/p1.test.ts` → 14/14. `node tools/verify-sync.mjs` → OK.
- Chromium (Playwright) desktop 1280 px + téléphone 390 px : création du modèle, confirmation d'une case « ? » (3 → 2), rechargement (données conservées), matières ajoutées, 0 erreur console. Captures examinées.

## Pas fait / limites
- **5b à faire** : plusieurs emplois du temps (créer/dupliquer/renommer/choisir l'actif), modifier les horaires des créneaux dans l'interface, semaines A/B, jours supplémentaires, **rappels/alarmes**, **export .ics** et envoi Google Agenda à partir de ce nouveau modèle (l'export actuel lit encore l'ancienne « Semaine type »), affichage du cours du jour sur le tableau de bord.
- La classe active reste « Première A » tant que l'utilisateur ne la change pas (Réglages) ; le modèle TA1 est lié à la classe active.
- « Histoire-Géographie » a été ajoutée à côté de « Histoire » et « Géographie » existantes : regrouper avec le bouton ⇢ des Réglages si souhaité.
- Safari/iOS non testé ; flux Google non testé. `pnpm build`/`tsc` non lancés (registre bloqué).
- Transcription faite à la main depuis une photo penchée : le professeur de Philosophie n'était pas lisible (laissé vide).

## Fichiers modifiés
`src/lib/timetable.ts` (nouveau), `src/views/ClassTimetable.tsx` (nouveau), `src/views/Schedule.tsx`, `src/lib/model.ts`, `src/lib/store.ts`, `src/index.css`, `tests/p5.test.ts` (nouveau), `public/sw.js` (cache v20), `sw.js`, `package.json` (1.5.0-p5a), `app.js`, `app.css`, `docs/REPRISE.md`, `CHANGELOG.md`.
