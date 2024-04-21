const express = require('express');
const router = express.Router();
const { Configuration, OpenAI } = require("openai"); 
require("dotenv").config(); 

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
}); 

router.post('/', async (req, res) => {
    try {
        const { code, language, framework } = req.body;
        const GPTOutput = await openai.chat.completions.create({ 
            model: "gpt-3.5-turbo", 
            messages: [{ role: "user", content: `Review the following ${language} code through the lens of the ${framework} framework. Identify patterns. Here's the code: ${code}. I need output for Patern Detected: (anti pattern or non anti pattern), Why?, and Details` }]
        }); 

        const output_text = GPTOutput.choices[0].message.content;

        res.json({ result: output_text });
    } catch (error) {
        console.error('Error detecting patterns:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
