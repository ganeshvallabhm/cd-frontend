import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, User, Mail, Phone, MapPin, Calendar, CreditCard, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOrder } from '@/services/orderService';
import { Order } from '@/types/order.types';
import axios from 'axios';

const OrderDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Defensive check: If ID is missing, set error and stop
        if (!id) {
            setError('Order ID is missing');
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
                const fetchedOrder = await getOrder(id);

                setOrder(fetchedOrder);
            } catch (err: any) {
                console.error('Error fetching order:', err);
                setError(err.message || 'Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    // Payment handler function
    const handleTemporaryPayment = async () => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/orders/${order?._id}/payment-success`
            );

            alert("Payment Successful!");
            navigate("/success");
        } catch (err) {
            console.error(err);
            alert("Payment failed");
        }
    };

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
                    <h1 className="text-2xl font-display font-bold text-foreground mb-3">
                        Error Loading Order
                    </h1>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <Button
                        onClick={() => navigate('/')}
                        className="w-full gap-2"
                        size="lg"
                    >
                        <ArrowLeft className="w-4 h-4" />
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
                    <h1 className="text-2xl font-display font-bold text-foreground mb-3">
                        Order Not Found
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        We couldn't find an order with this ID. Please check the order number and try again.
                    </p>
                    <Button
                        onClick={() => navigate('/')}
                        className="w-full gap-2"
                        size="lg"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    // Format date helper
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    // Status badge color helper
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return 'bg-green-500/10 text-green-600 border-green-500/20';
            case 'SHIPPED':
                return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'PREPARING':
                return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
            case 'CONFIRMED':
                return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
            case 'CANCELLED':
                return 'bg-red-500/10 text-red-600 border-red-500/20';
            default:
                return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-500/10 text-green-600 border-green-500/20';
            case 'FAILED':
                return 'bg-red-500/10 text-red-600 border-red-500/20';
            default:
                return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
        }
    };

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
                                Order Details
                            </h1>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                View your order information
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Order Header Card */}
                    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                                <p className="text-2xl font-display font-bold text-foreground font-mono">
                                    {order.orderNumber}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm ${getStatusColor(order.status)}`}>
                                    <Clock className="w-4 h-4" />
                                    {order.status}
                                </span>
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm ${getPaymentStatusColor(order.paymentStatus)}`}>
                                    <CreditCard className="w-4 h-4" />
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-border/50">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Order Date</p>
                                    <p className="text-base font-semibold text-foreground mt-0.5">
                                        {formatDate(order.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                    <CreditCard className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Payment Method</p>
                                    <p className="text-base font-semibold text-foreground mt-0.5">
                                        {order.paymentMethod}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl p-6 md:p-8">
                        <h2 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Customer Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="text-base font-semibold text-foreground mt-0.5">
                                        {order.customer.name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="text-base text-foreground mt-0.5 break-all">
                                        {order.customer.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="text-base font-semibold text-foreground mt-0.5">
                                        {order.customer.phone}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Delivery Address</p>
                                    <p className="text-base text-foreground mt-0.5">
                                        {order.customer.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl p-6 md:p-8">
                        <h2 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Order Items
                        </h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/30 hover:bg-secondary/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold text-foreground">{item.name}</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            ₹{item.price.toFixed(2)} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-bold text-lg text-foreground">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="mt-6 pt-6 border-t border-border/50">
                            <div className="flex items-center justify-between text-lg md:text-xl">
                                <span className="font-display font-bold text-foreground">Total Amount</span>
                                <span className="font-display font-bold text-primary text-2xl">
                                    ₹{order.totalAmount.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {/* Show Pay Now button only if payment is pending */}
                        {order.paymentStatus === 'PENDING' && (
                            <Button
                                onClick={handleTemporaryPayment}
                                className="gap-2"
                                size="lg"
                            >
                                <CreditCard className="w-4 h-4" />
                                Pay Now
                            </Button>
                        )}
                        <Button
                            onClick={() => navigate('/')}
                            variant="outline"
                            className="gap-2"
                            size="lg"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderDetails;
