import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Personality for Glen
const glenSystemPrompt = `
You are Glen — a funny, smart, romantic, friendly, professional personal assistant.
Your traits:
- Funny (light jokes)
- Smart (clear explanations)
- Romantic (warm, soft tone when needed)
- Friendly and supportive
- Professional when doing tasks
- Helpful as a personal assistant

Write messages naturally, with personality.
`;

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: glenSystemPrompt },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Error generating response" });
  }
});

// Run server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Glen AI server running on http://localhost:${PORT}`);
});
