const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const responses = require("../utils/response");
const generateResetPin = require("../utils/generateResetPin");
const sendMail = require("../utils/sendmail.js");

const signUpApplicant = async (payload) => {
    const foundEmail = await User.findOne({ email: payload.email})
    if(foundEmail) {
        return responses.buildFailureResponse("Email already exists", 400);
    }

    payload.password = await bcrypt.hash(payload.password, 10)
    payload.role = 'applicant'

    const savedApplicant = await User.create(payload)
    return responses.buildSuccessResponse("Registration Successful", 201, savedApplicant);
    
};

const signUpRecruiter = async (payload) => {
    const foundEmail = await User.findOne({ email: payload.email})
    if(foundEmail) {
        return responses.buildFailureResponse("Email already exists", 400);
    }

    payload.password = await bcrypt.hash(payload.password, 10)
    payload.role = 'recruiter'

    const savedRecruiter = await User.create(payload)
    return responses.buildSuccessResponse("registration Successful", 201, savedRecruiter);
};

const login = async (payload) => {
    const foundUser = await User.findOne({email: payload.email})

    if(!foundUser) {
        return responses.buildFailureResponse("User not found", 404);
    }

    const foundPassword = await bcrypt.compare(payload.password, foundUser.password)
    if(!foundPassword) {
        return responses.buildFailureResponse("Password incorrect", 400);
    }
    
    const token = jwt.sign({
        _id: foundUser._id,
        role: foundUser.role,
        email: foundUser.email}, 
        process.env.JWT_SECRET, 
        {expiresIn: "10d"}
    )
    foundUser.token = token;
    return responses.buildSuccessResponse("Login Successful", 200, foundUser);   
}

const forgotPassword = async (payload) => {
    const userEmail = await User.findOne({ email: payload.email})
    if (!userEmail) {
        return responses.buildFailureResponse("Invalid Email", 400);
    }
    const resetPin = generateResetPin();
    const updatedUser = await User.findByIdAndUpdate(
        { _id: userEmail._id },
        { resetPin: resetPin },
        { new: true }
    );
    const forgotPasswordPayload = {
        to: updatedUser.email,
        subject: "RESET PASSWORD",
        pin: resetPin
    };
    await sendMail.sendForgotPasswordMail(forgotPasswordPayload);
    return responses.buildSuccessResponse("Reset Pin sent successfully", 200, updatedUser);
}

const resetPassword = async(payload) => {
    /**
     * Validate if user exists with reset pin, hash the new password
     * update the new hashed password
     */
    const userAndPin = await User.findOne({
        email: payload.email,
        resetPin: payload.resetPin
    });
    if (!userAndPin) {
        return responses.buildFailureResponse("Invalid Pin", 400);
    }
    // to hash the new password
    const saltRounds = 10;
    const generatedSalt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(payload.password, generatedSalt);
    const updatedUser = await User.findByIdAndUpdate(
        { _id: userAndPin._id},
        { password: hashedPassword },
        { resetPin: null },
        { new: true }
    );
    return responses.buildSuccessResponse("Password Reset Successful", 200, updatedUser)
}

module.exports = {
    signUpApplicant,
    signUpRecruiter,
    login,
    forgotPassword,
    resetPassword
}