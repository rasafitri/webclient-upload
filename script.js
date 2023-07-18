//#region Globale Hilfsvariablen
var displayWidth = 0;  // Breite der Anzeige von Server
var displayHeight = 0; // Höhe der Anzeige von Server

var isValidImage = false; // Flag Bild valid
var isValidText = false;  // Flag Text valid
var isValidColor = true;  // Flag Farbe valid
var isValidMode = false;  // Flag Textmodus valid

var scaledImageDisp = new Image(); // in Anzeigegröße skaliertes Bild
//#endregion

//#region Element imgInput
var imgInput = document.getElementById('imgInput');
imgInput.addEventListener("change", function (e) {
  // bei einer Bildeingabe wird das Bild geladen
  loadImage(e.target.files);
});
//#endregion

//#region Element textToSend
var textSendField = document.getElementById("textToSend");
textSendField.addEventListener("keyup", () => {
  // bei jeder Texteingabe wird die Eingabe ohne führende Leerzeichen
  // und ohne Leerzeichen am Ende geprüft
  var textToSend = textSendField.value.trim();
  if (textToSend.length > 0)
    isValidText = true; // gültiger Text
  else
    isValidText = false; // ungültiger Text
  validityChanged(); // Button Stil ändern
});
//#endregion

//#region Element selColor
var colorPicker = document.getElementById("selColor");
colorPicker.addEventListener("change", () => {
  // bei einer Änderung der ausgewählten Farbe wird die ausgewählte Farbe
  // in RGB als eine Variable gespeichert und geprüft, schwarz ist unzulässig
  // Anzeige schwarz (0,0,0) = LED aus
  var rgbValue = hexToRGB(colorPicker.value);
  if (rgbValue[0] == 0 && rgbValue[1] == 0 && rgbValue[2] == 0)
    isValidColor = false; // schwarz, Farbe ungültig
  else
    isValidColor = true; // alle anderen Farben sind ok
  validityChanged(); // Button Stil ändern
});
//#endregion

//#region Element textMode
var textModeField = document.getElementById("textMode");
textModeField.addEventListener("change", function () {
  // Bei der Änderung der ausgewählten Textmodus wird die Eingabe geprüft
  if (textModeField.value == " ")
    isValidMode = false; // Leerauswahl ist keine gültige Eingabe
  else
    isValidMode = true; // gültige Textmodus
  validityChanged(); // Button Stil ändern
});
//#endregion

//#region Element dropArea
var dropArea = document.getElementById('dropArea');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  // preventDefaults dropArea bei allen Aktionen
  dropArea.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
  // dropArea highlight bei Aktion dragenter oder dragover
  dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  // dropArea unhighlight bei Aktion dragleave oder drop
  dropArea.addEventListener(eventName, unhighlight, false);
});

// handle Eingabe bei Aktion drop
dropArea.addEventListener('drop', handleDrop, false);

function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

function highlight() {
  dropArea.classList.add('highlight');
}

function unhighlight() {
  dropArea.classList.remove('highlight');
}

function handleDrop(event) {
  // bei Aktion drop wird die Datei geladen,
  // es darf aber nur ein Bild geladen werden
  var files = event.dataTransfer.files;
  if (files.length !== 1) {
    alert("Bitte nur ein Bild eingeben!");
    return;
  }

  loadImage(files);
}
//#endregion

//#region Element imgUploadButton
var imgUploadButton = document.getElementById("imgUploadButton");
function handleUploadImg() {
  // Beim Klick des Buttons "Bild Hochladen" wird das skalierte Bild
  // in ein C Code Array umgewandelt, damit es angezeigt werden kann
  var canvas = document.createElement('canvas');
  canvas.width = scaledImageDisp.width;
  canvas.height = scaledImageDisp.height;

  var ctx = canvas.getContext('2d');

  ctx.drawImage(scaledImageDisp, 0, 0);

  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var pixelData = imageData.data;

  var hexArray = [];
  for (var i = 0; i < pixelData.length; i += 4) {
    var r = pixelData[i];
    var g = pixelData[i + 1];
    var b = pixelData[i + 2];

    var uint16Value = ((r & 0x1F) << 11) | ((g & 0x3F) << 5) | (b & 0x1F);
    var hexValue = uint16Value.toString(16).toUpperCase().padStart(4, '0');
    hexArray.push('0x' + hexValue);
  }

  // das C Code Array wird mit der Größe des Bilds 
  // in JSON Format als HTTP POST Request gesendet
  // Bei einer Response wird diese als Meldung angezeigt

  var cCodeArray = {
    values: [],
    size: [canvas.width, canvas.height]
  };

  for (var i in hexArray) {
    cCodeArray.values.push(hexArray[i]);
  }
  console.log(cCodeArray);

  fetch('./image', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(cCodeArray)
  })
    .then(response => response.text())
    .then(data => {
      alert(data);
    })
    .catch(error => {
      alert('Error:', error);
    });

  // Zurücksetzen der HTML Seite, dass kein Bild mehr angezeigt wird und der Button ausgegraut wird
  dropArea.innerHTML = '<div class="container">\n<p class="centered-paragraph">Bild hierher ziehen...</p>\n</div>';
  isValidImage = false;
  validityChanged();
}
//#endregion

