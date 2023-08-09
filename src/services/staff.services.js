const Staff = require("../models/staff.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const responses = require("../utils/response.js");

const staffSignUp = async (payload) => {
  const foundEmail = await Staff.findOne({ email: payload.email });
  if (foundEmail) {
    return responses.buildFailureResponse("Email already exists", 401);
  }
  payload.password = await bcrypt.hash(payload.password, 10);

  const createStaff = await Staff.create(payload);
  return responses.buildSuccessResponse(
    "Staff created Successfully",
    200,
    createStaff
  );
};

module.exports = {
  staffSignUp,
};
