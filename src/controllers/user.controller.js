const userServices = require('../services/users.service');

const signUpApplicantController = async (req, res) => {
    try {
        const data = await userServices.signUpApplicant(req.body)
        if(!data) {
            return res.status(500).json({
                status: 'failure',
                message: 'Cannot register applicant'})
        }
        return res.status(data.statusCode).json(data)
    } catch (error) {
        return res.status(error?.statusCode).json({
            status: 'failure',
            message: error?.message})
    }
};

const signUpRecruiterController = async (req, res) => {
    try {
        const data = await userServices.signUpRecruiter(req.body)
        if(!data) {
            return res.status(500).json({
                status: 'failure', 
                message: 'Cannot register Recruiter'})
        }
        return res.status(data.statusCode).json(data)
    } catch (error) {
        return res.status(error?.statusCode).json({
            status: 'failure', 
            message: error?.message})
    }
};

const loginController = async (req, res) => {
    try {
       const data = await userServices.login(req.body)

       return res.status(data.statusCode).json(data)
    } catch (error) {
        return res.status(error?.statusCode).json({
            status: 'failure', 
            message: error?.message
        })
    }
};

module.exports = {
    signUpApplicantController,
    signUpRecruiterController,
    loginController
};