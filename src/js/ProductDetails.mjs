import { setLocalStorage, getLocalStorage, qs, getParam } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

export default class ProductDetails {
  constructor(productId) {
    this.productId = productId;
    this.product = null;
    this.dataSource = new ExternalServices();
  }

  

  async init() {
    // Fetch product details from API
    this.product = await this.dataSource.findProductById(this.productId);

    // If no product found, show fallback
    if (!this.product) {
      console.error("No product found for ID:", this.productId);
      qs("main").innerHTML = `<p>Sorry, product not found.</p>`;
      return;
    }

    // Render product details
    this.renderProductDetails();

    // Add click listener for Add to Cart
    qs('#addToCart')?.addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    let cart = getLocalStorage('so-cart') || [];
    if (!Array.isArray(cart)) cart = [];
    
    // Normalize the product object before saving
    const productToAdd = {
    Id: this.product.Id,
    Name: this.product.Name,
    FinalPrice: parseFloat(this.product.FinalPrice) || parseFloat(this.product.ListPrice) || 0,
    quantity: 1,
    Brand: this.product.Brand?.Name || "Unknown Brand",
    Image: this.product.Images?.PrimaryMedium || "/images/fallback.png",
    Color: this.product.Colors?.[0]?.ColorName || "N/A",
    Category: this.product.Category,
  };

  // Optional: check if item already in cart (increase quantity instead)
  const existing = cart.find(item => item.Id === productToAdd.Id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(productToAdd);
  }

  setLocalStorage('so-cart', cart);
  alert(`${productToAdd.Name} added to cart!`);
}

  renderProductDetails() {
    qs('main').innerHTML = `
      <section class="product-detail">
        <h3>${this.product.Brand?.Name || ''}</h3>
        <h2 class="divider">${this.product.Name || ''}</h2>
        <img class="divider" src="${this.product.Images?.PrimaryLarge || '/images/fallback.png'}" alt="${this.product.Name || ''}" />
        <p class="product-card__price">$${this.product.FinalPrice?.toFixed(2) || '0.00'}</p>
        <p class="product__color">${this.product.Colors?.[0]?.ColorName || ''}</p>
        <p class="product__description">${this.product.DescriptionHtmlSimple || ''}</p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${this.product.Id || ''}">Add to Cart</button>
        </div>
      </section>
    `;
  }
}

const productId = getParam('product'); // get ID from URL query string
console.log('Product ID:', productId);
const productPage = new ProductDetails(productId);
productPage.init();


