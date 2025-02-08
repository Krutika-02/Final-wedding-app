require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const ELEVEN_LABS_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // Keep this public

// Define the Knowledge Base
const KNOWLEDGE_BASE = `
You are a wedding assistant, and you must only respond based on the wedding details provided below.
Do not generate general wedding advice. Answer only from the information given.

## Couple Details:
- Groom: Ganesh N. (s/o Smt. Manjula R. and Sri Nagaraj V.)
- Bride: Ghanashree B. (d/o Smt. Suma G. and Sri Bhakthavatsala C.M.)

## Wedding Details:
- Reception: 22nd February 2025, Saturday, 6:30 PM onwards.
- Muhurtham: 23rd February 2025, Sunday, 9:50 AM to 11:00 AM.
- Venue: Bandimane Kalyana Mantapa, Gubbi Road, Tumkur - 572107.

## Preferences:
- Food: Both love biryani.
- Color: Ganesh prefers white, and Ghanashree loves blue.
- Beverages: Both enjoy coffee; Ganesh dislikes soft drinks, while Ghanashree likes Coke.
- Places: Ganesh’s favorite is Mullayangiri; Ghanashree loves BR Hills.
- Nature: Both prefer mountains over beaches.
- Movies/Series: Ganesh enjoys movies; Ghanashree loves K-dramas.

## Background:
- Ganesh: Born in Bangalore, living in Tumkur, BE in Computer Science, introverted.
- Ghanashree: Born & raised in Bangalore, studying Psychology in Arts, extroverted.

## Love story:
- In the vibrant corridors of youth, two souls unknowingly brushed past one another, a fleeting moment lost to time. Years later, like a twist of fate, they met again at a celebration — the spark between them reigniting with an intensity that neither had expected. With hearts full of courage, one dared to propose, a promise of forever blooming amidst uncertainty, only for life to pull them apart. But love, in its most resilient form, never fades. Time passed, paths were carved, and yet, their connection grew stronger, as if written in the stars. Together, they ventured through winding roads, shared laughter, and the magic of small, sweet conflicts. And when destiny finally whispered "now," they sealed their bond with a vow, forever weaving their story into the fabric of time, where love knows no end.

You must only answer questions related to this information.
`;

// OpenAI API Endpoint with Knowledge Base
app.post("/chat", async (req, res) => {
    try {
        const { userText } = req.body;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: KNOWLEDGE_BASE }, // Ensure model understands context
                    { role: "user", content: userText }
                ],
            },
            {
                headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
            }
        );

        res.json({ aiResponse: response.data.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ElevenLabs API Endpoint for Voice Generation
app.post("/voice", async (req, res) => {
    try {
        const { text } = req.body;

        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`,
            {
                text: text,
                model_id: "eleven_multilingual_v2",
                voice_settings: { stability: 0.5, similarity_boost: 0.7 },
            },
            {
                headers: { "xi-api-key": ELEVEN_LABS_API_KEY },
                responseType: "stream",
            }
        );

        response.data.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
