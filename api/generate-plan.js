import { config } from 'dotenv';

config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { budget, people, diet, cookingTime, ingredients } = req.body || {};

    if (!budget || !people || !diet || !cookingTime) {
      return res.status(400).json({ error: 'Please provide budget, people, diet, and cooking time.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured.' });
    }

    const prompt = `Create a practical meal plan for ${people} people with a budget of ₹${budget}. Diet: ${diet}. Cooking time target: ${cookingTime} minutes. Ingredients already available: ${ingredients || 'None'}. Return JSON with fields: breakfast, lunch, dinner, groceryList, substitutions, estimatedCost. Keep the groceryList as a newline-separated list. Keep substitutions concise. The response should be valid JSON only, no markdown.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini request failed.');
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to generate meal plan.' });
  }
}
