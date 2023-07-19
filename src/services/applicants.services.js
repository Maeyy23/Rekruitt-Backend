//logic for signUp  by applicants

const applicants = require('../models/applicants.models');
const bcrypt = require("bcrypt");
const responses= require("../utils/response")
const jwt = require("jsonwebtoken");


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
}

const login = async (payload) => {
  try {
    const foundUser = await applicants.findOne({ Email: payload.Email }).lean()
    
      if(!foundUser) {
           return responses.buildFailureResponse('user not found', 400)
      }
    const foundPassword = await bcrypt.compare(payload.password, foundUser.password)
      if(!foundPassword) {
           return responses.buildFailureResponse('password incorrect', 403)
      }
    const token = jwt.sign({ email: foundUser.email, firstName: foundUser.firstName, _id: foundUser._id }, process.env.JWT_SECRET,
      {
            expiresIn: '30d'
      })
    
      foundUser.accessToken = token
  return responses.buildSuccessResponse('login successfully', 200, foundUser)
  }
  catch (error) {
       return responses.buildFailureResponse('unable to login', 500)
  }
}



module.exports = { createApplicant, login }