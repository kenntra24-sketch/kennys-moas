# RETOURS UTILISATEUR + EMPLOI DU TEMPS RÉEL (30/09/2026)

Ce fichier remplace la photo (l'IA suivante ne la verra pas). Il sert de **cahier des charges réel** pour les pièces 2b, 3, 4, 5, 6 et 7.

## 1. Emploi du temps réel — Lycée Moderne Goffry Kouassi Raymond (Sassandra, Côte d'Ivoire), 2ᵉ cycle, année 2026-2027

Classe **TA1**, salle **D'2**, professeur principal : non renseigné. Photo coupée à gauche : « TA1 » = très probablement Terminale A1.
Transcription faite à la main depuis une photo penchée : les cases marquées (?) sont à faire confirmer par l'utilisateur.

### Créneaux (ce ne sont PAS des heures rondes)
| Code | Horaire | | Code | Horaire |
|---|---|---|---|---|
| M1 | 07h15–08h10 | | S1 | 14h00–15h00 |
| M2 | 08h10–09h05 | | S2 | 15h00–16h00 |
| M3 | 09h05–10h00 | | S3 | 16h00–17h00 |
| *pause* | 10h00–10h15 | | S4 | 17h00–18h00 |
| M4 | 10h15–11h10 | | | |
| M5 | 11h10–12h05 | | | |
| M6 | 12h05–13h00 | | | |

Matin : créneaux de 55 min + une pause de 15 min. Après-midi : créneaux de 60 min. Pause déjeuner 13h00–14h00.

### Grille (les cases fusionnées sont notées « ↕ N créneaux »)
| | Lundi | Mardi | Mercredi | Jeudi | Vendredi |
|---|---|---|---|---|---|
| M1 | H.G | H.G | MATHS ↕ M1-M2 | FRAN | PHILO ↕ M1-M2 (?) |
| M2 | PHILO ↕ M2-M3 | PHILO ↕ M2-M3 | (MATHS) | SVT | (PHILO) |
| M3 | (PHILO) | (PHILO) | ESP | ESP | ESP |
| M4 | MATHS ↕ M4-M5 | FRAN ↕ M4-M5 | SVT | FRAN | H.G ↕ M4-M5 |
| M5 | (MATHS) | (FRAN) | PHILO ↕ M5-M6 | MATHS | (H.G) |
| M6 | ANG | ANG | (PHILO) | ANG | AP |
| S1-S2 | vide | DEVOIR ↕ S1-S4 (?) | vide | vide | vide |
| S3-S4 | EPS ↕ S3-S4 (?) | (DEVOIR) | vide | vide | vide |

Points d'incertitude : durée exacte du PHILO du vendredi matin (M1-M2 ou M1-M3) ; début de « DEVOIR » du mardi (S1 ou S2) ; « EPS » du lundi sur S3-S4 ou S3 seul.

### Abréviations → matières
H.G = Histoire-Géographie · FRAN = Français · MATHS = Mathématiques · PHILO = Philosophie · ANG = Anglais · ESP = Espagnol · SVT · EPS · AP = Arts plastiques (ligne « AP/Musique ») · DEVOIR = plage d'étude / devoir surveillé (pas une matière).

### Tableau « matière → professeur » imprimé sur la feuille
Allemand (vide) · Anglais : COULIBALY Al. · AP/Musique : KASSE · Espagnol : KOUAKOU R. · Français : BOLA BI · Histoire-Géo : GNABA · Mathématiques : SIDIBE · EPS : DJIRO FAE A. Gabriel · Physique-Chimie (vide) · SVT : KONAN KONAN · EDHC (vide) · Entrepreneuriat (vide).
Colonnes prévues mais vides : « Volume horaire », « Observations ». Mention « Le Proviseur » en bas à droite.

## 2. Ce que ça implique pour l'appli (état actuel → besoin)
- **Grille actuelle** : `HOURS = ['08h'…'17h']`, une cellule = un jour + une heure ronde, sans fin ni durée → **ne peut pas représenter** ce document (créneaux 07h15–08h10, pause, blocs sur 2-3 créneaux).
- **Modèle cible (pièce 5)** : `slots: {id, label, start, end, kind:'cours'|'pause'}[]` libres et modifiables ; `blocks: {day, slotStart, span, subject, room?, teacher?}[]` ; modèles multiples (semaine A/B, période d'examens) ; export `.ics`.
- **Matières** : ajouter au socle Espagnol, AP/Musique, EDHC, Entrepreneuriat ; « Histoire-Géo » en une seule matière (ou deux, au choix de l'utilisateur) ; abréviations (H.G, FRAN, ANG…) reconnues à la saisie ; **professeur par matière** (nom, facultatif) + **volume horaire** calculé à partir de la grille.
- **Classes** : la liste actuelle propose « Terminale A / C / D » ; il faut pouvoir saisir **A1, A2** (classe personnalisée existe déjà : la proposer plus visiblement).
- **Créneau « Devoir »** : type de bloc spécial (étude), relié à la liste des devoirs.
- **Alarmes/rappels** demandés : rappel avant chaque cours (« n'oublie pas… »), rappel de devoir la veille, rappel personnalisé lié à un créneau. Contrainte honnête : une PWA ne peut pas sonner de façon fiable app fermée sans notifications push → proposer notifications locales + `.ics` (le téléphone sonne lui-même).

## 3. Retours de l'utilisateur (30/09/2026) et pièce qui les traite
| Retour | Pièce | Note d'honnêteté |
|---|---|---|
| Lecteur : pas de **mode défilement** | 4 | Confirmé : le lecteur affiche UNE page à la fois (boutons page précédente/suivante). |
| Lecteur : **sélectionner/copier** impossible | 4 | La couche de texte existe (1 zone de texte détectée sur un PDF de test), mais l'utilisateur ne peut pas sélectionner : à reproduire sur un vrai PDF (scans = pas de texte, normal) et à améliorer (sélection sur toute la page, bouton Copier visible, menu contextuel tactile). |
| Lecteur : **surligner** | 4 | Confirmé : aucun surlignage n'existe. À faire avec le magasin `annot`, couleurs, lien vers une Remarque (`Link.page`). |
| « Tous les documents sont lisibles » = faux | 4 | **Confirmé** : seuls PDF et images s'affichent. Word/Excel/PowerPoint/texte affichent « Ce type de fichier ne peut pas être affiché ». Le texte de l'interface promet plus que le code ne fait → corriger le texte immédiatement (pièce 2b) et ajouter les lecteurs (txt/docx d'abord, pièce 4). |
| Import : **demander ce que c'est AVANT d'ajouter** + **plus d'options d'ajout** | 3 | Déjà fait en P1 pour le fichier importé (question avant l'écriture). À étendre : « Ajouter » = Fichier · Photo/scan (caméra) · Note texte · Lien web · Dossier ; choix de la matière dans le même écran. |
| **Icônes** de navigation moches | 2b | Remplacer le jeu d'icônes (cohérent, plus expressif, couleur par section). |
| **Plus de statistiques** | 6 | Moyennes par matière/période, courbe d'évolution, temps de révision, régularité, points faibles issus des Remarques. |
| **Plus de méthodes de révision**, mieux expliquées | 7 | Pomodoro, répétition espacée (déjà), rappel actif, technique Feynman, cartes mémoire, mind map, entrelacement, méthode des lieux, plan de révision avant examen. Chaque méthode : à quoi ça sert, comment faire en 3 étapes, durée conseillée, bouton « Lancer ». À vérifier avec des sources fiables avant d'écrire. |
| Site plus **intelligent** et plus **beau** | 2b-8 | Idées : révision suggérée du jour (Remarques dues + matières faibles), alerte « contrôle dans 3 jours », bilan de la semaine. |
| **Personnalisation** | 2b/2c | Existe déjà (couleurs, polices) ; à étendre aux matières (couleur, icône). |
| **Alarmes/rappels** | 5 | Voir §2. |
