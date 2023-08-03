const jwt = require('jsonwebtoken')
const models = {
    applicant: require('../models/applicants.models.js'),
    recruiters: require('../models/recruiters.models')
  };
  

async function authenticate(req, res, next) {
    try {
        const authorization = req.headers.authorization
        if(!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(400).json({
                message: "Authorization header must start with 'Bearer '",
                status: "failure"
            })
        }
        const token = authorization.substring(7)
        
        const decodedUser = jwt.decode(token)
        
        const foundStaff = await Promise.all([
            models.applicant.findOne({ _id: decodedUser._id }),
            models.recruiters.findOne({ _id: decodedUser._id })
          ]);
          
        req.user = foundStaff
        next()
    } catch (error) {
        return res.status(error?.statusCode || 500).send(error?.message || "Unable to authenticate")
    }
}

module.exports = {
authenticate
}