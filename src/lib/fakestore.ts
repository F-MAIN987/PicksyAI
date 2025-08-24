export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  why: string;
  rating: number;
  inStock: boolean;
  eta: string;
  category: string;
}

export const fetchProducts = async (): Promise<FakeStoreProduct[]> => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const convertToProduct = (fakeProduct: FakeStoreProduct): Product => {
  return {
    id: fakeProduct.id.toString(),
    name: fakeProduct.title,
    price: `₹${Math.round(fakeProduct.price * 83)}`, // Convert USD to INR approximately
    image: fakeProduct.image,
    why: fakeProduct.description.split('.')[0] + '.',
    rating: fakeProduct.rating.rate,
    inStock: true,
    eta: "2-3 days",
    category: fakeProduct.category
  };
};

export const getProductsByCategory = async (category?: string): Promise<Product[]> => {
  const allProducts = await fetchProducts();
  let filteredProducts = allProducts;
  
  if (category) {
    filteredProducts = allProducts.filter(p => 
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  return filteredProducts.map(convertToProduct);
};