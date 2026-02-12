import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Order {
    orderNumber: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    items: {
        name: string;
        price: number;
        quantity: number;
    }[];
    totalAmount: number;
}

const OrderDetails: React.FC = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetch(`http://localhost:5001/api/orders/${id}`)
            .then(res => res.json())
            .then(data => {
                setOrder(data);
            })
            .catch(err => console.error(err));
    }, [id]);

    if (!order) {
        return <div className="p-6">Loading order details...</div>;
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Order Details</h1>

            <p><strong>Order Number:</strong> {order.orderNumber}</p>
            <p><strong>Name:</strong> {order.customer?.name}</p>
            <p><strong>Email:</strong> {order.customer?.email}</p>
            <p><strong>Phone:</strong> {order.customer?.phone}</p>
            <p><strong>Address:</strong> {order.customer?.address}</p>

            <div className="mt-4">
                <strong>Items:</strong>
                <ul className="list-disc ml-5">
                    {order.items.map((item, index) => (
                        <li key={index}>
                            {item.name} – ₹{item.price} × {item.quantity}
                        </li>
                    ))}
                </ul>
            </div>

            <p className="mt-4 font-bold text-lg">
                Total Amount: ₹{order.totalAmount}
            </p>
        </div>
    );
};

export default OrderDetails;
