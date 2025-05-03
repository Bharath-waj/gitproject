const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

// Delay function for exponential backoff
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.post(
        'https://api.together.xyz/v1/chat/completions',
        {
          model: 'mistralai/Mistral-7B-Instruct-v0.2', 
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 300,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      return res.json({ reply });

    } catch (error) {
      if (error.response?.status === 429 && i < maxRetries - 1) {
        // If 429 error is encountered, back off and retry
        console.log(`Rate limit hit. Retrying in ${2 ** i}s...`);
        await delay(1000 * (2 ** i)); // Exponential backoff: 1s, 2s, 4s
      } else {
        // Log error details and send a failure response
        console.error('TogetherAI error:', error?.response?.data || error.message);
        return res.status(500).json({ error: 'Failed to get response from Together AI.' });
      }
    }
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});


