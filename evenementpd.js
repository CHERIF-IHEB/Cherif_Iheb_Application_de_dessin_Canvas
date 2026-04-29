//REFERENCES DOM
var canvas = document.getElementById("canv");
var contexte = canvas.getContext("2d");
var epSlider = document.getElementById("epSlider");
var epVal = document.getElementById("epVal");
var colorPicker = document.getElementById("colorPicker");
var formSelect = document.getElementById("formSelect");
var btnPinceau = document.getElementById("btnPinceau");
var btnGomme = document.getElementById("btnGomme");
var btnEffacer = document.getElementById("btnEffacer");
var btnSauvegarder = document.getElementById("btnSauvegarder");
var statusTool = document.getElementById("statusTool");
var statusSize = document.getElementById("statusSize");
var statusPos = document.getElementById("statusPos");
var btnImporter = document.getElementById("btnImporter");
var fileInput = document.getElementById("fileInput");

//ADAPTER LA TAILLE DU CANVAS A LA SECTION s2
var section = document.getElementById("s2");
canvas.width = section.clientWidth - 36; //largeur -padding
canvas.height = section.clientHeight - 36; //hauteur-padding

//VARIABLES D'ETAT
var enTrainDeDessiner = false;
var outil = "pinceau"; // outil actif : 'pinceau' ou 'gomme'

//SLIDER EPAISSEUR
epSlider.addEventListener("input", function () {
  epVal.textContent = epSlider.value;
  statusSize.textContent = "Taille : " + epSlider.value + "px";
});

//BOUTON PINCEAU
btnPinceau.addEventListener("click", function () {
  outil = "pinceau";
  statusTool.textContent = "Outil : Pinceau";
  btnPinceau.style.outline = "2px solid white"; //pinceau actif
  btnGomme.style.outline = "none"; //gomme non actif
});

//BOUTON GOMME
btnGomme.addEventListener("click", function () {
  outil = "gomme";
  statusTool.textContent = "Outil : Gomme";
  btnGomme.style.outline = "2px solid white"; //gomme actif
  btnPinceau.style.outline = "none"; //pinceau non actif
});

//BOUTON EFFACER
btnEffacer.addEventListener("click", function () {
  contexte.clearRect(0, 0, canvas.width, canvas.height);
});

//BOUTON SAUVEGARDER
btnSauvegarder.addEventListener("click", function () {
  // canvas temporaire avec fond blanc pour le PNG
  var tmp = document.createElement("canvas");
  tmp.width = canvas.width;
  tmp.height = canvas.height;
  var tc = tmp.getContext("2d");
  tc.fillStyle = "#ffffff";
  tc.fillRect(0, 0, tmp.width, tmp.height);
  tc.drawImage(canvas, 0, 0);

  var lien = document.createElement("a");
  lien.download = "dessin.png";
  lien.href = tmp.toDataURL("image/png");
  lien.click();
});

