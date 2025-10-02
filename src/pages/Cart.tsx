import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import CustomerForm, { CustomerData, CartItem } from '../components/CustomerForm';
import WhatsAppModal from '../components/WhatsAppModal';

const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdDegYUC3MKGv3_-gmbTBRaA-MXymivkiux1F1VxD3VeGFvfQ/formResponse";

const GOOGLE_FORM_ENTRY_IDS = {
  name: "entry.325378209",
  email: "entry.629337478",
  phone: "entry.2035764280",
  address: "entry.2123084750",
  city: "entry.528762314",
  postalCode: "entry.452850288",
  notes: "entry.288149772",
  products: "entry.888888888",
};

// Extend CartItem with id
export interface CartItemWithId extends CartItem {
  id: string;
  image?: string;
  category?: string;
}

const Cart: React.FC = () => {
  const { items, total, itemCount, removeFromCart, updateQuantity, clearCart } = useCart();
  const { toast } = useToast();

  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemWithId[]>([]);
  const hiddenFormRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    setCartItems(items.map((i) => ({ ...i, id: i.id || i.name })));
  }, [items]);

  // Open WhatsApp modal when customerName is set
  useEffect(() => {
    if (customerName) {
      setShowWhatsAppModal(true);
    }
  }, [customerName]);

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    setShowCustomerForm(true);
  };

  const handleCustomerFormSubmit = async (customerData: CustomerData) => {
    setIsProcessing(true);

    try {
      const productsString = cartItems
        .map((i) => `${i.name} x${i.quantity}`)
        .join(', ');

      // Fill hidden Google Form
      if (hiddenFormRef.current) {
        const form = hiddenFormRef.current;
        (Object.keys(GOOGLE_FORM_ENTRY_IDS) as (keyof typeof GOOGLE_FORM_ENTRY_IDS)[]).forEach(
          (key) => {
            const input = form.elements.namedItem(
              GOOGLE_FORM_ENTRY_IDS[key]
            ) as HTMLInputElement;
            if (input) {
              input.value = key === "products" ? productsString : (customerData as any)[key] ?? "";
            }
          }
        );
        form.submit();
      }

      toast({
        title: "Order Submitted",
        description: "Your order has been successfully sent!",
        variant: "default",
      });

      // Close form, clear cart, and trigger WhatsApp modal
      setShowCustomerForm(false);
      setCustomerName(customerData.name); // WhatsApp modal will open via useEffect
      clearCart();
    } catch (err) {
      console.error(err);
      toast({
        title: "Submission Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppModalClose = () => {
    setShowWhatsAppModal(false);
    setCustomerName('');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shopping <span className="text-luxury">Cart</span>
          </h1>
          <p className="text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="card-luxury p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-32 h-48 md:h-32 rounded-lg overflow-hidden bg-gray-50">
                    {item.image && (
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground uppercase tracking-wide">
                          {item.category}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-lg">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-sm text-muted-foreground">
                            ₹{item.price.toLocaleString()} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card-luxury p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-primary font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>GST</span>
                   <span className="text-primary font-medium">Included</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">
                      ₹{(total ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full btn-luxury text-lg py-4"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </Button>

                <Link to="/shop" className="block">
                  <Button variant="outline" className="w-full btn-outline-luxury">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Customer Form Modal */}
        {showCustomerForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Contact Information</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowCustomerForm(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-muted-foreground mt-2">
                  Please provide your contact details so we can reach you about your order.
                </p>
              </div>
              <div className="p-6">
                <CustomerForm 
                  onSubmit={handleCustomerFormSubmit}
                  isLoading={isProcessing} 
                  cartItems={cartItems}
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* WhatsApp Modal */}
        <WhatsAppModal
          isOpen={showWhatsAppModal}
          onClose={handleWhatsAppModalClose}
          customerName={customerName}
        />

        {/* 🔒 Hidden Google Form */}
        <form
          ref={hiddenFormRef}
          action={GOOGLE_FORM_ACTION_URL}
          method="POST"
          target="hidden_iframe"
          className="hidden"
        >
          {Object.values(GOOGLE_FORM_ENTRY_IDS).map((id) => (
            <input key={id} type="hidden" name={id} defaultValue="" />
          ))}
          <iframe name="hidden_iframe" style={{ display: "none" }} />
        </form>
      </div>
    </div>
  );
};

export default Cart;
