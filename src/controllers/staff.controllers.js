const staffServices = require("../services/staff.services.js");

const staffSignUpController = async (req, res) => {
  try {
    const data = await staffServices.staffSignUp(req.body);
    if (!data) {
      return res.status(500).json({
        message: "Unable to register staff",
        status: "failure",
      });
    }
    return res.status(data.statusCode).json(data);
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: error?.message,
    });
  }
};

module.exports = {
  staffSignUpController,
};
