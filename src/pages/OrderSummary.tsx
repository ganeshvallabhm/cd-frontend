import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, ShoppingCart, CheckCircle2, Package, MapPin, Phone, User, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { DeliveryAddress, PricingBreakdown } from '@/types/checkout.types';
import { getCheckoutData } from '@/utils/checkoutStorage';
import { formatPhoneNumber, formatPincode } from '@/utils/validation';

const OrderSummary: React.FC = () => {
    const navigate = useNavigate();
    const { items, getTotalPrice, clearCart, setIsCartOpen } = useCart();
    const [deliveryDetails, setDeliveryDetails] = useState<DeliveryAddress | null>(null);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    useEffect(() => {
        const savedDetails = getCheckoutData();

        if (!savedDetails) {
            navigate('/checkout', { replace: true });
            return;
        }

        if (items.length === 0) {
            navigate('/', { replace: true });
            return;
        }

        setDeliveryDetails(savedDetails);
    }, [items.length, navigate]);

    const calculatePricing = (): PricingBreakdown => {
        const subtotal = getTotalPrice();
        const tax = 0;
        const deliveryCharges = 0;
        const total = subtotal;

        return {
            subtotal,
            tax,
            deliveryCharges,
            total,
        };
    };

    const pricing = calculatePricing();

    const handleEditDetails = () => {
        navigate('/checkout');
    };

    const handleModifyCart = () => {
        setIsCartOpen(true);
    };

    const handlePlaceOrder = () => {
        setIsPlacingOrder(true);

        setTimeout(() => {
            setOrderPlaced(true);
            setIsPlacingOrder(false);

            setTimeout(() => {
                clearCart();
                navigate('/', { replace: true });
            }, 3000);
        }, 1500);
    };

    if (!deliveryDetails || items.length === 0) {
        return null;
    }

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-green-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-card/90 backdrop-blur-sm border border-green-200 rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-lg animate-in zoom-in-50 duration-700">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-foreground mb-3">
                        Order Confirmed!
                    </h2>
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                        Thank you for your order. We'll prepare your fresh homemade products and deliver them within 3 days.
                    </p>
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-6 mb-6 border border-primary/20">
                        <p className="text-lg font-bold text-foreground mb-2">
                            Total Amount
                        </p>
                        <p className="text-4xl font-display font-bold text-primary">
                            ₹{pricing.total.toFixed(2)}
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        Redirecting to home page...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
            {/* Header */}
            <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/checkout')}
                            className="gap-2 hover:bg-secondary/80 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                                Review Your Order
                            </h1>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Verify details before placing your order
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground bg-green-500/10 px-3 py-1.5 rounded-full">
                            <Sparkles className="w-4 h-4 text-green-600" />
                            Almost there!
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Delivery Details Card */}
                    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                Delivery Details
                            </h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleEditDetails}
                                className="gap-2 hover:bg-secondary/80 transition-all hover:scale-105"
                            >
                                <Edit className="w-3.5 h-3.5" />
                                Edit
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Name</p>
                                        <p className="text-base font-semibold text-foreground truncate">{deliveryDetails.fullName}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Phone</p>
                                        <p className="text-base font-semibold text-foreground">
                                            {formatPhoneNumber(deliveryDetails.phoneNumber)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Address</p>
                                    <p className="text-sm font-medium text-foreground leading-relaxed">{deliveryDetails.address}</p>
                                    {deliveryDetails.landmark && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            <span className="font-medium">Landmark:</span> {deliveryDetails.landmark}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        <span className="font-medium">Pincode:</span> {formatPincode(deliveryDetails.pincode)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {deliveryDetails.deliveryInstructions && (
                            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 uppercase tracking-wide mb-1">Delivery Instructions</p>
                                <p className="text-sm text-foreground">{deliveryDetails.deliveryInstructions}</p>
                            </div>
                        )}
                    </div>

                    {/* Order Items Card */}
                    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-primary" />
                                </div>
                                Your Items ({items.length})
                            </h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleModifyCart}
                                className="gap-2 hover:bg-secondary/80 transition-all hover:scale-105"
                            >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                Modify
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.cartItemId}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-secondary/20 to-secondary/40 hover:from-secondary/30 hover:to-secondary/50 transition-all hover:scale-[1.01] border border-border/30"
                                >
                                    <div className="w-20 h-20 rounded-xl bg-card flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-foreground text-base truncate mb-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {item.quantity} kg × ₹{item.price}/kg
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                            {item.sugarOption && (
                                                <span className="inline-block text-xs bg-primary/10 text-primary font-medium px-2 py-1 rounded-md">
                                                    {item.sugarOption}
                                                </span>
                                            )}
                                            {item.spiceLevel && (
                                                <span className="inline-block text-xs bg-orange-100 text-orange-700 font-medium px-2 py-1 rounded-md">
                                                    🌶️ {item.spiceLevel}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xl font-bold text-primary">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Summary Card */}
                    <div className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-shadow">
                        <h2 className="text-xl font-display font-bold text-foreground mb-6">
                            Price Summary
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-base p-4 rounded-xl bg-secondary/30">
                                <span className="font-medium text-muted-foreground">Subtotal</span>
                                <span className="font-bold text-foreground text-lg">₹{pricing.subtotal.toFixed(2)}</span>
                            </div>

                            <div className="border-t-2 border-dashed border-border pt-4">
                                <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5">
                                    <span className="text-lg font-bold text-foreground">Total Amount</span>
                                    <span className="text-3xl font-display font-bold text-primary">₹{pricing.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Button
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder}
                                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPlacingOrder ? (
                                    <span className="flex items-center gap-3">
                                        <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing Your Order...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6" />
                                        Place Order • ₹{pricing.total.toFixed(2)}
                                    </span>
                                )}
                            </Button>

                            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                                <ShieldCheck className="w-4 h-4 text-green-600" />
                                <p>
                                    By placing this order, you agree to our terms and conditions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderSummary;
