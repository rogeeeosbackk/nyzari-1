// ProductContext.tsx
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

// ✅ All image files must exist inside /public/assets (case-sensitive!)
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Silver Antique Set',
    price: 2899,
    offerPrice: 2299,
    image: '/assets/silver-antique-set1.jpg',
    category: 'necklaces',
    description: 'Exquisite 18k white gold eternity ring featuring brilliant-cut diamonds',
    stock: 5,
  },
  {
    id: '2',
    name: 'Rose Gold Wedding Band',
    price: 799,
    image: '/assets/ring-rose-gold-band.jpg',
    category: 'rings',
    description: 'Classic rose gold wedding band with subtle texture',
    stock: 15,
  },
  {
    id: '3',
    name: 'Korean Stud',
    price: 3299,
    offerPrice: 2799,
    image: '/assets/korean-stud1.jpg',
    category: 'rings',
    description: 'Art deco inspired ruby ring with diamond accents',
    stock: 3,
  },
  {
    id: '4',
    name: 'Platinum Solitaire',
    price: 4599,
    image: '/assets/ring-rose-gold-band.jpg',
    category: 'rings',
    description: 'Classic platinum solitaire engagement ring',
    stock: 7,
  },
  {
    id: '5',
    name: 'Moonstone Cocktail Ring',
    price: 1299,
    offerPrice: 999,
    image: '/assets/ring-diamond-eternity.jpg',
    category: 'rings',
    description: 'Statement moonstone ring in yellow gold setting',
    stock: 9,
  },
  {
    id: '6',
    name: 'Tanzanite Cluster Ring',
    price: 2299,
    image: '/assets/ring-rose-gold-band.jpg',
    category: 'rings',
    description: 'Unique tanzanite cluster design in white gold',
    stock: 4,
  },
  {
    id: '7',
    name: 'Opal Anniversary Band',
    price: 1599,
    offerPrice: 1299,
    image: '/assets/ring-diamond-eternity.jpg',
    category: 'rings',
    description: 'Delicate opal anniversary band with milgrain details',
    stock: 8,
  },
  {
    id: '8',
    name: 'Black Diamond Ring',
    price: 1899,
    image: '/assets/ring-rose-gold-band.jpg',
    category: 'rings',
    description: 'Modern black diamond ring in rose gold',
    stock: 6,
  },
  {
    id: '9',
    name: 'Emerald Cut Aquamarine Ring',
    price: 2799,
    offerPrice: 2399,
    image: '/assets/ring-diamond-eternity.jpg',
    category: 'rings',
    description: 'Stunning emerald cut aquamarine with diamond halo',
    stock: 5,
  },
  {
    id: '10',
    name: 'Vintage Inspired Sapphire Ring',
    price: 3499,
    image: '/assets/ring-rose-gold-band.jpg',
    category: 'rings',
    description: 'Blue sapphire ring with vintage filigree work',
    stock: 3,
  },

  // Necklaces
  {
    id: '11',
    name: 'Gold Chain Necklace',
    price: 1599,
    offerPrice: 1299,
    image: '/assets/necklace-gold-chain.jpg',
    category: 'necklaces',
    description: 'Luxurious 14k gold chain necklace with adjustable length',
    stock: 8,
  },
  {
    id: '12',
    name: 'Emerald Pendant Necklace',
    price: 2199,
    image: '/assets/necklace-emerald-pendant.jpg',
    category: 'necklaces',
    description: 'Stunning emerald pendant on delicate gold chain',
    stock: 4,
  },
  {
    id: '13',
    name: 'Diamond Solitaire Pendant',
    price: 1899,
    offerPrice: 1599,
    image: '/assets/necklace-gold-chain.jpg',
    category: 'necklaces',
    description: 'Classic diamond solitaire pendant in white gold',
    stock: 12,
  },
  {
    id: '14',
    name: 'Pearl Strand Necklace',
    price: 899,
    image: '/assets/necklace-emerald-pendant.jpg',
    category: 'necklaces',
    description: 'Cultured pearl strand with gold clasp',
    stock: 15,
  },
  {
    id: '15',
    name: 'Layered Gold Chains',
    price: 699,
    offerPrice: 549,
    image: '/assets/necklace-gold-chain.jpg',
    category: 'necklaces',
    description: 'Trendy layered gold chain set',
    stock: 20,
  },
  {
    id: '16',
    name: 'Ruby Heart Pendant',
    price: 1499,
    image: '/assets/necklace-emerald-pendant.jpg',
    category: 'necklaces',
    description: 'Romantic ruby heart pendant with diamond accent',
    stock: 7,
  },
  {
    id: '17',
    name: 'Sapphire Bar Necklace',
    price: 1299,
    offerPrice: 1099,
    image: '/assets/necklace-gold-chain.jpg',
    category: 'necklaces',
    description: 'Modern sapphire bar pendant on delicate chain',
    stock: 10,
  },
  {
    id: '18',
    name: 'Vintage Locket',
    price: 799,
    image: '/assets/necklace-emerald-pendant.jpg',
    category: 'necklaces',
    description: 'Antique-inspired gold locket with engraving',
    stock: 6,
  },
  {
    id: '19',
    name: 'Tennis Diamond Necklace',
    price: 3999,
    offerPrice: 3399,
    image: '/assets/necklace-gold-chain.jpg',
    category: 'necklaces',
    description: 'Luxurious tennis diamond necklace',
    stock: 2,
  },
  {
    id: '20',
    name: 'Turquoise Statement Necklace',
    price: 1199,
    image: '/assets/necklace-emerald-pendant.jpg',
    category: 'necklaces',
    description: 'Bold turquoise statement piece in silver',
    stock: 8,
  },
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // 🔥 Always clear localStorage on reload to ensure code edits take effect
  useEffect(() => {
    localStorage.removeItem('nyrazari-products');
    setProducts(initialProducts);
  }, []);

  // Save current products for runtime updates (add/update/delete)
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
