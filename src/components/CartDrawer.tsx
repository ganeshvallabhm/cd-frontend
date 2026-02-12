import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, CheckCircle, CreditCard, LogOut, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart, CartItem } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface OrderConfirmation {
  paymentId: string;
  items: CartItem[];
  total: number;
}

const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Helper function to determine if sugar option should be displayed
  const shouldShowSugarOption = (item: CartItem) => {
    // Show sugar option if the item has it (not masala/pickle items)
    return item.sugarOption !== undefined;
  };

  // Helper function to determine if spice level should be displayed
  const shouldShowSpiceLevel = (item: CartItem) => {
    // Show spice level if the item has it (masala/pickle items)
    return item.spiceLevel !== undefined;
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = () => {
    // Close cart drawer and navigate to checkout
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const proceedToPayment = () => {
    if (!window.Razorpay) {
      alert('Payment system is loading. Please try again.');
      return;
    }

    setIsProcessing(true);
    const total = getTotalPrice();
    const orderItems = [...items];

    const options = {
      key: 'rzp_test_1234567890abcdef', // Replace with actual Razorpay key_id
      amount: total * 100, // Razorpay expects amount in paise
      currency: 'INR',
      name: 'CK Homemade Foods',
      description: 'Homemade Food Order',
      handler: function (response: { razorpay_payment_id: string }) {
        // Payment successful
        setOrderConfirmation({
          paymentId: response.razorpay_payment_id,
          items: orderItems,
          total: total,
        });
        clearCart();
        setIsProcessing(false);
      },
      prefill: {
        name: '',
        email: '',
        contact: user?.phoneNumber || '',
      },
      theme: {
        color: '#C75B39',
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    proceedToPayment();
  };

  const handleCloseConfirmation = () => {
    setOrderConfirmation(null);
    setIsCartOpen(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Login View
  if (showLogin && !isAuthenticated) {
    return (
      <Sheet open={isCartOpen} onOpenChange={(open) => {
        if (!open) {
          setShowLogin(false);
        }
        setIsCartOpen(open);
      }}>
        <SheetContent className="w-full sm:max-w-md bg-card">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="flex items-center gap-2 font-display">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Login Required
            </SheetTitle>
          </SheetHeader>

          <LoginForm
            onSuccess={handleLoginSuccess}
            onCancel={() => setShowLogin(false)}
          />
        </SheetContent>
      </Sheet>
    );
  }

  // Order Confirmation View
  if (orderConfirmation) {
    return (
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md bg-card">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="flex items-center gap-2 font-display text-green-600">
              <CheckCircle className="w-5 h-5" />
              Order Confirmed
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Success Message */}
            <div className="text-center py-6 border-b border-border">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Order placed successfully!
              </h3>
              <p className="text-sm text-muted-foreground">
                Thank you for your order
              </p>
            </div>

            {/* Order Details */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {/* Payment ID */}
              <div className="bg-secondary/50 rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Payment ID</p>
                <p className="font-mono text-sm font-medium text-foreground break-all">
                  {orderConfirmation.paymentId}
                </p>
              </div>

              {/* Ordered Items */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">Ordered Items</h4>
                <div className="space-y-2">
                  {orderConfirmation.items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} kg × ₹{item.price}/kg
                        </p>
                        {shouldShowSugarOption(item) && (
                          <span className="inline-block text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded mt-1">
                            {item.sugarOption}
                          </span>
                        )}
                        {shouldShowSpiceLevel(item) && (
                          <span className="inline-block text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded mt-1">
                            🌶️ {item.spiceLevel}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10">
                <span className="font-semibold text-foreground">Total Paid</span>
                <span className="text-xl font-bold text-primary">
                  ₹{orderConfirmation.total.toFixed(2)}
                </span>
              </div>

              {/* Delivery Note */}
              <div className="bg-accent/30 rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-foreground mb-1">
                  🚚 Delivery within 3 days
                </p>
                <p className="text-xs text-muted-foreground">
                  (Bangalore only • Delivery charges excluded)
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="border-t border-border pt-4">
              <Button className="w-full" onClick={handleCloseConfirmation}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-card">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2 font-display">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {/* Logged in user info */}
        {isAuthenticated && user && (
          <div className="flex items-center justify-between py-2 px-3 mt-3 rounded-lg bg-green-50 border border-green-200">
            <span className="text-sm text-green-700">
              📱 {user.phoneNumber}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add some delicious homemade products!
            </p>
            <Button variant="outline" onClick={() => setIsCartOpen(false)}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {items.map(item => (
                <div
                  key={item.cartItemId}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
                >
                  {/* Item Image */}
                  <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-sm truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      ₹{item.price} / kg
                    </p>
                    {shouldShowSugarOption(item) && (
                      <span className="inline-block text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded mt-1">
                        {item.sugarOption}
                      </span>
                    )}
                    {shouldShowSpiceLevel(item) && (
                      <span className="inline-block text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded mt-1">
                        {item.spiceLevel}
                      </span>
                    )}
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 bg-card rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-4 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-xl font-bold text-foreground">
                  ₹{getTotalPrice().toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Delivery charges excluded. Delivery within 3 days in Bangalore.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  <ArrowRight className="w-4 h-4" />
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
