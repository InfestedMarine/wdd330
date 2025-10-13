// import call loadHeaderFooter
import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "../js/CheckoutProcess.mjs";

// Create a new CheckoutProcess instance
const checkout = new CheckoutProcess("so-cart", "#subtotal");

// Initialize it (loads cart + displays subtotal)
checkout.init();

// ✅ Wait for the DOM to load before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
  // When ZIP code field loses focus, recalculate totals
  const zipInput = document.querySelector("#zip");
  if (zipInput) {
    zipInput.addEventListener("blur", () => {
      checkout.calculateOrderTotals();
    });
  }

  // Handle checkout form submission
  const form = document.querySelector("#checkout-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      // Let browser validation happen first
      if (!form.checkValidity()) {
        // Show native validation UI
        form.reportValidity();
        return;
      }

      event.preventDefault(); // prevent normal submit
      checkout.checkout(event.target); // call checkout function
    });
  }

  // Load the site header & footer
  loadHeaderFooter();
});