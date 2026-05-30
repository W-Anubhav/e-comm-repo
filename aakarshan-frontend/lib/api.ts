const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all product listings, option to filter by category
 */
export async function fetchProducts(category?: string): Promise<Product[]> {
  try {
    const url = category ? `${API_URL}/products?category=${encodeURIComponent(category)}` : `${API_URL}/products`;
    const response = await fetch(url, {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchProducts API helper:', error);
    throw error;
  }
}

/**
 * Fetch single product details by UUID
 */
export async function fetchProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to retrieve product details');
  }
  return await response.json();
}

/**
 * Create a new product listing (Protected: Admin Auth needed)
 */
export async function createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<Product> {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to create product listing');
  }
  return await response.json();
}

/**
 * Update an existing product listing (Protected: Admin Auth needed)
 */
export async function updateProduct(id: string, productData: Partial<Product>, token: string): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to update product details');
  }
  return await response.json();
}

/**
 * Delete a product listing (Protected: Admin Auth needed)
 */
export async function deleteProduct(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to delete product listing');
  }
}

/**
 * Upload clothing photo to Cloud storage (Protected: Admin Auth needed)
 */
export async function uploadImage(file: File, token: string): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to upload photo to server');
  }

  const data = await response.json();
  return data.image_url;
}

/**
 * Log in admin locally inside our Express JWT endpoint
 */
export async function loginAdmin(email: string, password: string): Promise<{ token: string; user: any }> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to authenticate admin');
  }

  return await response.json();
}
