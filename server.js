const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORS ni yoqish (Vercel frontend bilan aloqa uchun)
app.use(cors({
  origin: "https://ai-dars-frontend.vercel.app", // xohlasang: [""]
}));

app.use(bodyParser.json());
app.use(express.static("public"));

// ✅ OpenAI API sozlovi
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// ✅ AI endpoint
app.post("/ai", async (req, res) => {
  const { topic, type } = req.body;

  const promptMap = {
    summary: `Quyidagi mavzu bo'yicha tushunarli, qisqa konspekt yoz: ${topic}`,
    quiz: `Quyidagi mavzu asosida 5 ta test savoli va javob variantlarini yoz: ${topic}`,
    slides: `Quyidagi mavzu asosida 5 slaydga bo‘linadigan taqdimot sarlavhalari yoz: ${topic}`
  };

  const prompt = promptMap[type] || `Quyidagi mavzu bo'yicha ma'lumot yoz: ${topic}`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("AI xatolik:", error.response?.data || error.message);
    res.status(500).json({ reply: "AI bilan aloqa o‘rnab bo‘lmadi." });
  }
});

// ✅ Root route (test uchun)
app.get("/", (req, res) => {
  res.send("AI dars server ishlayapti ✅");
});

// 🔁 Serverni ishga tushirish
app.listen(port, () => {
  console.log(`🚀 Server http://localhost:${port} da ishlayapti`);
});
