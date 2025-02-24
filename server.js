import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import fetch from 'node-fetch';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

// Configure OpenAI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// DALL-E endpoint
app.post('/api/dalle', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const response = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        res.json({ images: [response.data.data[0].url] });
    } catch (error) {
        console.error('DALL-E Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate image with DALL-E',
            details: error.message 
        });
    }
});

// Stable Diffusion endpoint
app.post('/api/stable-diffusion', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
            },
            body: JSON.stringify({
                text_prompts: [{ text: prompt }],
                cfg_scale: 7,
                height: 1024,
                width: 1024,
                steps: 30,
                samples: 1,
            }),
        });

        if (!response.ok) {
            throw new Error(`Stability API error: ${response.statusText}`);
        }

        const responseData = await response.json();
        const images = responseData.artifacts.map(artifact => {
            // Convert base64 to URL if needed
            return `data:image/png;base64,${artifact.base64}`
        });

        res.json({ images });
    } catch (error) {
        console.error('Stable Diffusion Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate image with Stable Diffusion',
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 