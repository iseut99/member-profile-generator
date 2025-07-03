const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST supported" });
  }

  let body = "";

  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const { companyName, sourceText } = JSON.parse(body);

      const prompt = `Write a short, professional company bio for "${companyName}" using this information:\n\n${sourceText}`;

      const chat = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const output = chat.choices[0].message.content;
      return res.status(200).json({ output });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
};
