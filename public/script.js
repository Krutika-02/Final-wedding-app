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

function updateCountdown() {
    const weddingDate = new Date("February 23, 2025 00:00:00").getTime();
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;

    if (timeLeft < 0) {
        document.querySelector(".countdown .timer").innerHTML = "<h3>We are Married! 🎉</h3>";
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.querySelector(".time-box:nth-child(1) span").innerText = days;
    document.querySelector(".time-box:nth-child(2) span").innerText = hours;
    document.querySelector(".time-box:nth-child(3) span").innerText = minutes;
    document.querySelector(".time-box:nth-child(4) span").innerText = seconds;
}

// Run the countdown function every second
setInterval(updateCountdown, 1000);

// Open Google Maps on Click (Exact Location)
document.querySelectorAll(".map-btn").forEach(button => {
    button.addEventListener("click", function () {
        window.open("https://www.google.com/maps/place/Bandimane+Kalyana+Mantapa/@13.3165182,77.0418957,15z/data=!4m6!3m5!1s0x3bb02e8b3befd963:0x59e04ef63c5c42d0!8m2!3d13.3165182!4d77.0418957!16s%2Fg%2F11c5k23z1m", "_blank");
    });
});
