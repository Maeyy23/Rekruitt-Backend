const recruiter = require('../models/recruiters.models');
const response = require('../utils/response');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const generateResetPin = require('../utils/generateResetPin');
const sendMail = require("../utils/sendMail");

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
        if (!foundPassword) {
            return response.buildFailureResponse("password incorrect", 400)
        };
        const token = jwt.sign({ Email: foundUser.Email, firstName: foundUser.firstName, _id: foundUser._id }, process.env.JWT_SECRET,
            { expiresIn: '30d' });
        foundUser.accessToken = token
        return response.buildSuccessResponse("login successfull", 200, foundUser);

    } catch (error) {
        return response.buildFailureResponse("unable to login", 500)
    }

};

//forget password logic

const forgotPassword = async (payload) => {
    const emailFound = await recruiter.findOne({ Email: payload.Email })
    if (!emailFound) {
        return response.buildFailureResponse("Email not found", 400)
    }
    const resetPin = generateResetPin()
    const updatedUser = await recruiter.findByIdAndUpdate({ _id: emailFound._id }, { resetPin: resetPin }, { new: true });

    const forgotPasswordPayload = {
        to: updatedUser.Email,
        subject: "RESET PASSWORD",
        pin: resetPin,
    };
    sendMail.sendForgotPasswordMail(forgotPasswordPayload);
    return response.buildSuccessResponse(
        "Forgot Password Successful",
        200,
        updatedUser
    );
};

//reset password logic
const resetPassword = async (payload) => {
  const foundUserAndPin = await recruiter.findOne({Email: payload.Email, resetPin: payload.resetPin, });
  if (!foundUserAndPin) {
    return response.buildFailureResponse("Reset Pin Invalid", 400);
  };
  const saltRounds = 10;
  const generatedSalt = await bcrypt.genSalt(saltRounds);

  const hashedPassword = await bcrypt.hash(payload.password, generatedSalt);

  const updatedUser = await recruiter.findByIdAndUpdate(
    { _id: foundUserAndPin._id },
    { password: hashedPassword, resetPin: null },
    { new: true }
  );
  return response.buildSuccessResponse(
    "Password Reset Successful",
    200,
    updatedUser
  );
};

module.exports = { createRecruiter, login, forgotPassword, resetPassword  };