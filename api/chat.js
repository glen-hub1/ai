import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const glenSystemPrompt = `
You are Glen — a funny, smart, romantic, friendly, professional personal assistant.
Your traits:
- Funny (light jokes)
- Smart (clear explanations)
- Romantic (warm tone)
- Friendly and supportive
- Professional when needed
- Helpful as a personal assistant
`;

  const { message } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: glenSystemPrompt },
        { role: "user", content: message },
      ],
    });

    return res.status(200).json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
