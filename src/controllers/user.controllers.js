const userServices = require("../services/user.services");

const signUpApplicantController = async (req, res) => {
  try {
    const data = await userServices.signUpApplicant(req.body);
    if (!data) {
      return res.status(500).json({
        status: "failure",
        message: "Cannot register applicant",
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

const signUpRecruiterController = async (req, res) => {
  try {
    const data = await userServices.signUpRecruiter(req.body);
    if (!data) {
      return res.status(500).json({
        status: "failure",
        message: "Cannot register Recruiter",
      });
    }
    return res.status(data.statusCode).json(data);
  } catch (error) {
    return res.status(error?.statusCode).json({
      status: "failure",
      message: error?.message,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const data = await userServices.login(req.body);

    return res.status(data.statusCode).json(data);
  } catch (error) {
    return res.status(error?.statusCode).json({
      status: "failure",
      message: error?.message,
    });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const data = await userServices.forgotPassword(req.body);
    return res.status(data.statusCode).json(data);
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: error?.message,
    });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const data = await userServices.resetPassword(req.body);
    return res.status(data.statusCode).json(data);
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: error?.message,
    });
  }
};

const recruiterProfileController = async (req, res) => {
  try {
    const data = await userServices.updateRecruiterProfile(req.body);
    return res.status(data.statusCode).json(data);
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: error?.message,
    });
  }
};

const applicantProfileController = async (req, res) => {
  try {
    const data = await userServices.updateApplicantProfile(req.body);
    return res.status(data.statusCode).json(data);
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: error?.message,
    });
  }
};

const searchJob = async (req, res) => {
  try {
    const data = await applicantServices.searchJob(req.query);
    res.status(data.statusCode).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Unable to search for job",
      status: "failure",
    })
  }
};

const postJob = async (req, res) => {
  try {
    const payload = await recruiterService.postJob(req.body);
    res.status(payload.statusCode).json(payload);
  } catch (error) {
    res.status(500).json({
      message: "Unable to post job",
      status: "failure",
    })
  }
};


module.exports = {
  signUpApplicantController,
  signUpRecruiterController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  recruiterProfileController,
  applicantProfileController,
  searchJob,
  postJob
};

