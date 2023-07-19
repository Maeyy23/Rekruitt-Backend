const recruiter = require('../models/recruiters.models');
const response = require('../utils/response')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const createRecruiter = async (payload) => {

    const { Email } = payload;
    const foundEmail = await recruiter.findOne({ Email: Email });
    if (foundEmail) {
        return response.buildFailureResponse("email already exists", 400)
    }
    const saltRounds = 10;
    const generatedSalt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(payload.password, generatedSalt);
    payload.password = hashedPassword;

    const savedRecruiter = await recruiter.create(payload);
    return response.buildSuccessResponse("recruiter created successfully", 200, savedRecruiter);

};

const login = async (payload) => {
    try {
        const foundUser = await recruiter.findOne({ Email: payload.Email }).lean()
        if (!foundUser) {
            return response.buildFailureResponse("user not found", 400)
        };

        const foundPassword = await bcrypt.compare(payload.password, foundUser.password);
        if (!foundPassword) { return response.buildFailureResponse("password incorrect", 400) };

        const token = jwt.sign({ email: foundUser.email, name: foundUser.firstName, _id: foundUser._id }, process.env.JWT_SECRET,
            { expiresIn: '30d' });
        foundUser.accessToken = token
        return response.buildSuccessResponse("login successfull", 200, foundUser);

    } catch (error) {
        return response.buildFailureResponse("unable to login", 500)
    }

};

module.exports = { createRecruiter, login };