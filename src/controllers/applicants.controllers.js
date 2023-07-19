const applicantServices = require("../services/applicants.services");

const createApplicant = async (req, res) => {
    try {
      const payload = await applicantServices.createApplicant(req.body);
      res.status(payload.statusCode).json(payload);
    } catch (error) {
      res.status(500).json({
        message: "Unable to create applicant",
        status: "failure",
      });
  };
  };
  

const login = async (req, res) => {
  try {
    const payload = await applicantServices.login(req.body)
    res.status(payload.statusCode).json(payload) 
  }
  catch (error) {
    res.status(500).json({
      message: "Unable to login applicant",
      status: "failure",
    })
  }
};

module.exports = { createApplicant, login };
