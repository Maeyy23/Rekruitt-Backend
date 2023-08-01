const Mongoose = require("mongoose");

const blogPostSchema = new Mongoose.Schema(
  {
    blogTitle: {
      type: String,
      required: true,
    },
    blogImage: {
      type: String,
      required: true,
    },
    blogContent: {
      type: String,
      required: true,
    },
    author: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Mongoose.model("BlogPost", blogPostSchema);
