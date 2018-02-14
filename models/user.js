
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');


// Add special validation to the schema
const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} this is not a valid role'
}

const userSchema = new Schema(
  {
    // User's name has to be unique
    email: {
      type: String,
      unique: true,
      required: [true, "The email has to be unique"],
      minlength: [6, "Minimum length of email must be 6 characters"],
      trim: true
    },
    name: {
      type: String,
      required: [true, "The name is required"]
    },
    password: {
      type: String,
      required: [true, "The password is required"],
      minlength: [6, "Minimum length of password must be 6 characters"]
    },
    img: {
      type: String,
      required: false
    },
    role: {
      type: String,
      required: false,
      default: "USER_ROLE",
      enum: validRoles
    },
    google: {
      type: Boolean,
      required: true,
      default: false
    }
  },{timestamps: true}
);

userSchema.plugin(uniqueValidator,{ message: 'Sorry but the {PATH} already exists!' })


// Export the Schema
module.exports = mongoose.model('User', userSchema);


