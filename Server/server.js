const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config(); // This loads the .env file
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json()); // for parsing JSON requests

// Routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
