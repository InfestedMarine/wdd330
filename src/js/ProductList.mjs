import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  // Use PrimaryMedium for product list images
  const imgUrl = product.Images?.PrimaryMedium || '/images/fallback.png';
  return `<li class="product-card">
    <a href="../product_pages/product.html?product=${product.Id}">
      <img src="${imgUrl}" alt="Image of ${product.Name}">
      <h3 class="card__brand">${product.Brand?.Name || ''}</h3>
      <h2 class="card__name">${product.Name || ''}</h2>
      <p class="product-card__price">$${product.FinalPrice?.toFixed(2) || '0.00'}</p>
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
    try {
      const list = await this.dataSource.getData(this.category);
      console.log(`Fetched products for category "${this.category}":`, list);
      this.renderList(list);
    } catch (err) {
      console.error('Error fetching product list:', err);
      this.listElement.innerHTML = '<p>Failed to load products.</p>';
    }
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, 'afterbegin', true);
  }
}
