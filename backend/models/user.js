const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, //  Ensures email is not duplicate
  },
  resetPasswordToken: String, // Stores password reset token
  resetPasswordExpires: Date, //  Expiry for password reset
  createdAt: { type: Date, default: Date.now }, // Timestamp of account creation
  fullName: String,
  avatar: {
    url: String, //  Cloudinary image URL
    filename: String, // Used to delete image from cloudinary
  },
  phone: Number,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
