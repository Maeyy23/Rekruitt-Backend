const mongoose = require('mongoose');
const recruiterSchema = mongoose.Schema(
    {
        firstName: {
            type: 'string',
            required: true,
        },
        lastName: {
            type: 'string',
            required: true
        },
        Email: {
            type: 'string',
            required: true,
            unique: true,
        },
        password: {
            type: 'string',
            required: true,
        },
        resetPin: {
            type: Number,
          },
    },
    {timeStamps: true}

)
module.exports = mongoose.model ("Recruiters", recruiterSchema) 