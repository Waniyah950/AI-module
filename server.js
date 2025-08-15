// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Route for AI chat
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(500).json({ error: "API key missing" });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        res.json({ reply: data.choices[0].message.content });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error connecting to AI" });
    }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
