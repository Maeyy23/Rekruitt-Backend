const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user.models");
const responses = require("../utils/response");
const generateResetPin = require("../utils/generateResetPin");
const sendMail = require("../utils/sendmail.js");
const vacantPosition = require("../models/jobPosting.models");
const postJob = require("../models/jobPosting.models.js");

const signUpApplicant = async (payload) => {
  const foundEmail = await user.findOne({ email: payload.email });
  if (foundEmail) {
    return responses.buildFailureResponse("Email already exists", 400);
  }

  payload.password = await bcrypt.hash(payload.password, 10);
  payload.role = "applicant";

  const savedApplicant = await user.create(payload);
  return responses.buildSuccessResponse(
    "Registration Successful",
    201,
    savedApplicant
  );
};

const signUpRecruiter = async (payload) => {
  const foundEmail = await user.findOne({ email: payload.email });
  if (foundEmail) {
    return responses.buildFailureResponse("Email already exists", 400);
  }

  payload.password = await bcrypt.hash(payload.password, 10);
  payload.role = "recruiter";

  const savedRecruiter = await user.create(payload);
  return responses.buildSuccessResponse(
    "registration Successful",
    201,
    savedRecruiter
  );
};

const login = async (payload) => {
  const foundUser = await user.findOne({ email: payload.email });

  if (!foundUser) {
    return responses.buildFailureResponse("User not found", 404);
  }

  const foundPassword = await bcrypt.compare(
    payload.password,
    foundUser.password
  );
  if (!foundPassword) {
    return responses.buildFailureResponse("Password incorrect", 400);
  }

  const token = jwt.sign(
    {
      _id: foundUser._id,
      role: foundUser.role,
      email: foundUser.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "10d" }
  );
  foundUser.token = token;
  return responses.buildSuccessResponse("Login Successful", 200, foundUser);
};

const forgotPassword = async (payload) => {
  const userEmail = await user.findOne({ email: payload.email });
  if (!userEmail) {
    return responses.buildFailureResponse("Invalid Email", 400);
  }
  const resetPin = generateResetPin();
  const updatedUser = await user.findByIdAndUpdate(
    { _id: userEmail._id },
    { resetPin: resetPin },
    { new: true }
  );
  const forgotPasswordPayload = {
    to: updatedUser.email,
    subject: "RESET PASSWORD",
    pin: resetPin,
  };

  sendMail.sendForgotPasswordMail(forgotPasswordPayload);
  return responses.buildSuccessResponse(
    "Reset Pin sent successfully",
    200,
    updatedUser
  );
};

const resetPassword = async (payload) => {
  const userAndPin = await user.findOne({
    email: payload.email,
    resetPin: payload.resetPin,
  });
  if (!userAndPin) {
    return responses.buildFailureResponse("Invalid Pin", 400);
  }
  // to hash the new password
  const saltRounds = 10;
  const generatedSalt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(payload.password, generatedSalt);
  const updatedUser = await user.findByIdAndUpdate(
    { _id: userAndPin._id },
    { password: hashedPassword },
    { resetPin: null },
    { new: true }
  );
  return responses.buildSuccessResponse(
    "Password Reset Successful",
    200,
    updatedUser
  );
};

const updateRecruiterProfile = async (payload) => {
  console.log({ payload });
  const userProfile = await user.findOne({ _id: payload.id });
  if (!userProfile) {
    return responses.buildFailureResponse("User Id not found", 400);
  }
  const updatedProfile = await user.findByIdAndUpdate(
    { _id: userProfile._id },
    payload,
    { new: true }
  );
  //   console.log(updatedProfile);
  return responses.buildSuccessResponse(
    "Recruiter Profile updated Successfully",
    200,
    updatedProfile
  );
};

const updateApplicantProfile = async (payload) => {
  console.log({ payload });
  const userProfile = await user.findOne({ _id: payload.id });
  if (!userProfile) {
    return responses.buildFailureResponse("User not found", 400);
  }
  const updatedProfile = await user.findByIdAndUpdate(
    { _id: userProfile._id },
    payload,
    { new: true }
  );
  return responses.buildSuccessResponse(
    "Applicant profile updated Successfully",
    200,
    updatedProfile
  );
};

const vaccant = async (payload) => {
  const foundUser = await user.findOne({ _id: payload.user._id });
  if (foundUser.role !== "recruiter") {
    return responses.buildFailureResponse(
      "Only Recruiters can post a job",
      400
    );
  }
  const postedJob = await vacantPosition.create(payload);
  return responses.buildSuccessResponse(
    "Job posted successfully",
    200,
    postedJob
  );
};

async function searchJob(query) {
  try {
    const foundUser = await user.findOne({ _id: payload.user._id });
    if (foundUser.role !== "applicant") {
      return responses.buildFailureResponse(
        "Sorry, you are not allowed this feature",
        400
      );
    }
    const searchedJob = query.search
      ? {
          $or: [
            { jobTitle: { $regex: query.search, $options: "i" } },
            { location: { $regex: query.search, $options: "i" } },
          ],
        }
      : {};
    const foundJob = await postJob.find(searchedJob);
    return responses.buildSuccessResponse(
      "Successfully fetched job",
      200,
      foundJob
    );
  } catch (error) {
    return responses.buildFailureResponse("Failed to fetch job", 500);
  }
}

module.exports = {
  signUpApplicant,
  signUpRecruiter,
  login,
  forgotPassword,
  resetPassword,
  updateRecruiterProfile,
  updateApplicantProfile,
  vaccant,
  searchJob,
};
