// POST /api/chatbot
const chat = async (req, res) => {
  try {
    const { messages, system } = req.body;

    // Build Gemini-compatible contents array
    const contents = [];

    // System prompt as first user/model exchange
    contents.push({ role: 'user',  parts: [{ text: system }] });
    contents.push({ role: 'model', parts: [{ text: 'Understood! I am KisanBazaar Assistant. I will help with farming, crops, pesticides and payments.' }] });

    // Conversation history
    messages.forEach(m => {
      contents.push({
        role:  m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      });
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ contents }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, could not get response.';
    res.json({ content: [{ text }] });
  } catch (e) {
    console.error('Chatbot error:', e.message);
    res.status(500).json({ error: e.message });
  }
};

module.exports = { chat };
