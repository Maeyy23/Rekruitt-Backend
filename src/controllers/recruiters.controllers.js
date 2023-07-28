const recruiterService = require('../services/recruiters.services');

const createRecruiter = async (req, res) => {
    try {
        const payload = await recruiterService.createRecruiter(req.body);
        res.status(payload.statusCode).json(payload);

    } catch (error) {
        res.status(500).json({
            message: 'unable to create recruiter',
            status: 400,
        })
    };
};

const login = async (req, res) => {
    try {
        const payload = await recruiterService.login(req.body);
        res.status(payload.statusCode).json(payload);
    } catch (error) {
        res.status(500).json({
            message: 'unable to login',
            status: 400,
        })
    };
};
const forgotPassword = async (req, res) => {
    try {
      const payload = await recruiterService.forgotPassword(req.body);
      res.status(payload.statusCode).json(payload);
    } catch (error) {
      res.status(500).json({
        message: "Unable to forget password",
        status: "failure",
      })
  }
  };
  
  
  const resetPassword = async (req, res) => {
    try {
      const payload = await recruiterService.resetPassword(req.body);
    res.status(payload.statusCode).json(payload);
    } catch (error) {
      res.status(500).json({
        message: "Unable to reset password",
        status: "failure",
      })
    }
  };
module.exports = {createRecruiter, login, forgotPassword,  resetPassword}