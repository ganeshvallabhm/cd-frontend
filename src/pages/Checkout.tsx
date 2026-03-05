import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Truck, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CheckoutForm from '@/components/CheckoutForm';
import { useCart } from '@/context/CartContext';
import { CheckoutFormData } from '@/types/checkout.types';
import { saveCheckoutData } from '@/utils/checkoutStorage';
import { sendOrderToWhatsApp } from '@/services/whatsappService';
import { useToast } from '@/hooks/use-toast';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { items, getTotalItems, getTotalPrice, clearCart } = useCart();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [apiError, setApiError] = React.useState<string | null>(null);
    const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        if (items.length === 0) {
            navigate('/', { replace: true });
        }
    }, [items.length, navigate]);

    const validateFormData = (data: CheckoutFormData): Record<string, string> => {
        const errors: Record<string, string> = {};

        if (!data.fullName || data.fullName.trim().length < 3) {
            errors.fullName = 'Name must be at least 3 characters';
        }

        const phoneDigits = data.phoneNumber.replace(/\D/g, '');
        if (!data.phoneNumber || phoneDigits.length !== 10) {
            errors.phoneNumber = 'Phone number must be exactly 10 digits';
        }

        if (!data.address || data.address.trim().length === 0) {
            errors.address = 'Address is required';
        }

        if (!data.pincode || data.pincode.trim().length === 0) {
            errors.pincode = 'Pincode is required';
        }

        return errors;
    };

    const handleFormSubmit = async (data: CheckoutFormData) => {
        setValidationErrors({});
        setApiError(null);

        if (items.length === 0) {
            setApiError('Your cart is empty. Please add items before checkout.');
            return;
        }

        const errors = validateFormData(data);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setApiError('Please fix the validation errors before submitting.');
            return;
        }

        const confirmed = window.confirm('Are you sure you want to place this order?');
        if (!confirmed) return;

        setIsSubmitting(true);

        try {
            const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

            sendOrderToWhatsApp(
                items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                {
                    name: data.fullName,
                    phone: data.phoneNumber,
                    address: data.address,
                    pincode: data.pincode,
                    landmark: data.landmark,
                    deliveryInstructions: data.deliveryInstructions,
                },
                totalAmount
            );

            saveCheckoutData(data);
            clearCart();

            toast({
                title: 'Order opened in WhatsApp',
                description: 'Please send the message to confirm your order.',
            });
        } catch (error: any) {
            setApiError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => navigate(-1);

    if (items.length === 0) return null;

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
                            <h1 className="text-xl md:text-3xl font-display font-bold text-foreground">
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
            <main className="container mx-auto px-4 py-6 md:py-12">
                <div className="max-w-3xl mx-auto space-y-5">
                    {/* Trust Indicators */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-3 md:p-4 flex items-start gap-2 md:gap-3 hover:shadow-md transition-shadow">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Truck className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-xs md:text-sm text-foreground">Fast Delivery</h3>
                                <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Within 3 days</p>
                            </div>
                        </div>

                        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-3 md:p-4 flex items-start gap-2 md:gap-3 hover:shadow-md transition-shadow">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-xs md:text-sm text-foreground">100% Fresh</h3>
                                <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Preservative-free</p>
                            </div>
                        </div>

                        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-3 md:p-4 flex items-start gap-2 md:gap-3 hover:shadow-md transition-shadow">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-xs md:text-sm text-foreground">Easy Returns</h3>
                                <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Hassle-free</p>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form Card */}
                    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl p-5 md:p-8 hover:shadow-2xl transition-shadow">
                        <div className="mb-6">
                            <h2 className="text-lg md:text-2xl font-display font-bold text-foreground">
                                Delivery Information
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Please provide accurate details for a smooth delivery experience
                            </p>
                        </div>

                        {apiError && (
                            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600 font-medium">{apiError}</p>
                            </div>
                        )}

                        {Object.keys(validationErrors).length > 0 && (
                            <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-lg">
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
                            isSubmitting={isSubmitting}
                        />
                    </div>

                    {/* Delivery Note */}
                    <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 text-center">
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
