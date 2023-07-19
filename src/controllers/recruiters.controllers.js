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
        console.log(payload);
        res.status(payload.statusCode).json(payload);
    } catch (error) {
        res.status(500).json({
            message: 'unable to login',
            status: 400,
        })
    };
};
console.log(login);
module.exports = {createRecruiter, login}