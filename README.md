# Application de Dessin — "Canvas"
Application web de dessin interactif développée entièrement en HTML5, CSS3
et JavaScript vanilla, sans aucun framework ou bibliothèque externe.
# Description
Ce projet est une application de dessin interactive qui s'exécute directement
dans le navigateur. L'utilisateur peut dessiner librement sur un canvas HTML5,
choisir ses couleurs, régler l'épaisseur du trait, utiliser différents outils
et même importer une photo pour dessiner par-dessus.
# Technologies utilisées
| Technologie    | Rôle dans le projet                             |
|----------------|-------------------------------------------------|
| HTML5          | Structure de la page et balise `<canvas>`       |
| CSS3           | Mise en page Flexbox et animations              |
| JavaScript ES5 | Logique de dessin et gestion des événements DOM |
# Fonctionnalités principales
- Dessin libre à main levée sur un canvas HTML5
- Outil **Pinceau** : couleur et épaisseur personnalisables
- Outil **Gomme** : efface des zones précises du dessin
- Dessin de **formes géométriques** : Rectangle, Cercle, Triangle
- **Prévisualisation en temps réel** des formes pendant le tracé
- Sélecteur de couleur natif (`input type="color"`)
- Slider d'épaisseur de 1px à 60px avec affichage en temps réel
- Bouton **Effacer** : remet le canvas à blanc
- Bouton **Sauvegarder** : télécharge le dessin au format PNG avec fond blanc
- Bouton **Importer** : charge une image locale et la place sur le canvas
  pour pouvoir dessiner par-dessus
- Barre de statut : affiche l'outil actif, la taille et les coordonnées
  XY de la souris en temps réel
# Rendu final — GitHub Pages
[Voila ma page web](https://cherif-iheb.github.io/Cherif_Iheb_Application_de_dessin_Canvas/)
# Nouveautés explorées
Durant ce projet, plusieurs notions ont été découvertes et bien maîtrisées :

- **API Canvas 2D** : utilisation de `getContext('2d')`, `beginPath()`,
  `lineTo()`, `stroke()`, `arc()`, `strokeRect()` et
  `globalCompositeOperation` pour gérer les différents outils.
- **Dessin de formes géométriques** : tracer un rectangle avec
  `strokeRect()`, un cercle avec `arc()` et un triangle avec
  `moveTo()` + `lineTo()` + `closePath()`.
- **Prévisualisation des formes** : utilisation de `getImageData()` et
  `putImageData()` pour sauvegarder et restaurer l'état du canvas à
  chaque déplacement de la souris, ce qui permet de voir la forme
  se dessiner en temps réel sans laisser de traces.
  - **Import d'image locale** : utilisation de `FileReader` et
  `readAsDataURL()` pour lire un fichier image depuis l'ordinateur
  et le dessiner sur le canvas avec `drawImage()`.
- **Événements souris** : combinaison de `mousedown`, `mousemove`,
  `mouseup` et `mouseleave` pour un dessin fluide et continu.

# Difficultés rencontrées
**Canvas vide au lancement** : le canvas avait une taille par défaut
   de 300×150px malgré les dimensions définies en CSS.
**Formes qui laissaient des traces** : sans sauvegarde préalable
   du canvas, chaque déplacement de souris ajoutait une nouvelle forme
   par-dessus les précédentes.
**Gomme inefficace** : utiliser `strokeStyle: white` effaçait
   visuellement mais ne rendait pas les pixels vraiment transparents.
# Solutions apportées

**Taille du canvas** : dimensions assignées en JavaScript avec
   `canvas.width` et `canvas.height` en lisant la taille réelle
   de la section parente via `clientWidth` et `clientHeight`.
**Prévisualisation des formes** : utilisation de `getImageData()`
   avant chaque tracé et `putImageData()` à chaque `mousemove`
   pour effacer la forme précédente et redessiner la nouvelle.
**Gomme transparente** : remplacement de la couleur blanche par
   `globalCompositeOperation = 'destination-out'` qui efface
   réellement les pixels du canvas.

# Auteur

**CHERIF Iheb** — Projet de développement web-"Application de Dessin — Canvas"
