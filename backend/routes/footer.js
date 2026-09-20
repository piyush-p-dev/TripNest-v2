const express = require("express");
const router = express.Router();
const footerController = require("../controllers/footer");

router.get("/about", footerController.renderAbout);
router.get("/services", footerController.renderServices);
router.get("/privacy", footerController.renderPrivacy);

router.get("/faq", footerController.renderFaq);
router.get("/contact", footerController.renderContact);
router.get("/payment", footerController.renderPayment);

router.get("/destinations", footerController.renderDestination);
router.get("/blog", footerController.renderBlog);

router.post("/contact/thankyou", footerController.renderThank);

module.exports = router;
