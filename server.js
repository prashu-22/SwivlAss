require('dotenv').config(); // Load environment variables
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const dbConnection = require("./db/db.js");
const app = express();

// Other setup middleware and configurations

app.use(express.json());

// Use the user routes
app.use('/api/users', userRoutes);

// Other routes and configurations

dbConnection(); // Call the function to establish the database connection

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
