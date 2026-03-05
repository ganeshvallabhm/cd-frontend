import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart, CartItem } from '@/context/CartContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const shouldShowSugarOption = (item: CartItem) => item.sugarOption !== undefined;
  const shouldShowSpiceLevel = (item: CartItem) => item.spiceLevel !== undefined;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-card">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2 font-display">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

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
                  <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

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

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 bg-card rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-secondary transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-secondary transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-xl font-bold text-foreground">
                  ₹{getTotalPrice().toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Delivery charges excluded. Delivery within 3 days in Bangalore.
              </p>

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
