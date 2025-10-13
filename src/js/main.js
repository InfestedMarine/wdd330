import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';

const externalServices = new ExternalServices();
const productListElement = document.querySelector('.product-list');

// Create a ProductList instance
const tentsList = new ProductList('tents', externalServices, productListElement);
tentsList.init();

// import call loadHeaderFooter
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();