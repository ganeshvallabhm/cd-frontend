import React, { useEffect, useState } from "react";
import { getAllOrders } from "../services/api";

const AdminOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const result = await getAllOrders();
            setOrders(result.data || result);
        } catch (error) {
            console.log("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6">Loading orders...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Orders</h1>

            {orders.length === 0 && (
                <p>No orders found</p>
            )}

            {orders.map((order) => (
                <div
                    key={order._id}
                    className="border p-4 mb-4 rounded shadow bg-white"
                >
                    <h2 className="font-semibold text-lg mb-2">
                        Order Number: {order.orderNumber}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium text-gray-700 mb-1">Customer Details</h3>
                            <p><span className="font-medium">Name:</span> {order.customer?.name}</p>
                            <p><span className="font-medium">Phone:</span> {order.customer?.phone}</p>
                            <p><span className="font-medium">Address:</span> {order.customer?.address}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-700 mb-1">Order Items</h3>
                            <ul className="list-disc list-inside">
                                {order.items.map((item: any, index: number) => (
                                    <li key={index}>
                                        {item.name} – ₹{item.price} × {item.quantity}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-2 font-bold text-lg">
                                Total Amount: ₹{order.totalAmount}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminOrders;
