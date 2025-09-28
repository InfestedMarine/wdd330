import { setLocalStorage, getLocalStorage, qs } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = null; // better to start with null instead of {}
  }

  async init() {
    // Fetch product details
    this.product = await this.dataSource.findProductById(this.productId);

    // If no product found, show fallback and stop
    if (!this.product) {
      console.error("No product found for ID:", this.productId);
      qs("main").innerHTML = `<p>Sorry, product not found.</p>`;
      return;
    }

    // Render the product HTML
    this.renderProductDetails();

    // Add click listener for Add to Cart (guarded with ?)
    qs('#addToCart')?.addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    let cart = getLocalStorage('so-cart') || [];
    if (!Array.isArray(cart)) cart = []; // make sure it's an array
    cart.push(this.product);
    setLocalStorage('so-cart', cart);
    alert(`${this.product.Name || "Unknown product"} added to cart!`);
  }

  renderProductDetails() {
    qs('main').innerHTML = `
      <section class="product-detail">
        <h3>${this.product.Brand?.Name || ''}</h3>
        <h2 class="divider">${this.product.Name || ''}</h2>
        <img class="divider" src="${this.product.Image || ''}" alt="${this.product.Name || ''}" />
        <p class="product-card__price">$${this.product.FinalPrice ?? ''}</p>
        <p class="product__color">${this.product.Colors?.[0]?.ColorName || ''}</p>
        <p class="product__description">${this.product.DescriptionHtmlSimple || ''}</p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${this.product.Id || ''}">Add to Cart</button>
        </div>
      </section>
    `;
  }
}
