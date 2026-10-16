# Nour — L’arabe, pas à pas

Application statique, sans compte, sans dépendance de production et sans étape de compilation.

## Démarrer

Depuis ce dossier, lancer `npm start`, puis ouvrir http://127.0.0.1:8765. Un hébergement statique HTTPS suffit pour la publication. L’ouverture directe du fichier HTML ne permet pas de charger les modules et le service worker.

## Fonctionnalités

- Neuf étapes : alphabet, voyelles courtes, formes en contexte, assemblages, voyelles longues, sukūn, shadda, tanwīn et mots.
- 168 cartes dont les 28 lettres de l’alphabet ; vocabulaire du quotidien et vocabulaire à orientation coranique conservé depuis l’application initiale.
- Pratique libre, indices, précédent, autoévaluation, liste de révision et bilan de séance.
- Préférences, progression et séance active conservées localement. Aucun compte ni microphone.
- Français, anglais et arabe, interface adaptée de droite à gauche.
- Saisie personnalisée avec clavier arabe et validation ; les cartes personnelles ne modifient pas la progression.
- Installation PWA, cache local de l’application après la première visite en ligne, fonctionnement des exercices hors ligne.

## Audio et contenu pédagogique

L’app retrouve le moteur Google Translate TTS de sa version initiale. Le texte est envoyé au service uniquement lors d’un clic sur Écouter. Une connexion est nécessaire pour un son inédit ; les sons déjà chargés sont mis en cache (128 fichiers maximum). La voix dépend du service Google et non des voix installées sur l’appareil.

Les assemblages de deux lettres sont transmis en une seule requête et joués dans un seul fichier, avec leurs voyelles, sans séparation ni pause ajoutée : `تُبِ` reste `تُبِ`.

Le traitement historique des voyelles longues est rétabli dans le texte destiné au moteur uniquement : la carte `بَا` reste affichée ainsi, tandis que le moteur reçoit `بَااا`. Il s’agit d’une adaptation empirique à cette voix, pas d’une règle d’orthographe ni d’une garantie de durée phonétique. La vitesse normale est 1× ; 0,75× reste disponible à la demande.

Pour les lettres isolées avec tanwīn, le son final est explicité : `تٍ` utilise `تِنْ`, `تٌ` utilise `تُنْ`, `تً` utilise `تَنْ`. Le nom lām utilise `لَامْ`. Ces adaptations ne modifient pas l’affichage de la carte. Aucune reconnaissance du microphone ni validation automatique de la prononciation n’est réalisée.

La pratique libre retrouve les tirages aléatoires de lettres vocalisées et de leurs formes, les assemblages et les mots, sans limite de séance ni autoévaluation imposée. Elle ne modifie pas la progression du parcours guidé. Les 200 derniers tirages de la visite sont accessibles avec Précédent ; le numéro total du tirage continue d’augmenter.

Les contenus synthétiques nécessitent une validation à l’écoute par un enseignant. « Amiri Quran » change la police, sans conversion en rasm ʿuthmānī ni enseignement du tajwīd. La lecture à la pause des terminaisons peut différer de la lecture liée. Les assemblages ne sont pas tous des mots.

## Structure

- `index.html` : structure et fenêtres natives accessibles.
- `styles.css` : interface responsive, sens RTL, contraste et réduction des animations.
- `learning.mjs` : contenu, validation, sessions et progression.
- `i18n.mjs` : textes et aides dans les trois langues.
- `app.mjs` : affichage, interactions, audio et sauvegarde.
- `audio.mjs` : préparation des requêtes Google et adaptations phonétiques des fragments.
- `free.mjs` : générateur aléatoire et formes positionnelles de la pratique libre.
- `sw.js` : cache de l’application ; incrémenter le nom du cache lors des versions publiées.
- `manifest.webmanifest` et icônes : installation.

## Vérifier

`npm test` exécute les tests du modèle d’apprentissage, de validation, de reprise et du service worker. Vérifier également les parcours dans le navigateur : une voix déclenchée ne prouve pas sa justesse phonétique. Les polices Google sont optionnelles et chargées en ligne ; des polices système prennent le relais hors ligne.
