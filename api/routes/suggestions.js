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
        let prompt = `Examine the following ${language} code under the principles of the ${framework} framework. Identify any anti-patterns and provide specific code corrections. Ensure these corrections adhere strictly to the best practices prescribed by the ${framework} framework. Focus on enhancing maintainability and scalability. Here's the code: ${code}
        . Give me only code`;

        const GPTOutput = await openai.chat.completions.create({ 
            model: "gpt-3.5-turbo", 
            messages: [{ role: "user", content: prompt }]
        }); 

        const output_text = GPTOutput.choices[0].message.content;

        res.json({ result: output_text });
    } catch (error) {
        console.error('Error providing corrective suggestions:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
