const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['applicant', 'recruiter'],
        default: 'applicant'
    },
    resetPin: {
        type: Number,
    },
    // dateOfBirth: {
    //     type: String,
    //     required: true
    // },
    // companyName: {
    //     type: String,
    //     required: true
    // },
    // positionInCompany: {
    //     type: String,
    //     required: true
    // },
    // countryCode: {
    //     type: Number,
    //     required: true
    // },
    // phoneNumber: {
    //     type: Number,
    //     required: true
    // },
    // numberOfEmployees: {
    //     type: Number,
    //     required: true
    // },
    // typeOfIndustry: {
    //     type: String,
    //     required: true
    // },
    // website: {
    //     type: String,
    // },
    // country: {
    //     type: String,
    // },
    // address: {
    //     type: String,
    //     required: true
    // }
}, {
    timestamps: true
}
)

module.exports = mongoose.model("User", userSchema)