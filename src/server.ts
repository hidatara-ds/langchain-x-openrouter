import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inisialisasi ChatOpenAI dengan parameter yang benar
const chatOpenRouter = new ChatOpenAI({
    model: "deepseek/deepseek-chat-v3-0324:free", // Gunakan model bukan modelName untuk konsistensi dengan main.ts
    openAIApiKey: process.env.OPENROUTER_API_KEY, // Ubah apiKey menjadi openAIApiKey
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            'X-Title': "langchain-openrouter-101"
        }
    }
});

// API endpoint untuk chat
app.post('/api/chat', async (req, res) => {
    try {
        const { userMessage, systemPrompt } = req.body;
        
        // Validasi input
        if (!userMessage) {
            return res.status(400).json({ error: 'User message is required' });
        }

        // Buat pesan untuk LLM
        const messages = [
            new SystemMessage(systemPrompt || 'You are a helpful assistant.'),
            new HumanMessage({ content: userMessage })
        ];

        // Set header untuk streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Stream respons
        const stream = await chatOpenRouter.stream(messages);
        
        for await (const chunk of stream) {
            res.write(`data: ${JSON.stringify({ content: chunk.content })}\n\n`);
        }
        
        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Mulai server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});