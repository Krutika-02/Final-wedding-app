document.getElementById("startSpeech").addEventListener("click", function () {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function (event) {
        let userText = event.results[0][0].transcript;
        document.querySelector("#userText span").innerText = userText;

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
            .catch(error => console.error("Error:", error));
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
            audio.play();
        })
        .catch(error => console.error("Error generating speech:", error));
}
