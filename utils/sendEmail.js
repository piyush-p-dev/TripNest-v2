const nodemailer = require("nodemailer");
const templates = require("./emailTemplates");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"TripNest" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = {
  sendResetEmail: async (to, token) => {
    const resetLink = `https://tripnest-8vo9.onrender.com/reset-password/${token}`;
    const html = `
      <p>You requested a password reset.</p>
      <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
      <p>This link expires in 1 hour.</p>
    `;
    return sendEmail({ to, subject: "Password Reset - TripNest", html });
  },

  sendRegisterEmail: async (to, username) => {
    const html = `
    <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px;">
        <div style="background: #fe424d; color: white; padding: 20px; text-align: center;">
          <h1>Welcome to TripNest!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hi ${username},</p>
          <p>Thanks for signing up. We're excited to have you on board!</p>
          <a href="https://tripnest-8vo9.onrender.com/login" style="background: #fe424d; padding: 10px 15px; color: white; text-decoration: none; border-radius: 5px;">Log In</a>
        </div>
        <div style="background: #eee; text-align: center; padding: 10px;">
          <small>&copy; 2025 Tripnest. All rights reserved.</small>
        </div>
      </div>
    </div>
    `;
    return sendEmail({ to, subject: "Welcome - TripNest", html });
  },
  sendBookingConfirmation: async (
    guestEmail,
    guestName,
    hostEmail,
    hostName,
    listingTitle,
    checkIn,
    checkOut
  ) => {
    const guestHtml = templates.bookingConfirmationForGuest(
      guestName,
      listingTitle,
      checkIn,
      checkOut
    );
    const hostHtml = templates.bookingConfirmationForHost(
      hostName,
      listingTitle,
      guestName,
      checkIn,
      checkOut
    ); // Optional: create a separate host template if needed

    await sendEmail({
      to: guestEmail,
      subject: "Your Booking is Confirmed - TripNest",
      html: guestHtml,
    });
    await sendEmail({
      to: hostEmail,
      subject: "New Booking Received - TripNest",
      html: hostHtml,
    });
  },
  sendCancellationEmail: async (
    email,
    username,
    listingTitle,
    checkIn,
    cancelledByRole,
    isHost = false
  ) => {
    const html = templates.bookingCancellation(
      username,
      listingTitle,
      checkIn,
      cancelledByRole,
      isHost
    );

    await sendEmail({
      to: email,
      subject: "Booking Cancelled - TripNest",
      html,
    });
  },
};
