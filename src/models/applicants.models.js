const mongoose = require("mongoose");

const applicantSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetPin: {
      type: Number,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Applicants", applicantSchema);
