document.addEventListener("DOMContentLoaded", function () {
  const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD
  const pricePerNight = window.pricePerNight || 0;

  const checkInInput = document.querySelector("#checkIn");
  const checkOutInput = document.querySelector("#checkOut");
  const nightCount = document.querySelector("#nightCount");
  const gstAmount = document.querySelector("#gstAmount");
  const totalPrice = document.querySelector("#totalPrice");

  let checkInDate = null;

  const checkOutFlatpickr = flatpickr(checkOutInput, {
    dateFormat: "Y-m-d",
    minDate: today,
    onChange: calculatePrice,
  });

  flatpickr(checkInInput, {
    dateFormat: "Y-m-d",
    minDate: today,
    onChange: function (selectedDates) {
      checkInDate = selectedDates[0];
      if (!checkInDate) return;

      // Set checkout's minimum date to 1 day after check-in
      const minCheckout = new Date(checkInDate);
      minCheckout.setDate(minCheckout.getDate() + 1);
      checkOutFlatpickr.set("minDate", minCheckout);

      calculatePrice();
    },
  });

  function calculatePrice() {
    const checkInVal = checkInInput.value;
    const checkOutVal = checkOutInput.value;

    if (checkInVal && checkOutVal) {
      const start = new Date(checkInVal);
      const end = new Date(checkOutVal);

      if (end <= start) {
        alert("Check-out date must be after check-in date.");
        checkOutInput.value = "";
        nightCount.textContent = 0;
        gstAmount.textContent = "0.00";
        totalPrice.textContent = "0.00";
        return;
      }

      const nights = (end - start) / (1000 * 60 * 60 * 24);
      const subtotal = nights * pricePerNight;
      const gst = subtotal * 0.18;
      const total = subtotal + gst;

      nightCount.textContent = nights;
      gstAmount.textContent = gst.toFixed(2);
      totalPrice.textContent = total.toFixed(2);
    } else {
      nightCount.textContent = 0;
      gstAmount.textContent = "0.00";
      totalPrice.textContent = "0.00";
    }
  }
});
