module.exports = {
  bookingConfirmationForGuest: (username, listingTitle, checkIn, checkOut) => `
    <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px;">
        <div style="background: #28a745; color: white; padding: 20px; text-align: center;">
          <h1>Booking Confirmed!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hi ${username},</p>
          <p>Your booking for <strong>${listingTitle}</strong> is confirmed.</p>
          <p><strong>Check-in:</strong> ${new Date(checkIn).toDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(
            checkOut
          ).toDateString()}</p>
          <p>We hope you have a great stay!</p>
        </div>
        <div style="background: #eee; text-align: center; padding: 10px;">
          <small>&copy; 2025 Tripnest. All rights reserved.</small>
        </div>
      </div>
    </div>
  `,
  bookingConfirmationForHost: (
    username,
    listingTitle,
    guestName,
    checkIn,
    checkOut
  ) => `
  <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px;">
      <div style="background: #007bff; color: white; padding: 20px; text-align: center;">
        <h1>New Booking Received!</h1>
      </div>
      <div style="padding: 20px;">
        <p>Hi ${username},</p>
        <p>Your listing <strong>${listingTitle}</strong> has been booked by <strong>${guestName}</strong>.</p>
        <p><strong>Check-in:</strong> ${new Date(checkIn).toDateString()}</p>
        <p><strong>Check-out:</strong> ${new Date(checkOut).toDateString()}</p>
        <p>Get ready to welcome your guest!</p>
      </div>
      <div style="background: #eee; text-align: center; padding: 10px;">
        <small>&copy; 2025 TripNest. All rights reserved.</small>
      </div>
    </div>
  </div>
`,

  bookingCancellation: (
    username,
    listingTitle,
    checkIn,
    cancelledByRole,
    isHost = false
  ) => {
    const message = isHost
      ? `The booking for your listing `
      : `Your booking for `;
    return `
      <div style="font-family: sans-serif; padding: 20px; background-color: #fff4f4;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px;">
          <div style="background: #fe424d; color: white; padding: 20px; text-align: center;">
            <h2>Booking Cancelled</h2>
          </div>
          <div style="padding: 20px;">
            <p>Hi ${username},</p>
            <p>${message} <strong>${listingTitle}</strong> starting on <strong> ${new Date(
      checkIn
    ).toDateString()} </strong> has been cancelled by ${cancelledByRole}.</p>
            <p>If this was not expected, please contact support.</p>
          </div>
          <div style="background: #eee; text-align: center; padding: 10px;">
            <small>&copy; 2025 TripNest. All rights reserved.</small>
          </div>
        </div>
      </div>
    `;
  },
};
