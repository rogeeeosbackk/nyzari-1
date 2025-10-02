// src/contexts/ProductContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './CartContext';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
  categories: string[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// ✅ Initial products with 3 images each
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Silver Antique Set',
    price: 2899,
    offerPrice: 2299,
    images: [
      '/assets/silver-antique-set1.jpg',
      '/assets/silver-antique-set2.jpg',
      '/assets/silver-antique-set3.jpg',
    ],
    category: 'necklaces',
    description: 'Exquisite silver eternity featuring brilliant-cut jewels',
    stock: 5,
  },
  {
    id: '2',
    name: 'Stone Necklace',
    price: 799,
    images: [
      '/assets/stone-neck-blue.jpg',
      '/assets/stone-neck-green.jpg',
      '/assets/stone-neck-red.jpg',
    ],
    category: 'necklaces',
    description: 'Classic blue necklace with cute Stones',
    stock: 15,
  },
  {
    id: '3',
    name: 'Korean Stud',
    price: 3299,
    offerPrice: 2799,
    images: [
      '/assets/korean-stud1.jpg',
      '/assets/korean-stud2.jpg',
      '/assets/korean-stud3.jpg',
    ],
    category: 'earrings',
    description: 'Art deco inspired ruby ring with diamond accents',
    stock: 3,
  },
  // Add more products here as needed
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    // Try loading from localStorage first
    const stored = localStorage.getItem('nyrazari-products');
    return stored ? JSON.parse(stored) : initialProducts;
  });

  // Persist products to localStorage on change
  useEffect(() => {
    localStorage.setItem('nyrazari-products', JSON.stringify(products));
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...productData, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product => (product.id === id ? { ...product, ...updates } : product))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProductById = (id: string) => products.find(product => product.id === id);

  const getProductsByCategory = (category: string) =>
    products.filter(product => product.category === category);

  const searchProducts = (query: string) => {
    const lower = query.toLowerCase();
    return products.filter(
      product =>
        product.name.toLowerCase().includes(lower) ||
        product.description.toLowerCase().includes(lower) ||
        product.category.toLowerCase().includes(lower)
    );
  };

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getProductsByCategory,
        searchProducts,
        categories,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};
