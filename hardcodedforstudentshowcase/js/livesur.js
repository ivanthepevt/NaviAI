//Modifying the parameters
var confidenceThreshold = 0.75;
var similarityThreshold = 0.60;

var lookFoward = 0; 
var lookBack = 4;

var lineState = -1;

function updateState() {
    currentLine = lineScript[lineState][0];
    nextLine = lineScript[lineState+1][0];
    surtitle.innerHTML = lineScript[lineState][1];
    caption.innerHTML = lineScript[lineState][2];
    backgroundImagestring = "url(images/" + lineScript[lineState][3] + ".png)";
    document.body.style.backgroundImage = backgroundImagestring;
    applause.style.display = "none";

    gap = (currentLine.split(' ').slice(-lookBack).join(' ') + ' ' + nextLine.split(' ').slice(0,lookFoward).join(' ')).trim();
    visionRange = gap.split(' ').length;
}

function nextState() {
    lineState = lineState + 1;
    console.log("line state:");
    console.log(lineState);
}

function loadCSV() {
    var fileInput = document.getElementById("csv-file");
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function () {
        var data = reader.result;
        lineScript = csvToArray(data);
        console.log(lineScript);
        nextState();
        updateState();
    };
    reader.readAsText(file);
}

var simprevprev = 0;
var simprev = 0;
var simnow = 0;
function nextLineReady(range) {
    simprevprev = simprev;
    simprev = simnow;
    console.log(range);
    console.log(gap);
    simnow = similarity(range, gap);
    console.log(simnow);
    console.log(simnow < simprev);
    return (simprev > similarityThreshold && simnow < simprev && simprev >= simprevprev);
}

// Check if browser supports speech recognition
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    // Create new SpeechRecognition object
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    // Set properties of recognition object
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    // Initialize variables
    //var wordSpoken = '';
    var startButton = document.getElementById('start-button');
    var stopButton = document.getElementById('stop-button');
    var surtitle = document.getElementById('surtitle');
    var caption = document.getElementById('caption');
    var applause = document.getElementById('applause');
    // Start button click event handler

    startButton.onclick = function () {
        // Initialize the state, transcription and word spoken
        updateState();
        wordSpoken = '';
        // Enable stop button, disable start button
        stopButton.disabled = false;
        startButton.disabled = true;
        // Start speech recognition
        recognition.start();
    };
    // Stop button click event handler
    stopButton.onclick = function () {
        // Disable stop button, enable start button
        stopButton.disabled = true;
        startButton.disabled = false;
        // Stop speech recognition
        recognition.stop();
    };
    // Speech recognition result event handler
    recognition.onresult = function (event) {
        // Loop through results
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i][0].confidence > confidenceThreshold) {
                wordLatest = event.results[i][0].transcript;
                //console.log(wordLatest);
                // If result is final, add to transcription variable
                if (event.results[i].isFinal) {
                    wordSpoken += event.results[i][0].transcript;
                    checkrange = wordSpoken.split(' ').slice(-visionRange).join(' ');
                }
                else {
                    checkrange = (wordSpoken + ' ' + wordLatest).split(' ').slice(-visionRange).join(' ');
                }
                if (checkrange.includes("applause") || checkrange.includes("Applause")){
                    applause.style.display = "";
                }
                //Check if can switch state here
                if (nextLineReady(checkrange)) {
                    nextState();
                    updateState();
                }
            }
        }

    };
} else {
    // Browser doesn't support speech recognition
    alert("Sorry, your browser doesn't support speech recognition. Try using Google Chrome instead.");
}