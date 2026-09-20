const User = require("../models/user.js");
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
const { sendResetEmail, sendRegisterEmail } = require("../utils/sendEmail");

// Renders the signup form
module.exports.renderSignupFrom = (req, res) => {
  res.render("users/signup.ejs");
};

// Handles user registration logic
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Register new user
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    // Automatically log in the user
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      sendRegisterEmail(email, username); // Send welcome email
      req.flash("success", "Welcome to TripNest");
      res.redirect("/listings");
    });
  } catch (err) {
    // Handle duplicate email error
    if (err.code === 11000 && err.keyPattern.email) {
      req.flash("error", "Email already exists");
    } else {
      req.flash("error", err.message);
    }
    res.redirect("/signup");
  }
};

// Renders the login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// Handles login success logic
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to TripNest!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// Handles logout
module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};

// Renders forgot password form
module.exports.forgotPasswordForm = (req, res) => {
  res.render("users/forgot-password");
};

// Handles forgot password form submission and sends reset email
module.exports.handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    req.flash("error", "No account with that email.");
    return res.redirect("/forgot-password");
  }

  // Generate reset token and expiry
  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  await user.save();

  await sendResetEmail(email, token); // Send reset link via email

  req.flash("success", "Password reset link sent to your email.");
  res.redirect("/login");
};

// Renders reset password form
module.exports.showResetForm = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }, // Check if token is still valid
  });

  if (!user) {
    req.flash("error", "Token is invalid or expired.");
    return res.redirect("/forgot-password");
  }

  res.render("users/reset-password", { token });
};

// Handles actual password reset
module.exports.handlePasswordReset = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error", "Token is invalid or expired.");
    return res.redirect("/forgot-password");
  }

  // Set new password
  await user.setPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  req.flash("success", "Password has been reset. You can now log in.");
  res.redirect("/login");
};

// Renders user profile page
module.exports.profile = (req, res) => {
  res.render("users/profile", { user: req.user });
};

// Updates user avatar
module.exports.updateAvatar = async (req, res) => {
  const user = await User.findById(req.user._id);
  // ✅ If no file was uploaded, skip update
  if (!req.file) {
    req.flash("error", "No image selected.");
    return res.redirect("/profile");
  }

  // Delete old avatar from cloudinary if exists
  if (user.avatar && user.avatar.filename) {
    try {
      await cloudinary.uploader.destroy(user.avatar.filename);
    } catch (err) {
      console.error("Cloudinary deletion error:", err);
    }
  }

  // Save new avatar details
  user.avatar = {
    url: req.file.path,
    filename: req.file.filename,
  };

  await user.save();
  req.flash("success", "Avatar updated!");
  res.redirect("/profile");
};

// Renders profile edit form
module.exports.renderEditForm = (req, res) => {
  res.render("users/edit", { user: req.user });
};

// Handles profile update form submission
module.exports.updateProfile = async (req, res) => {
  const { username, email, fullName, phone } = req.body;
  const user = await User.findById(req.user._id);

  user.username = username;
  user.email = email;
  user.fullName = fullName;
  user.phone = phone;

  await user.save();
  req.flash("success", "Profile updated successfully!");
  res.redirect("/profile");
};

// Renders change password form
module.exports.renderChangePassword = (req, res) => {
  res.render("users/changePassword");
};

// Handles change password logic
module.exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Ensure new and confirm passwords match
  if (newPassword !== confirmPassword) {
    req.flash("error", "New passwords do not match.");
    return res.redirect("/profile/change-password");
  }

  try {
    const user = await User.findById(req.user._id);

    // Authenticate current password
    const isValid = await user.authenticate(currentPassword);

    if (!isValid.user) {
      req.flash("error", "Current password is incorrect.");
      return res.redirect("/profile/change-password");
    }

    // Set and save new password
    await user.setPassword(newPassword);
    await user.save();

    req.flash("success", "Password changed successfully.");
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong.");
    res.redirect("/profile/change-password");
  }
};