//BOUTON IMPORTER UNE PHOTO
// Le bouton déclenche le input file caché
btnImporter.addEventListener("click", function () {
  fileInput.click();
});
// Quand l'utilisateur choisit une image depuis son ordinateur
fileInput.addEventListener("change", function () {
  var fichier = fileInput.files[0]; // récupérer le fichier choisi
  if (!fichier) return;

  var reader = new FileReader(); // lire le fichier localement

  reader.onload = function (e) {
    var img = new Image();
    img.src = e.target.result; // données de l'image en base64

    img.onload = function () {
      // Effacer le canvas puis dessiner l'image dessus
      contexte.clearRect(0, 0, canvas.width, canvas.height);
      contexte.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };
  reader.readAsDataURL(fichier); // lire l'image comme URL base64
  fileInput.value = ""; // réinitialiser pour pouvoir importer à nouveau
});

//CHANGEMENT DE FORME
formSelect.addEventListener("change", function () {
  outil = formSelect.value; // 'libre', 'rectangle', 'cercle', 'triangle'
  statusTool.textContent = "Outil : " + formSelect.value;
});
//appliquer le style du contexte
function appliquerStyle() {
  contexte.lineWidth = epSlider.value;
  contexte.lineCap = "round";
  contexte.lineJoin = "round";
  if (outil === "gomme") {
    contexte.globalCompositeOperation = "destination-out";
    contexte.strokeStyle = "rgba(0,0,0,1)";
  } else {
    contexte.globalCompositeOperation = "source-over";
    contexte.strokeStyle = colorPicker.value;
    contexte.fillStyle = colorPicker.value;
  }
}

//DEBUT DU DESSIN (clic enfoncé)
var debutX = 0;
var debutY = 0;
var snapshotAvantForme = null;
var dernierEtat = null;
var dernierX = 0;
var dernierY = 0;

canvas.addEventListener("mousedown", function (e) {
  enTrainDeDessiner = true;
  dernierEtat = contexte.getImageData(0, 0, canvas.width, canvas.height);
  debutX = e.offsetX;
  debutY = e.offsetY;

  if (outil === "libre" || outil === "pinceau" || outil === "gomme") {
    contexte.beginPath();
    contexte.moveTo(debutX, debutY);
  } else {
    // sauvegarder le canvas avant de dessiner la forme
    snapshotAvantForme = contexte.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );
  }
});
//DESSIN EN COURS (souris qui bouge)
canvas.addEventListener("mousemove", function (e) {
  statusPos.textContent = "X: " + e.offsetX + "  Y: " + e.offsetY;
  dernierX = e.offsetX;
  dernierY = e.offsetY;
  if (!enTrainDeDessiner) return;

  var x = e.offsetX;
  var y = e.offsetY;

  appliquerStyle();

  if (outil === "libre" || outil === "pinceau" || outil === "gomme") {
    contexte.lineTo(x, y);
    contexte.stroke();
    contexte.beginPath();
    contexte.moveTo(x, y);
  } else if (outil === "rectangle") {
    contexte.putImageData(snapshotAvantForme, 0, 0);
    contexte.beginPath();
    contexte.strokeRect(debutX, debutY, x - debutX, y - debutY);
  } else if (outil === "cercle") {
    contexte.putImageData(snapshotAvantForme, 0, 0);
    var rayon = Math.sqrt(Math.pow(x - debutX, 2) + Math.pow(y - debutY, 2));
    contexte.beginPath();
    contexte.arc(debutX, debutY, rayon, 0, 2 * Math.PI);
    contexte.stroke();
  } else if (outil === "triangle") {
    contexte.putImageData(snapshotAvantForme, 0, 0);
    contexte.beginPath();
    contexte.moveTo(debutX, debutY);
    contexte.lineTo(x, y);
    contexte.lineTo(debutX - (x - debutX), y);
    contexte.closePath();
    contexte.stroke();
  }
});
//RACCOURCIS CLAVIER
document.addEventListener("keydown", function (e) {
  // Ne pas déclencher si l'utilisateur tape dans un champ input
  if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;

  switch (e.key.toLowerCase()) {
    // B → Pinceau
    case "b":
      outil = "pinceau";
      formSelect.value = "libre";
      statusTool.textContent = "Outil : Pinceau";
      btnPinceau.style.outline = "2px solid white";
      btnGomme.style.outline = "none";
      break;

    // E → Gomme
    case "e":
      outil = "gomme";
      statusTool.textContent = "Outil : Gomme";
      btnGomme.style.outline = "2px solid white";
      btnPinceau.style.outline = "none";
      break;

    // S → Sauvegarder
    case "s":
      btnSauvegarder.click();
      break;

    // Suppr ou Backspace → Effacer tout
    case "delete":
    case "backspace":
      contexte.clearRect(0, 0, canvas.width, canvas.height);
      break;

    // + → Augmenter taille
    case "+":
    case "=":
      epSlider.value = Math.min(60, parseInt(epSlider.value) + 2);
      epVal.textContent = epSlider.value;
      statusSize.textContent = "Taille : " + epSlider.value + "px";
      break;

    // - → Diminuer taille
    case "-":
      epSlider.value = Math.max(1, parseInt(epSlider.value) - 2);
      epVal.textContent = epSlider.value;
      statusSize.textContent = "Taille : " + epSlider.value + "px";
      break;
    case "z": // retour etape precedente cntrl Z
      if (e.ctrlKey && dernierEtat) {
        contexte.putImageData(dernierEtat, 0, 0);
      }
      break;
  }
});

//FIN DU DESSIN
canvas.addEventListener("mouseup", function () {
  enTrainDeDessiner = false;

  var remplir = document.getElementById("remplir").checked;

  // Remplir seulement pour les formes géométriques
  if (outil === "rectangle") {
    if (remplir) {
      contexte.fillRect(debutX, debutY, canvas.width, canvas.height);
    }
  }

  // la forme en fill au mouseup
  if (remplir && snapshotAvantForme) {
    contexte.putImageData(snapshotAvantForme, 0, 0);
    appliquerStyle();

    if (outil === "rectangle") {
      contexte.beginPath();
      contexte.fillRect(debutX, debutY, dernierX - debutX, dernierY - debutY);
    } else if (outil === "cercle") {
      var rayon = Math.sqrt(
        Math.pow(dernierX - debutX, 2) + Math.pow(dernierY - debutY, 2)
      );
      contexte.beginPath();
      contexte.arc(debutX, debutY, rayon, 0, 2 * Math.PI);
      contexte.fill();
    } else if (outil === "triangle") {
      contexte.beginPath();
      contexte.moveTo(debutX, debutY);
      contexte.lineTo(dernierX, dernierY);
      contexte.lineTo(debutX - (dernierX - debutX), dernierY);
      contexte.closePath();
      contexte.fill();
    }
  }

  contexte.beginPath();
});

canvas.addEventListener("mouseleave", function () {
  enTrainDeDessiner = false;
  contexte.beginPath();
});
