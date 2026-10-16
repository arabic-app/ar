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

L’audio utilise la synthèse vocale du navigateur et une voix arabe disponible sur l’appareil. Aucune répétition de lettres n’est ajoutée au texte pour simuler les voyelles longues. La lecture lente est un réglage de vitesse, pas une garantie de durée phonétique. L’app signale les erreurs et l’absence de voix arabe.

Une voix installée localement peut fonctionner hors ligne ; les voix distantes nécessitent une connexion. La disponibilité et la prononciation dépendent du système. Aucun enregistrement humain validé n’est fourni. Lettres isolées, fragments, shadda et terminaisons peuvent être mal lus. Les contenus et leurs modèles audio nécessitent une validation par un enseignant avant usage comme référence pédagogique. « Amiri Quran » change la police, sans conversion en rasm ʿuthmānī ni enseignement du tajwīd.

Les mots vocalisés et les terminaisons sont présentés pour la lecture liée ; la lecture à la pause peut différer. Les assemblages et fragments ne sont pas tous des mots.

## Structure

- `index.html` : structure et fenêtres natives accessibles.
- `styles.css` : interface responsive, sens RTL, contraste et réduction des animations.
- `learning.mjs` : contenu, validation, sessions et progression.
- `i18n.mjs` : textes et aides dans les trois langues.
- `app.mjs` : affichage, interactions, audio et sauvegarde.
- `sw.js` : cache de l’application ; incrémenter le nom du cache lors des versions publiées.
- `manifest.webmanifest` et icônes : installation.

## Vérifier

`npm test` exécute les tests du modèle d’apprentissage, de validation, de reprise et du service worker. Vérifier également les parcours dans le navigateur : une voix déclenchée ne prouve pas sa justesse phonétique. Les polices Google sont optionnelles et chargées en ligne ; des polices système prennent le relais hors ligne.
