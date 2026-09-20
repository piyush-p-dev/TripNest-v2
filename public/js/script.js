// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

//toggle switch for tax
let taxSwitch = document.getElementById("taxToggle");

taxSwitch.addEventListener("click", () => {
  let beforePrices = document.querySelectorAll(".price-before");
  let afterPrices = document.querySelectorAll(".price-after");

  beforePrices.forEach((el) => el.classList.toggle("d-none"));
  afterPrices.forEach((el) => el.classList.toggle("d-none"));
});
