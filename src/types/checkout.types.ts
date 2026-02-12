import { CartItem } from '@/context/CartContext';

export interface CheckoutFormData {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    landmark: string;
    pincode: string;
    deliveryInstructions: string;
}

export interface DeliveryAddress {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    landmark: string;
    pincode: string;
    deliveryInstructions: string;
}

export interface OrderPayload {
    name: string;
    email: string;
    phone: string;
    address: string;
    items: {
        name: string;
        price: number;
        quantity: number;
    }[];
    totalAmount: number;
    paymentMethod: string;
}

export interface ValidationErrors {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    landmark?: string;
    pincode?: string;
    deliveryInstructions?: string;
}

export interface PricingBreakdown {
    subtotal: number;
    tax: number;
    deliveryCharges: number;
    total: number;
}

export interface OrderSummary {
    items: CartItem[];
    deliveryDetails: DeliveryAddress;
    pricing: PricingBreakdown;
    orderDate: string;
}

export interface CheckoutState {
    formData: CheckoutFormData;
    errors: ValidationErrors;
    isSubmitting: boolean;
    hasAttemptedSubmit: boolean;
}

export const INITIAL_CHECKOUT_FORM_DATA: CheckoutFormData = {
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    landmark: '',
    pincode: '',
    deliveryInstructions: '',
};

export const INITIAL_VALIDATION_ERRORS: ValidationErrors = {
    fullName: undefined,
    email: undefined,
    phoneNumber: undefined,
    address: undefined,
    landmark: undefined,
    pincode: undefined,
    deliveryInstructions: undefined,
};
