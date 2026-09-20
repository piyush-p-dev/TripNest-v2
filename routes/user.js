const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {
  saveRedirectUrl,
  isLoggedIn,
  validateSignup,
  validateResetPassword,
  validateChangePassword,
} = require("../middleware.js");
const userController = require("../controllers/user.js");
const multer = require("multer");
const { getStorage } = require("../cloudConfig");
const uploadProfile = multer({ storage: getStorage("Profile") }); // case-sensitive folder

router
  .route("/signup")
  .get(userController.renderSignupFrom) //signup form
  .post(validateSignup, wrapAsync(userController.signup)); //signing in

router
  .route("/login")
  .get(userController.renderLoginForm) //login form
  .post(
    //logging in
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);
router.get("/profile", isLoggedIn, userController.profile);
router.post(
  "/profile/avatar",
  isLoggedIn,
  uploadProfile.single("avatar"), // ✅ now correctly uses the profile folder
  userController.updateAvatar
);
router.get("/profile/edit", isLoggedIn, userController.renderEditForm);
router.post("/profile/edit", isLoggedIn, userController.updateProfile);

// for change password
router.get(
  "/profile/change-password",
  isLoggedIn,
  userController.renderChangePassword
);
router.post(
  "/profile/change-password",
  isLoggedIn,
  validateChangePassword,
  userController.changePassword
);

// for forgot password
router
  .route("/forgot-password")
  .get(userController.forgotPasswordForm)
  .post(userController.handleForgotPassword);

// for reset password
router
  .route("/reset-password/:token")
  .get(userController.showResetForm)
  .post(validateResetPassword, userController.handlePasswordReset);

module.exports = router;
