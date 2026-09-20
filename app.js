// Load environment variables from .env file
require("dotenv").config();

// Import required modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser"); // Used for parsing raw request bodies (e.g., Stripe webhooks)
const methodOverride = require("method-override"); // Allows PUT & DELETE from forms
const ejsMate = require("ejs-mate"); // EJS layout support
const ExpressError = require("./utils/ExpressError.js"); // Custom error class
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); // Flash messages for success/error
const passport = require("passport");
const LocalStrategy = require("passport-local");

// User model with passport-local-mongoose
const User = require("./models/user.js");

// Route imports
const footerRouter = require("./routes/footer.js");
const adminRoutes = require("./routes/admin");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRoutes = require("./routes/bookings");

// MongoDB connection string
const dbUrl = process.env.ATLASDB_URL;

// Connect to MongoDB
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// View engine and public/static file config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate); // Use ejs-mate for layouts
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride("_method")); // Support PUT/DELETE with query param
app.use(express.static(path.join(__dirname, "/public"))); // Serve static files

// Session configuration
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET, // Should be stored in env for production
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // Protect from client-side JS access
  },
};

app.use(session(sessionOptions));
app.use(flash()); // Use flash for temp messages

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Use User model's authenticate method with passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to make flash messages and user available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Route setup
app.use("/listings", listingsRouter);
app.use("/", footerRouter);
app.use("/bookings", bookingRoutes); // General booking routes
app.use("/listings/:id/bookings", bookingRoutes); // Booking under specific listing
app.use("/listings/:id/reviews/", reviewsRouter);
app.use("/", userRouter); // Signup/Login/Profile
app.use("/admin", adminRoutes);

// Stripe webhook route (must use raw body)
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  require("./controllers/payment").handleStripeWebhook
);

// Catch-all for undefined routes (404)
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Global error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start server
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
