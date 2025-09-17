import { renderListWithTemplate } from './utils.mjs';

// Template function for product cards
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=${product.id}">
      <img src="${product.image}" alt="Image of ${product.name}">
      <h3 class="card__brand">${product.brand}</h3>
      <h2 class="card__name">${product.name}</h2>
      <p class="product-card__price">$${product.price.toFixed(2)}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    // Filter products by category if needed
    const filteredList = list.filter(p => p.category === this.category);
    this.renderList(filteredList);
  }

  renderList(list) {
    // Use utility function to render
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }
}
