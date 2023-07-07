const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model')

const signUpApplicant = async (payload) => {
    const foundEmail = await User.findOne({ email: payload.email})
    if(foundEmail) {
        return {
            message: 'Email already exists',
            status: 'failure',
            statusCode: 400
        }
    }

    payload.password = await bcrypt.hash(payload.password, 10)
    payload.role = 'applicant'

    const savedApplicant = await User.create(payload)
    return {
        message: "Registration Successful",
        status: 'success',
        statusCode: 201,
        data: savedApplicant
    }
};

const signUpRecruiter = async (payload) => {
    const foundEmail = await User.findOne({ email: payload.email})
    if(foundEmail) {
        return {
            message: 'Email already exists',
            status: 'failure',
            statusCode: 400
        }
    }

    payload.password = await bcrypt.hash(payload.password, 10)
    payload.role = 'recruiter'

    const savedRecruiter = await User.create(payload)
    return {
        message: "Registration Successful",
        status: 'success',
        statusCode: 201,
        data: savedRecruiter
    }
};

const login = async (payload) => {
    const foundUser = await User.findOne({email: payload.email})

    if(!foundUser) {
        return {
            message: 'User not found',
            status: 'failure',
            statusCode: 404
        }
    }

    const foundPassword = await bcrypt.compare(payload.password, foundUser.password)
    if(!foundPassword) {
        return {
            message: 'Password incorrect',
            status: 'failure',
            statusCode: 400
        }
    }
    
    const token = jwt.sign({
        _id: foundUser._id,
        role: foundUser.role,
        email: foundUser.email
    }, process.env.JWT_SECRET)

    return {
        message: 'Login Successful',
        status: 'success',
        statusCode: 200,
        data:foundUser,
        token:token
    }
};

module.exports = {
    signUpApplicant,
    signUpRecruiter,
    login
}