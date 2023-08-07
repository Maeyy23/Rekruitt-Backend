// Importing Install libraries with npm
const express = require("express");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");

// importing from src
const usersRoutes = require("./routes/user.routes");
const connectDB = require("./configs/database.js");

//environment variables configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

//connecting to DB
connectDB(process.env.MONGO_URI);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use("/users", usersRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "server is up and running" });
});

// Server Listening
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
