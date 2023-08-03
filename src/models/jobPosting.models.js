const mongoose = require("mongoose")

const jobPostingSchema = mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    jobDescriptions: {         // skiils and education requirements
        type: String,
        required: true,
    },
    jobType: {                  // full-time, contract, Temporary, internship
        type: String,
        required: true,
    },
    experienceLevel: {              // whether Internship, Entry-level, Associate, mid-senior, director, executive 
        type: String,
        required: true,
    },
    jobMode: {              // remote, onSite, hybrid
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    applicationLink: { 
        type: String,
        required: true,
    },

    deadline: {
        type: Date,
        required: true,
    },
},
    
    {timestamps: true},
);

module.exports = mongoose.model("vacancies", jobPostingSchema)