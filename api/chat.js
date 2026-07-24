import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { contents } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Server API key not configured.' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });
        
        // Format contents correctly for the SDK
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
        });

        return res.status(200).json({
            candidates: [{
                content: {
                    parts: [{ text: response.text }]
                }
            }]
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
