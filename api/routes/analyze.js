const express = require('express');
const { Configuration, OpenAI } = require("openai"); 
require("dotenv").config(); 

const router = express.Router();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
}); 

router.post('/', async (req, res) => {
    try {
        const { code, language, framework } = req.body;
        let prompt = `Using the ${framework} framework, analyze the following ${language} code for any patterns or anti-patterns. Provide a detailed explanation of any patterns identified and suggest potential areas of improvement:\n\nCode:\n${code}`;

        const GPTOutput = await openai.chat.completions.create({ 
            model: "gpt-3.5-turbo", 
            messages: [{ role: "user", content: prompt }]
        }); 

        const output_text = GPTOutput.choices[0].message.content;

        res.json({ result: output_text });
    } catch (error) {
        console.error('Error detecting patterns:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
