import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key; // cart key from localStorage
    this.outputSelector = outputSelector;
    this.cartItems = [];
  }

  init() {
    this.cartItems = this.getCartItems();
    this.displaySubtotal();
  }

  getCartItems() {
    const cartJSON = localStorage.getItem(this.key);
    return cartJSON ? JSON.parse(cartJSON) : [];
  }

  displaySubtotal() {
    const subtotal = this.cartItems.reduce((sum, item) => sum + item.FinalPrice * item.quantity, 0);
    document.querySelector(this.outputSelector).innerText = subtotal.toFixed(2);
  }

  calculateOrderTotals() {
    const subtotal = this.cartItems.reduce((sum, item) => sum + item.FinalPrice * item.quantity, 0);
    const tax = subtotal * 0.06;
    const shipping = 10 + (this.cartItems.length - 1) * 2;
    const orderTotal = subtotal + tax + shipping;

    document.querySelector('#subtotal').innerText = subtotal.toFixed(2);
    document.querySelector('#tax').innerText = tax.toFixed(2);
    document.querySelector('#shipping').innerText = shipping.toFixed(2);
    document.querySelector('#orderTotal').innerText = orderTotal.toFixed(2);

    return { subtotal, tax, shipping, orderTotal };
  }

  packageItems(items) {
    return items.map(item => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.quantity
    }));
  }

  async checkout(form) {
  const formData = new FormData(form);
  const orderData = {};
  formData.forEach((value, key) => (orderData[key] = value));

  const totals = this.calculateOrderTotals();
  orderData.orderDate = new Date().toISOString();
  orderData.orderTotal = totals.orderTotal.toFixed(2);
  orderData.tax = totals.tax.toFixed(2);
  orderData.shipping = totals.shipping;
  orderData.items = this.packageItems(this.cartItems);

  try {
    const result = await new ExternalServices().checkout(orderData);
    console.log('Checkout successful', result);

    // Happy path: success page + clear cart
    localStorage.removeItem(this.key);
    window.location.href = '/checkout/success.html';
  } catch (err) {
    console.error('Checkout error:', err);
    // show user-friendly message
    alertMessage(
      typeof err.message === 'object' ? JSON.stringify(err.message) : err.message
    );
  }
}
}
