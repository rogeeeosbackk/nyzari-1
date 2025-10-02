// src/pages/Admin.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Package, ShoppingCart, DollarSign } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    images: ['', '', ''], // 3 images
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>(['', '', '']);

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { toast } = useToast();

  // Check admin auth on mount
  useEffect(() => {
    const adminAuth = localStorage.getItem('nyrazari-admin');
    if (adminAuth === 'authenticated') setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    if (password === 'NyraZari@2155') {
      setIsAuthenticated(true);
      localStorage.setItem('nyrazari-admin', 'authenticated');
      toast({ title: 'Welcome', description: 'Logged in as admin.' });
    } else {
      toast({ title: 'Auth Failed', description: 'Wrong password', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('nyrazari-admin');
    setPassword('');
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', category: '', description: '', stock: '', images: ['', '', ''] });
    setImagePreviews(['', '', '']);
    setEditingProduct(null);
  };

  const handleFileSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const newPreviews = [...imagePreviews];
      const newImages = [...formData.images];
      newPreviews[index] = result;
      newImages[index] = result;
      setImagePreviews(newPreviews);
      setFormData(prev => ({ ...prev, images: newImages }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      toast({ title: 'Missing fields', description: 'Name, price, category required', variant: 'destructive' });
      return;
    }

    const productData: Omit<Product, 'id'> = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      stock: parseInt(formData.stock) || 0,
      image: formData.images.map(img => img || '/assets/placeholder.jpg'),
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast({ title: 'Updated', description: `${formData.name} updated` });
    } else {
      addProduct(productData);
      toast({ title: 'Added', description: `${formData.name} added` });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      stock: product.stock.toString(),
      images: product.image,
    });
    setImagePreviews(product.image);
    setIsDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`Delete ${product.name}?`)) {
      deleteProduct(product.id);
      toast({ title: 'Deleted', description: `${product.name} removed` });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <motion.div className="card-luxury p-8 max-w-md w-full mx-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
            <p className="text-muted-foreground">Enter password</p>
          </div>
          <div className="space-y-4 relative">
            <Input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleLogin()} />
            <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button onClick={handleLogin} className="w-full btn-luxury">Login</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div className="flex justify-between items-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div>
            <h1 className="text-4xl font-bold">Admin <span className="text-luxury">Dashboard</span></h1>
            <p className="text-muted-foreground">Manage catalog</p>
          </div>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </motion.div>

        {/* Add Product Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-luxury" onClick={resetForm}><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium mb-2 block">Product Name *</label><Input value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} /></div>
                <div><label className="text-sm font-medium mb-2 block">Price *</label><Input type="number" value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))} /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category *</label>
                  <Select value={formData.category} onValueChange={value => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rings">Rings</SelectItem>
                      <SelectItem value="necklaces">Necklaces</SelectItem>
                      <SelectItem value="bracelets">Bracelets</SelectItem>
                      <SelectItem value="earrings">Earrings</SelectItem>
                      <SelectItem value="watches">Watches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><label className="text-sm font-medium mb-2 block">Stock</label><Input type="number" value={formData.stock} onChange={e => setFormData(prev => ({ ...prev, stock: e.target.value }))} /></div>
              </div>

              {/* Images */}
              <div>
                <label className="text-sm font-medium mb-2 block">Product Images</label>
                <div className="grid grid-cols-3 gap-4">
                  {imagePreviews.map((img, index) => (
                    <div key={index} className="space-y-2">
                      <Input type="file" accept="image/*" onChange={e => handleFileSelect(index, e)} className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
                      {img && <img src={img} alt={`Preview ${index}`} className="w-24 h-24 object-cover rounded-lg border" />}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea rows={3} value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="btn-luxury">{editingProduct ? 'Update' : 'Add'}</Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Products Table */}
        <motion.div className="card-luxury overflow-hidden mt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="p-4 flex items-center space-x-3">
                      <img src={product.image[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-muted" />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{product.description}</div>
                      </div>
                    </td>
                    <td className="p-4 capitalize">{product.category}</td>
                    <td className="p-4 font-medium">₹{product.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{product.stock} units</span>
                    </td>
                    <td className="p-4 flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)}><Edit className="h-3 w-3" /></Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(product)} className="text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
