// Importing the installed Libraries using npm
const express = require("express");
const dotenv = require("dotenv");
const rateLimit = require('express-rate-limit');
const bodyParser = require("body-parser");

// import from src folder
const usersRoutes = require('./routes/user.routes');
const connectDB = require ("./configs/database.js");

// dotenv configurtions
dotenv.config()
const app = express();
const PORT = process.env.PORT || 6060;

// Using Rate Limiter and calling it
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});

// Connecting to Database
connectDB(process.env.MONGO_URI)

// Calling the routes
app.use(limiter);
app.use(express.json());

// Parse requests using bodyParser //
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/users', usersRoutes);

app.get("/", (req, res) => {
    res.status(200).json({ message: "I am running" });
});

// Server listening
app.listen(PORT, () => {
    console.log(`Server is running perfectly at port ${PORT}`);
});