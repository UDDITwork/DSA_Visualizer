import express from 'express';
import { exec } from 'child_process';
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const genAI = new GoogleGenerativeAI("GOOGLE_GENRATIVE_AI_API_KEY");

app.post('/generate', async (req, res) => {
    const prompt = req.body.prompt;
    if (!prompt) {
        return res.status(400).send({ error: 'Prompt is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        console.log("Generated text:", text);

        res.send({ response: text.replace(/\*/g, '') });
    } catch (error) {
        console.error("Error from Google Generative AI:", error);
        res.status(500).send({ error: 'Failed to generate content' });
    }
});

app.get('/start-server', (req, res) => {
    exec('node Server/startServer.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting server: ${error}`);
            return res.status(500).send({ success: false });
        }
        console.log(`Server stdout: ${stdout}`);
        console.error(`Server stderr: ${stderr}`);
        res.send({ success: true });
    });
});

app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
