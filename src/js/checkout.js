import { loadHeaderFooter, alertMessage } from "./utils.mjs";
import CheckoutProcess from "../js/CheckoutProcess.mjs";

// Create a new CheckoutProcess instance
const checkout = new CheckoutProcess("so-cart", "#subtotal");

// Initialize it (loads cart + displays subtotal)
checkout.init();

document.addEventListener("DOMContentLoaded", () => {
  const zipInput = document.querySelector("#zip");
  if (zipInput) {
    zipInput.addEventListener("blur", () => {
      checkout.calculateOrderTotals();
    });
  }

  // Handle checkout form submission
  const form = document.querySelector("#checkout-form");
  if (form) {
    form.addEventListener("submit", async (event) => {
  
      event.preventDefault(); // always prevent default when using AJAX

      // Client-side HTML validation
      if (!form.checkValidity()) {  
        alertMessage("Please correct the highlighted fields before submitting.", true);
        form.reportValidity(); // still highlights fields
        return; // stop submission
            }
             try {
              // Attempt checkout
              await checkout.checkout(form);
               alertMessage("Order successfully placed!", true);
               localStorage.removeItem("so-cart");
               setTimeout(() => {
                window.location.href = "/checkout/success.html";
              }, 1500);
            } catch (err) {
              console.error("Checkout failed:", err);
              const message = err.message || "Something went wrong during checkout.";
              alertMessage(`Error: ${message}`, true);
            }
          });
        }

  loadHeaderFooter();
});