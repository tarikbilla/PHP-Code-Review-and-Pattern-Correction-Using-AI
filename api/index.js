// src/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import the CORS module
const config = require('./config');

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000'  // Adjust this to match the origin of your frontend, or use '*' for all origins
}));

// Body parser middleware to handle JSON payloads
app.use(bodyParser.json());

// Import route handlers
const analyzeRoute = require('./routes/analyze');
const errorsRoute = require('./routes/errors');
const suggestionsRoute = require('./routes/suggestions');

// Route setups
app.use('/api/analyze', analyzeRoute);
app.use('/api/errors', errorsRoute);
app.use('/api/suggestions', suggestionsRoute);

app.get('/', (req, res) => {
    res.send('Welcome!');
});

app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
});
