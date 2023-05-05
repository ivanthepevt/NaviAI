// Check if browser supports speech recognition
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    // Create new SpeechRecognition object
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    // Set properties of recognition object
    recognition.lang = 'vi-VN';
    recognition.continuous = true;
    recognition.interimResults = true;
    // Initialize variables
    var transcription = '';
    var startButton = document.getElementById('start-button');
    var stopButton = document.getElementById('stop-button');
    var surtitle = document.getElementById('surtitle');
    // Start button click event handler
    startButton.onclick = function() {
        // Clear any previous transcription
        transcription = '';
        // Enable stop button, disable start button
        stopButton.disabled = false;
        startButton.disabled = true;
        // Start speech recognition
        recognition.start();
    };
    // Stop button click event handler
    stopButton.onclick = function() {
        // Disable stop button, enable start button
        stopButton.disabled = true;
        startButton.disabled = false;
        // Stop speech recognition
        recognition.stop();
    };
    // Speech recognition result event handler
    recognition.onresult = function(event) {
        // Loop through results
        for (var i = event.resultIndex; i < event.results.length; i++) {
            if(event.results[i][0].confidence > 0.4) {
                surtitle.innerHTML = capitalize(event.results[i][0].transcript);
            }
        }
    };
} else {
    // Browser doesn't support speech recognition
    alert("Trình duyệt của bạn không được hỗ trợ. Vui lòng thử trình duyệt Chrome trên máy tính.");
}

function capitalize(s) {
    var first_char = /\S/;
    return s.replace(first_char, function(m) {
      return m.toUpperCase();
    });
  }