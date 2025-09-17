import { setLocalStorage, getLocalStorage, qs } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {};
  }

  async init() {
    // Fetch product details
    this.product = await this.dataSource.findProductById(this.productId);

    // Render the product HTML
    this.renderProductDetails();

    // Add click listener for Add to Cart
    qs('#addToCart').addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    let cart = getLocalStorage('so-cart') || [];
    if (!Array.isArray(cart)) cart = []; // ensure array
    cart.push(this.product);
    setLocalStorage('so-cart', cart);
    alert(`${this.product.Name} added to cart!`);
  }

  renderProductDetails() {
    qs('main').innerHTML = `
      <section class="product-detail">
        <h3>${this.product.Brand?.Name || ''}</h3>
        <h2 class="divider">${this.product.Name}</h2>
        <img class="divider" src="${this.product.Image}" alt="${this.product.Name}" />
        <p class="product-card__price">$${this.product.FinalPrice}</p>
        <p class="product__color">${this.product.Colors[0]?.ColorName || ''}</p>
        <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
        </div>
      </section>
    `;
  }
}