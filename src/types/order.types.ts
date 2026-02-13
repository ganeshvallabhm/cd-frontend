export interface OrderItem {
    name: string;
    price: number;
    quantity: number;
}

export interface Customer {
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface Order {
    _id: string;
    orderNumber: string;
    customer: Customer;
    items: OrderItem[];
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
    status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    createdAt: string;
    updatedAt?: string;
}

export interface OrderResponse {
    success: boolean;
    data: Order;
}

export interface OrdersListResponse {
    success: boolean;
    data: Order[];
}
