document.getElementById("startSpeech").addEventListener("click", function () {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onstart = function () {
        console.log("Speech recognition started...");
    };

    recognition.onresult = function (event) {
        let userText = event.results[0][0].transcript;
        document.querySelector("#userText span").innerText = userText;
        
        // Stop recognition after capturing input
        recognition.stop();

        fetch("https://final-wedding-app.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userText }),
        })
            .then(response => response.json())
            .then(data => {
                let aiResponse = data.aiResponse;
                document.querySelector("#aiResponse span").innerText = aiResponse;
                getVoiceFromBackend(aiResponse);
            })
            .catch(error => console.error("Error fetching AI response:", error));
    };

    recognition.onerror = function (event) {
        console.error("Speech recognition error:", event.error);
        recognition.stop();
    };

    recognition.onend = function () {
        console.log("Speech recognition ended.");
    };
});

function getVoiceFromBackend(text) {
    fetch("https://final-wedding-app.onrender.com/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    })
        .then(response => response.blob())
        .then(blob => {
            let audioUrl = URL.createObjectURL(blob);
            let audio = new Audio(audioUrl);

            audio.onloadeddata = function () {
                console.log("Audio loaded. Playing now...");
                audio.play();
            };

            audio.onerror = function () {
                console.error("Error playing generated speech.");
            };
        })
        .catch(error => console.error("Error generating speech:", error));
}
