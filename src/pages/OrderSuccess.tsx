import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Package, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOrder } from '@/services/orderService';
import { Order } from '@/types/order.types';

const OrderSuccess: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Defensive check: If orderId is missing, set error and stop
        if (!orderId) {
            setError('Order ID is missing. Please place an order first.');
            setLoading(false);
            return;
        }

        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError(null);

                // Use the Axios-based getOrder function
                // Backend returns { success: true, data: order }
                // getOrder handles res.data.data internally
                const fetchedOrder = await getOrder(orderId);

                setOrder(fetchedOrder);
            } catch (err: any) {
                console.error('Error fetching order:', err);
                setError(err.message || 'Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground">Loading order details...</p>
                    <p className="text-sm text-muted-foreground mt-2">Please wait</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                        <AlertCircle className="w-12 h-12 text-red-600" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
                        Error Loading Order
                    </h1>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <Button
                        onClick={() => navigate('/')}
                        className="w-full gap-2"
                        size="lg"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    // Not Found State (order is null after successful load)
    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <Package className="w-12 h-12 text-orange-600" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
                        Order Not Found
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        We couldn't find your order. Please contact support if this issue persists.
                    </p>
                    <Button
                        onClick={() => navigate('/')}
                        className="w-full gap-2"
                        size="lg"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl p-8 text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>

                {/* Success Message */}
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
                    Order Placed Successfully!
                </h1>
                <p className="text-muted-foreground mb-6">
                    Thank you for your order. We'll deliver it within 3 days.
                </p>

                {/* Order Details */}
                <div className="bg-secondary/50 rounded-lg p-6 mb-8 space-y-4 text-left">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                        <p className="text-lg font-semibold text-foreground font-mono">{order.orderNumber}</p>
                    </div>

                    <div className="border-t border-border/50 pt-4">
                        <p className="text-sm text-muted-foreground mb-1">Customer Name</p>
                        <p className="text-base font-medium text-foreground">{order.customer.name}</p>
                    </div>

                    <div className="border-t border-border/50 pt-4">
                        <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-primary">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Button
                        onClick={() => navigate(`/orders/${orderId}`)}
                        className="w-full gap-2"
                        size="lg"
                    >
                        <Package className="w-4 h-4" />
                        View Order Details
                    </Button>
                    <Button
                        onClick={() => navigate('/')}
                        variant="outline"
                        className="w-full gap-2"
                        size="lg"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
