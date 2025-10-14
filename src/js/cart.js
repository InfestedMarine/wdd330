import { getLocalStorage, setLocalStorage } from "./utils.mjs";
// import call loadHeaderFooter
import { loadHeaderFooter } from "./utils.mjs";

function renderCartContents() {
  let cartItems = getLocalStorage("so-cart");

  // Normalize: make sure cartItems is an array
  if (!Array.isArray(cartItems)) {
    cartItems = cartItems ? [cartItems] : [];
  }

  // Build HTML
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  document.querySelectorAll(".cart-card__remove").forEach((btn) => {
    btn.addEventListener("click", removeFromCart);
  });

  updateCartTotal();
}

function cartItemTemplate(item) {
  const imgUrl = item.Image || "/images/fallback.png";
  const colorName = item.Color || "N/A";

  return `<li class='cart-card divider'>
    <a href='#' class='cart-card__image'>
      <img src="${imgUrl}" alt="${item.Name || "Product"}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name || ""}</h2>
    </a>
    <p class="cart-card__color">${colorName}</p>
    <p class="cart-card__quantity">qty: ${item.quantity}</p>
    <p class="cart-card__price">$${item.FinalPrice?.toFixed(2) || "0.00"}</p>
    <button class="cart-card__remove" data-id="${item.Id}">✖</button>
  </li>`;
}

function removeFromCart(e) {
  const id = e.currentTarget.dataset.id;
  let cartItems = getLocalStorage("so-cart") || [];
  if (!Array.isArray(cartItems)) cartItems = cartItems ? [cartItems] : [];

  const updatedCart = cartItems.map((item) => {
    if (item.Id === id) {
      // Decrement quantity, but keep at least 0
      return { ...item, quantity: item.quantity - 1 };
    }
    return item;
  }).filter(item => item.quantity > 0); // Remove items with qty <= 0

  setLocalStorage("so-cart", updatedCart);
  renderCartContents();
}

function updateCartTotal() {
  let cartItems = getLocalStorage("so-cart") || [];
  if (!Array.isArray(cartItems)) cartItems = cartItems ? [cartItems] : [];

  const cartFooter = document.querySelector(".cart-footer");
  const cartTotalSpan = document.querySelector("#cartTotal");

  if (cartItems.length > 0) {
    cartFooter.classList.remove("hide");
    const total = cartItems.reduce(
      (sum, item) => sum + (item.FinalPrice || 0) * (item.quantity || 1),
      0,
    );

    // Update HTML
    cartTotalSpan.textContent = `$${total.toFixed(2)}`;
  } else {
    // Hide footer if cart is empty
    cartFooter.classList.add("hide");
  }
}

// Initial render
renderCartContents();

// Load header/footer
loadHeaderFooter();
