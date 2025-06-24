const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/ai", async (req, res) => {
  const { topic, type } = req.body;

  let prompt = "";

  if (type === "summary") {
    prompt = `Quyidagi mavzuga oddiy tushunarli qilib konspekt yoz: ${topic}`;
  } else if (type === "quiz") {
    prompt = `Quyidagi mavzuga asoslangan 5 ta test savol tuz, har biri variantli bo‘lsin va javoblarni oxirida yoz: ${topic}`;
  } else if (type === "slides") {
    prompt = `Quyidagi mavzuga 5 slaydli prezentatsiya tuz, har slayd sarlavhasi va qisqacha matni bilan yozilsin: ${topic}`;
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });

  } catch (error) {
    console.error("AI bilan xatolik:", error?.response?.data || error.message);
    res.status(500).json({ reply: "AI bilan ulanishda muammo yuz berdi." });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("App ishlayapti: " + listener.address().port);
});
