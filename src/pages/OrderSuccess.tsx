import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrderSuccess: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId || 'N/A';

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

                {/* Order ID */}
                <div className="bg-secondary/50 rounded-lg p-4 mb-8">
                    <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                    <p className="text-lg font-semibold text-foreground font-mono">{orderId}</p>
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
