import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

const productData = new ProductData();
const productListElement = document.querySelector('.product-list');

// Create a ProductList instance
const tentsList = new ProductList('tents', productData, productListElement);
tentsList.init();

// import call loadHeaderFooter
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();