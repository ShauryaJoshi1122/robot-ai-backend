import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  const OPENAI_KEY = process.env.OPENAI_KEY; // your secret key in Vercel

  function detectEmotion(txt){
    const t = txt.toLowerCase();
    if(t.includes("happy") || t.includes("great") || t.includes("awesome")) return "HAPPY";
    if(t.includes("sad") || t.includes("sorry") || t.includes("unfortunately")) return "SAD";
    if(t.includes("angry") || t.includes("frustrated")) return "ANGRY";
    return "NEUTRAL";
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: text }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    const emotion = detectEmotion(reply);

    res.status(200).json({ reply, emotion });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Robot: Internet nahi hai. Baad me try karo.", emotion: "NEUTRAL" });
  }
}
