const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}


export default class ProductData {

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result; // the API wraps products in Result
    }
    async findProductById(id) {
  if (!id) return null;

  // Ensure baseURL ends with slash
  const apiURL = baseURL.endsWith('/') ? baseURL : baseURL + '/';
  const url = `${apiURL}product/${id}`;

  try {
    const response = await fetch(url);

    // If we get HTML, bail out
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.error('Expected JSON but got:', contentType);
      return null;
    }
     const data = await response.json();
     return data.Result;
    } catch (err) {
       console.error('Error fetching product:', err);
       return null;
      }
    }
      
  }
