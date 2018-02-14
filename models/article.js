//       Required
// ==================================================
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//       Mongoose
// ==================================================
const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    // Article's name has to be unique
    name: {
      type: String,
      unique: true,
      required: [true, "The name of the article is required"]
    },
    category: {
      type: String,
      required: [true, "Article's categories are required"]
    },
    date: {
        type: String,
        required: [false, "Article's date is required"]
    },
    image: {
      type: String,
      required: [false, "Article's fetured image is required"]
    },
    author: { 
        // Make the association to the user
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
      type: String,
      required: [false, "The content of the article is required"]
    },
    labels: {
      type: String,
      required: [false, "The labels of the article are required"]
    },
    comments: { type: String, required: [false, "comments"] }
  },{ timestamps: true }
);

// ==================================================
//       User schema UNIQUE values pugin
//       Path will add the name of the required keyvalue
// ==================================================

articleSchema.plugin(uniqueValidator, {
  message: "Sorry but the {PATH} already exists!"
});

// Export the Schema
module.exports = mongoose.model("Article", articleSchema);