//#region Element txtUploadButton
var txtUploadButton = document.getElementById("txtUploadButton");
function handleUploadTxt() {
  // Beim Klick des Buttons "Text Hochladen" wird der eingegebene Text
  // mit der kompletten Einstellung in JSON Format als HTTP POST Request gesendet
  // Bei einer Response wird diese als Meldung angezeigt
  var textSetup = {
    value: textSendField.value,
    color: hexToRGB(colorPicker.value),
    mode: textModeField.value
  };

  console.log(JSON.stringify(textSetup));

  fetch('./text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(textSetup)
  })
    .then(response => response.text())
    .then(data => {
      alert(data);
    })
    .catch(error => {
      alert('Error:', error);
    });

  // Zurücksetzen der HTML Seite, dass der Button ausgegraut wird
  isValidText = false;
  isValidMode = false;
  validityChanged();
}
//#endregion

//#region helfende Funktionen
function loadImage(files) {
  var imgFile = files[0];
  if (imgFile.type.startsWith('image/')) {
    // Es ist eine Bilddatei, beim Laden des Bilds wird das Bild skaliert
    var reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.onload = function () {
      var image = new Image();
      image.src = reader.result;
      image.onload = function () {
        scaledImageDisp = scaleImage(image, displayWidth, displayHeight); // skaliertes Bild für die LED-Anzeige
        // skaliertes Bild für die Anzeige in der dropArea
        var scaledImage = scaleImage(image, dropArea.getBoundingClientRect().width - 40, dropArea.getBoundingClientRect().height - 40);
        // zeigt das skalierte Bild in der dropArea an und setzt den Button wieder frei
        dropArea.innerHTML = '';
        dropArea.appendChild(scaledImage);
        isValidImage = true;
        validityChanged();
      };
    };
  } else {
    // Es ist keine Bilddatei, Fehlermeldung anzeigen
    alert("Falsche Datei! Bitte ein Bild eingeben!");
  }
}

function scaleImage(image, maxWidth, maxHeight) {
  // Skalieren des Bilds in die gewünschte Größe,
  // falls das Bild größer ist, sonst wird nicht verkleinert
  var width = image.width;
  var height = image.height;

  if (width > maxWidth || height > maxHeight) {
    var scale = Math.min(maxWidth / width, maxHeight / height);

    var canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;

    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    var scaledImage = new Image();
    scaledImage.src = canvas.toDataURL();

    return scaledImage;
  }
  else
    return image;
}

function hexToRGB(hexValue) {
  // Umwandlung Farben von Hex Werten in RGB Werte
  return ['0x' + hexValue[1] + hexValue[2] | 0, '0x' + hexValue[3] + hexValue[4] | 0, '0x' + hexValue[5] + hexValue[6] | 0];
}

function validityChanged() {
  // Bild hochladen nur möglich, wenn die eingegebene Datei valid ist
  if (isValidImage)
    imgUploadButton.disabled = false;
  else
    imgUploadButton.disabled = true;

  // Text hochladen nur möglich, wenn der Text, die Farbe und der Modus valid sind
  if (isValidText && isValidColor && isValidMode)
    txtUploadButton.disabled = false;
  else
    txtUploadButton.disabled = true;
}

function onPageLoad() {
  // Beim Laden der Seite wird eine GET SIZE Request gesendet
  // der Server schickt dann als Response die Größe der LED-Anzeige zurück
  // Bei einem Fehler wird der Nutzer benachrichtigt
  fetch('./size')
    .then(response => response.json())
    .then(data => {
      displayWidth = data.size[0];
      displayHeight = data.size[1];
      console.log("Displaygröße ist: " + displayWidth + "x" + displayHeight);
    })
    .catch(error => {
      console.error('Error:', error);
      displayWidth = 32;
      displayHeight = 32;
      alert("Es ist ein Fehler passiert! Bitte laden Sie die Seite neu!")
    });
}
//#endregion