const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    country: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    images: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          filename: Joi.string().required(),
        })
      )
      .min(1)
      .max(5),

    category: Joi.string()
      .valid(
        "trending",
        "rooms",
        "iconicCities",
        "mountains",
        "castles",
        "amazingPools",
        "camping",
        "farms",
        "arctic",
        "domes"
      )
      .required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

module.exports.signupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordPattern).required().messages({
    "string.pattern.base":
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
  }),
});

module.exports.resetPasswordSchema = Joi.object({
  password: Joi.string().pattern(passwordPattern).required().messages({
    "string.pattern.base":
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
  }),
});

module.exports.changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().pattern(passwordPattern).required().messages({
    "string.pattern.base":
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
  }),
  confirmPassword: Joi.any()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
});
