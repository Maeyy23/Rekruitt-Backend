const recruiterRoute = require('./routes/recruiters.routes');
const applicantRoute = require('./routes/applicants.routes')
const express = require("express");
const dotenv = require("dotenv");

const connectDB = require('./configs/database');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

connectDB(process.env.MONGO_URI);

app.use(express.json());
app.use('/recruiter', recruiterRoute);
app.use('/applicant', applicantRoute);

app.get('/', (req, res) => {
    res.status(200).json(
        {
            message: 'server is up and running'
        });
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});
