# Citylab Berlin Summer School 2023
## Webclient - HTML Seite für Interaktion mit Server

### Getting Started
- Visual Studio Code installieren und einrichten
    
    [Visual Studio Code](https://code.visualstudio.com/download)
    
    Dazu benötigen wir den [Live Server](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server), um das Programmieren und das Testen zu vereinfachen.
    
- Repository clonen / als .zip herunterladen
    
- Code Erklärung - Wichtige Funktionen
    
    ```
    function onPageLoad(): // sendet GET Size beim Laden, das muss auskommentiert werden beim Testen, funktioniert nur in Verbindung mit dem Server.
    
    function prepareSendImg(): // wird ausgeführt, wenn der Benutzer den Button "Bild hochladen" klickt. Bereitet das Bild auf und sendet es mit fetch.
    
    function prepareSendTxt(): // wird ausgeführt, wenn der Benutzer den Button "Text hochladen" klickt. Bereitet den Text auf und sendet es mit fetch.
    
    function loadImage(files): // wird ausgeführt, wenn der Benutzer eine Datei hochgeladen hat. 
    													 // Die Eingabe wird dann plausibilisiert und die Anzeige wird angepasst.
    
    async function processImages(): // Bildaufbereitung wenn es mehrere Bilder gibt
    
    function processGif(): // Bildaufbereitung wenn es um eine Gif Datei handelt
    
    function processImg(file): // Diese Funktion triggert "convertImgToCCodeSize" und gibt eine Fehlermeldung, wenn es fehlgeschlagen ist.
    
    function convertImgToCCodeSize(image): // Diese Funtion verkleinert das Bild bei Bedarf und wandelt es in C Code Array um.
    
    function hexToRGB(hexValue): //Diese Funktion wandelt Farben von HEX Werten in RGB Werte.
    ```
    
    <aside>
    :warning: Da die Webseite nicht der Schwerpunkt dieses Themas ist, gibt es hier keine Anleitung. Sie können das gesamte Code übernehmen oder Ihr Eigenes kreieren. Melden Sie sich wenn Sie Hilfe brauchen.
    
    </aside>