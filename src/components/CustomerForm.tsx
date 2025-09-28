import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const customerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().min(10, 'Phone number must be at least 10 digits').max(20),
  address: z.string().trim().min(10, 'Address must be at least 10 characters').max(500),
  city: z.string().trim().min(2, 'City must be at least 2 characters').max(100),
  postalCode: z.string().trim().min(4, 'Postal code must be at least 4 characters').max(10),
  notes: z.string().max(1000).optional(),
});

export interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
  cartItems: CartItem[]; // ✅ include cart items
}

interface CustomerFormProps {
  cartItems: CartItem[];
  isLoading?: boolean;
  onSubmit?: (data: CustomerData) => void; // optional callback for parent handling WhatsApp/modal
}

const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSdDegYUC3MKGv3_-gmbTBRaA-MXymivkiux1F1VxD3VeGFvfQ/formResponse';

const ENTRY_IDS = {
  name: 'entry.325378209',
  email: 'entry.629337478',
  phone: 'entry.2035764280',
  address: 'entry.2123084750',
  city: 'entry.528762314',
  postalCode: 'entry.452850288',
  notes: 'entry.288149772',
  total: 'entry.1925755690',
  products: 'entry.1943477887',
};

const CustomerForm: React.FC<CustomerFormProps> = ({ cartItems, isLoading = false, onSubmit }) => {
  const [formData, setFormData] = useState<Omit<CustomerData, 'cartItems'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleInputChange = (field: keyof Omit<CustomerData, 'cartItems'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = customerSchema.parse(formData);
      setErrors({});

      // Prepare product summary and total
      const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const productSummary = cartItems.map(i => `${i.name} x ${i.quantity}`).join(', ');

      // Send to Google Form
      const gForm = new FormData();
      gForm.append(ENTRY_IDS.name, validated.name);
      gForm.append(ENTRY_IDS.email, validated.email);
      gForm.append(ENTRY_IDS.phone, validated.phone);
      gForm.append(ENTRY_IDS.address, validated.address);
      gForm.append(ENTRY_IDS.city, validated.city);
      gForm.append(ENTRY_IDS.postalCode, validated.postalCode);
      gForm.append(ENTRY_IDS.notes, validated.notes || '');
      gForm.append(ENTRY_IDS.total, totalPrice.toString());
      gForm.append(ENTRY_IDS.products, productSummary);

      await fetch(GOOGLE_FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        body: gForm,
      });

      toast({
        title: 'Order Submitted',
        description: 'Your order has been sent successfully!',
      });

      // 🔹 Pass data with products to parent (for WhatsApp/modal/cart clearing)
      onSubmit?.({ ...validated, cartItems });

      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        notes: '',
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrs: Record<string, string> = {};
        err.errors.forEach(e => {
          if (e.path[0]) newErrs[e.path[0] as string] = e.message;
        });
        setErrors(newErrs);
        toast({
          title: 'Validation Error',
          description: 'Please correct the highlighted fields.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Submission Failed',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone *</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={e => handleInputChange('phone', e.target.value)}
          className={errors.phone ? 'border-destructive' : ''}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={e => handleInputChange('address', e.target.value)}
          className={errors.address ? 'border-destructive' : ''}
          rows={3}
        />
        {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
      </div>

      {/* City & Postal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={e => handleInputChange('city', e.target.value)}
            className={errors.city ? 'border-destructive' : ''}
          />
          {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={e => handleInputChange('postalCode', e.target.value)}
            className={errors.postalCode ? 'border-destructive' : ''}
          />
          {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode}</p>}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Special Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={e => handleInputChange('notes', e.target.value)}
          rows={3}
        />
      </div>

      {/* Cart Items */}
      <div className="mt-4 border-t pt-4">
        <h3 className="font-semibold mb-2">Products in Your Order</h3>
        <ul className="space-y-1">
          {cartItems.map((item, idx) => (
            <li key={idx}>
              {item.name} × {item.quantity} (₹{(item.price * item.quantity).toFixed(2)})
            </li>
          ))}
        </ul>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full btn-luxury text-lg py-4" disabled={isLoading}>
        {isLoading ? 'Processing…' : 'Place Order'}
      </Button>
    </motion.form>
  );
};

export default CustomerForm;
