const applicants = require('../models/applicants.models');
const bcrypt = require("bcrypt");
const responses= require("../utils/response")
const jwt = require("jsonwebtoken");
const generateResetPin = require('../utils/generateResetPin');
const sendMail = require("../utils/sendMail");
const postJob = require ("../models/jobPosting.models.js")


async function createApplicant(payload) {
const { Email} = payload;
  const foundEmail = await applicants.findOne({ Email: Email });
    if (foundEmail) {
        return responses.buildFailureResponse('applicant email already registered', 400)
  }
  const saltRounds = 10;
  const generatedSalt = await bcrypt.genSalt(saltRounds);
  const hashedPasswords = await bcrypt.hash(payload.password, generatedSalt);
  payload.password = hashedPasswords;

    const savedApplicant = await applicants.create(payload);
    console.log("Saved Applicant:", savedApplicant);
    return responses.buildSuccessResponse("applicant created successfully", 201, savedApplicant);
};

const login = async (payload) => {
  try {
    const foundUser = await applicants.findOne({ Email: payload.Email }).lean()
    if (!foundUser) {
      return responses.buildFailureResponse('user not found', 400)
    };

    const foundPassword = await bcrypt.compare(payload.password, foundUser.password)
    if (!foundPassword) {
      return responses.buildFailureResponse('password incorrect', 403)
    };
    const token = jwt.sign({ Email: foundUser.Email, firstName: foundUser.firstName, _id: foundUser._id }, process.env.JWT_SECRET,
      {
        expiresIn: '30d'
      })
    
    foundUser.accessToken = token
    return responses.buildSuccessResponse('login successfully', 200, foundUser)
  }
  catch (error) {
    return responses.buildFailureResponse('unable to login', 500)
  }
};

//forget password logic

  const forgotPassword = async (payload) => {   
    const emailFound = await applicants.findOne({ Email: payload.Email })
    if (!emailFound) {
        return responses.buildFailureResponse("Email not found", 400)
    }
    const resetPin = generateResetPin()
    const updatedUser = await applicants.findByIdAndUpdate({ _id: emailFound._id }, { resetPin: resetPin }, { new: true });

    const forgotPasswordPayload = {
        to: updatedUser.Email,
        subject: "RESET PASSWORD",
        pin: resetPin,
    };
    sendMail.sendForgotPasswordMail(forgotPasswordPayload);
    return responses.buildSuccessResponse(
        "Forgot Password Successful",
        200,
        updatedUser
    );
};

//reset password logic
const resetPassword = async (payload) => {
  const foundUserAndPin = await applicants.findOne({Email: payload.Email, resetPin: payload.resetPin, });
  if (!foundUserAndPin) {
    return responses.buildFailureResponse("Reset Pin Invalid", 400);
  };
  const saltRounds = 10;
  const generatedSalt = await bcrypt.genSalt(saltRounds);

  const hashedPassword = await bcrypt.hash(payload.password, generatedSalt);

  const updatedUser = await applicants.findByIdAndUpdate(
    { _id: foundUserAndPin._id },
    { password: hashedPassword, resetPin: null },
    { new: true }
  );
  return responses.buildSuccessResponse(
    "Password Reset Successful",
    200,
    updatedUser
  );
};
// function to search for posted jobs
async function searchJob(query) {
  try {
    const searchedJob = query.search
      ? {
        $or: [
          { jobTitle: { $regex:query.search, $options: "i" } },
          { jobType: { $regex:query.search, $options: "i" } },
          { experienceLevel: { $regex: query.search, $options: "i" } },
          { jobMode: { $regex:query.search, $options: "i" } },
        ],
        // Company: query.Company,
      }
      : {};
    const foundJob = await postJob.find(searchedJob);
    return responses.buildSuccessResponse("Successfully fetched job", 200, foundJob);
  } catch (error) {
    return responses.buildFailureResponse("Failed to fetch job", 500);
  }
}

module.exports = { createApplicant, login, forgotPassword, resetPassword, searchJob }