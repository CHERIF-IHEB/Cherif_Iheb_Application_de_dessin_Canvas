//REFERENCES DOM
var canvas = document.getElementById("canv");
var contexte = canvas.getContext("2d");
var epSlider = document.getElementById("epSlider");
var epVal = document.getElementById("epVal");
var colorPicker = document.getElementById("colorPicker");
var btnPinceau = document.getElementById("btnPinceau");
var btnGomme = document.getElementById("btnGomme");
var btnEffacer = document.getElementById("btnEffacer");
var btnSauvegarder = document.getElementById("btnSauvegarder");
var statusTool = document.getElementById("statusTool");
var statusSize = document.getElementById("statusSize");
var statusPos = document.getElementById("statusPos");

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

//DEBUT DU DESSIN (clic enfoncé)
canvas.addEventListener("mousedown", function (e) {
  enTrainDeDessiner = true;
  contexte.beginPath();
  contexte.moveTo(e.offsetX, e.offsetY);
});

//DESSIN EN COURS (souris qui bouge)
canvas.addEventListener("mousemove", function (e) {
  // mettre à jour les coordonnées dans le footer
  statusPos.textContent = "X: " + e.offsetX + "  Y: " + e.offsetY;

  if (!enTrainDeDessiner) return;

  if (outil === "gomme") {
    // gomme : effacer
    contexte.globalCompositeOperation = "destination-out";
    contexte.strokeStyle = "rgba(0,0,0,1)";
  } else {
    // pinceau : dessiner
    contexte.globalCompositeOperation = "source-over";
    contexte.strokeStyle = colorPicker.value;
  }

  contexte.lineWidth = epSlider.value;
  contexte.lineCap = "round";
  contexte.lineJoin = "round";

  contexte.lineTo(e.offsetX, e.offsetY);
  contexte.stroke();
  contexte.beginPath();
  contexte.moveTo(e.offsetX, e.offsetY);
});

//FIN DU DESSIN
canvas.addEventListener("mouseup", function () {
  enTrainDeDessiner = false;
  contexte.beginPath();
});

canvas.addEventListener("mouseleave", function () {
  enTrainDeDessiner = false;
  contexte.beginPath();
});
