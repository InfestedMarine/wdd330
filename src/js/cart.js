import { getLocalStorage, setLocalStorage } from './utils.mjs';

function renderCartContents() {
  let cartItems = getLocalStorage('so-cart');

  // Normalize: make sure cartItems is an array
  if (!Array.isArray(cartItems)) {
    cartItems = cartItems ? [cartItems] : [];
  }

  // Build HTML
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  // Attach remove button listeners
  document.querySelectorAll('.cart-card__remove').forEach((btn) => {
    btn.addEventListener('click', removeFromCart);
  });
}

function cartItemTemplate(item) {
  return `<li class='cart-card divider'>
    <a href='#' class='cart-card__image'>
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <button class="cart-card__remove" data-id="${item.Id}">✖</button>
  </li>`;
}

function removeFromCart(e) {
  const id = e.currentTarget.dataset.id;
  let cartItems = getLocalStorage('so-cart') || [];

  // Normalize
  if (!Array.isArray(cartItems)) {
    cartItems = cartItems ? [cartItems] : [];
  }

  // Remove all matching items with the same Id
  const updatedCart = cartItems.filter((item) => item.Id !== id);

  setLocalStorage('so-cart', updatedCart);
  renderCartContents(); // re-render the updated cart
}

// Initial render
renderCartContents();

// import call loadHeaderFooter
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();