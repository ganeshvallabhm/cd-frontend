import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Truck, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CheckoutForm from '@/components/CheckoutForm';
import { useCart } from '@/context/CartContext';
import { CheckoutFormData } from '@/types/checkout.types';
import { saveCheckoutData } from '@/utils/checkoutStorage';
import emailjs from '@emailjs/browser';
import { createOrder, OrderData } from '@/services/orderService';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { items, getTotalItems, getTotalPrice, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [apiError, setApiError] = React.useState<string | null>(null);
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
    const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

    useEffect(() => {
        if (items.length === 0) {
            navigate('/', { replace: true });
        }
    }, [items.length, navigate]);

    // Email validation helper
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Comprehensive validation function
    const validateFormData = (data: CheckoutFormData): Record<string, string> => {
        const errors: Record<string, string> = {};

        // Validate customer name (min 3 characters)
        if (!data.fullName || data.fullName.trim().length < 3) {
            errors.fullName = 'Name must be at least 3 characters';
        }

        // Validate email format (if email field exists in form data)
        // Note: CheckoutFormData doesn't have email field, so this is for future use
        // if (data.email && !validateEmail(data.email)) {
        //     errors.email = 'Please enter a valid email address';
        // }

        // Validate phone (must be 10 digits)
        const phoneDigits = data.phoneNumber.replace(/\D/g, '');
        if (!data.phoneNumber || phoneDigits.length !== 10) {
            errors.phoneNumber = 'Phone number must be exactly 10 digits';
        }

        // Validate address (must not be empty)
        if (!data.address || data.address.trim().length === 0) {
            errors.address = 'Address is required';
        }

        // Validate pincode
        if (!data.pincode || data.pincode.trim().length === 0) {
            errors.pincode = 'Pincode is required';
        }

        return errors;
    };

    const handleFormSubmit = async (data: CheckoutFormData) => {
        console.log("🎯 [CHECKOUT] Form submission initiated");
        console.log("📝 [CHECKOUT] Form Data:", data);
        console.log("🛒 [CHECKOUT] Cart Items:", items);
        console.log("💰 [CHECKOUT] Total Price:", getTotalPrice());

        // Clear previous errors
        setValidationErrors({});
        setApiError(null);
        setSuccessMessage(null);

        // Validate cart has items
        if (items.length === 0) {
            console.error("❌ [CHECKOUT] Validation failed: Empty cart");
            setApiError('Your cart is empty. Please add items before checkout.');
            return;
        }

        // Validate form data
        const errors = validateFormData(data);

        // If validation fails, show errors and prevent API call
        if (Object.keys(errors).length > 0) {
            console.error("❌ [CHECKOUT] Validation failed:", errors);
            setValidationErrors(errors);
            setApiError('Please fix the validation errors before submitting.');
            return;
        }

        console.log("✅ [CHECKOUT] Validation passed");

        // Show confirmation dialog
        const confirmed = window.confirm('Are you sure you want to place this order?');
        if (!confirmed) {
            console.log("🚫 [CHECKOUT] User cancelled order");
            return;
        }

        console.log("✅ [CHECKOUT] User confirmed order");

        setIsSubmitting(true);
        setLoading(true);

        try {
            // Calculate total amount dynamically
            const totalAmount = items.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);

            console.log("💵 [CHECKOUT] Calculated total amount:", totalAmount);

            // Build orderData payload for backend API using OrderData interface
            const orderData: OrderData = {
                customer: {
                    name: data.fullName,
                    email: data.email,
                    phone: data.phoneNumber,
                    address: `${data.address}${data.landmark ? ', ' + data.landmark : ''}${data.pincode ? ', ' + data.pincode : ''}${data.deliveryInstructions ? ' (' + data.deliveryInstructions + ')' : ''}`
                },
                items: items.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                totalAmount: totalAmount,
                paymentMethod: 'ONLINE'
            };

            console.log("📤 [CHECKOUT] Sending order to backend API:", orderData);

            // Call backend API using orderService
            const responseData = await createOrder(orderData);

            console.log("✅ [CHECKOUT] Backend call successful");
            console.log("📥 [CHECKOUT] Backend Response:", responseData);

            // Capture order ID from backend response
            const orderId = responseData?.orderId || responseData?.id || 'N/A';

            console.log("🆔 [CHECKOUT] Order ID:", orderId);

            // Send confirmation email via EmailJS
            try {
                console.log("📧 [EMAIL] Sending confirmation email...");

                const emailParams = {
                    name: data.fullName,
                    order_id: orderId,
                    total_amount: totalAmount
                };

                await emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
                    import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
                    emailParams,
                    import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
                );

                console.log("✅ [EMAIL] Confirmation email sent successfully");
            } catch (emailError: any) {
                console.error("❌ [EMAIL] Failed to send confirmation email:", emailError);
                // Don't fail the order if email fails - just log it
            }

            // Show success message
            console.log("✅ [CHECKOUT] Order placed successfully");

            // Save checkout data locally for order summary page
            saveCheckoutData(data);
            console.log("💾 [CHECKOUT] Checkout data saved locally");

            // Clear cart after successful order
            clearCart();
            console.log("🗑️ [CHECKOUT] Cart cleared after successful order");

            // Navigate to success page with order ID
            navigate('/order-success', {
                state: { orderId: orderId }
            });

        } catch (error: any) {
            console.error("❌ [CHECKOUT] Error caught in handleFormSubmit:", error);
            console.error("❌ [CHECKOUT] Error message:", error.message);

            // Display error message to user
            alert("Order Failed");
            console.log(error);

            setApiError(error.message || 'Order failed. Please try again.');
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (items.length === 0) {
        return null;
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
                            onClick={() => navigate(-1)}
                            className="gap-2 hover:bg-secondary/80 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                                Secure Checkout
                            </h1>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} • Complete your order details
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            Secure
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Trust Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Truck className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-foreground">Fast Delivery</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Within 3 days</p>
                            </div>
                        </div>

                        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-foreground">100% Fresh</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Preservative-free</p>
                            </div>
                        </div>

                        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-foreground">Easy Returns</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Hassle-free process</p>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form Card */}
                    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-shadow">
                        <div className="mb-8">
                            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
                                Delivery Information
                            </h2>
                            <p className="text-sm text-muted-foreground mt-2">
                                Please provide accurate details for a smooth delivery experience
                            </p>
                        </div>

                        {/* API Error Message */}
                        {apiError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600 font-medium">{apiError}</p>
                            </div>
                        )}

                        {/* Success Message */}
                        {successMessage && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-600 font-medium">{successMessage}</p>
                            </div>
                        )}

                        {/* Inline Validation Errors */}
                        {Object.keys(validationErrors).length > 0 && (
                            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-amber-800 mb-2">
                                            Please fix the following errors:
                                        </h3>
                                        <ul className="space-y-1">
                                            {Object.entries(validationErrors).map(([field, error]) => (
                                                <li key={field} className="text-sm text-amber-700">
                                                    <span className="font-medium capitalize">
                                                        {field.replace(/([A-Z])/g, ' $1').trim()}:
                                                    </span>{' '}
                                                    {error}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <CheckoutForm
                            onSubmit={handleFormSubmit}
                            onCancel={handleCancel}
                            isSubmitting={loading || isSubmitting}
                        />
                    </div>

                    {/* Delivery Note */}
                    <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 text-center">
                        <p className="text-sm font-medium text-foreground">
                            <span className="inline-flex items-center gap-2">
                                <Truck className="w-4 h-4" />
                                Delivery within 3 days
                            </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Currently delivering in Bangalore only
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
