import { DeliveryAddress, CheckoutFormData } from '@/types/checkout.types';

const CHECKOUT_DATA_KEY = 'ck_checkout_data';

/**
 * Saves checkout data to localStorage
 */
export const saveCheckoutData = (data: CheckoutFormData): boolean => {
    try {
        const deliveryAddress: DeliveryAddress = {
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            address: data.address,
            landmark: data.landmark,
            pincode: data.pincode,
            deliveryInstructions: data.deliveryInstructions,
        };

        localStorage.setItem(CHECKOUT_DATA_KEY, JSON.stringify(deliveryAddress));
        return true;
    } catch (error) {
        console.error('Failed to save checkout data:', error);
        return false;
    }
};

/**
 * Retrieves checkout data from localStorage
 */
export const getCheckoutData = (): DeliveryAddress | null => {
    try {
        const data = localStorage.getItem(CHECKOUT_DATA_KEY);
        if (!data) {
            return null;
        }

        const parsed = JSON.parse(data) as DeliveryAddress;

        // Validate that the parsed data has all required fields
        if (validateStoredCheckoutData(parsed)) {
            return parsed;
        }

        return null;
    } catch (error) {
        console.error('Failed to retrieve checkout data:', error);
        return null;
    }
};

/**
 * Clears checkout data from localStorage
 */
export const clearCheckoutData = (): boolean => {
    try {
        localStorage.removeItem(CHECKOUT_DATA_KEY);
        return true;
    } catch (error) {
        console.error('Failed to clear checkout data:', error);
        return false;
    }
};

/**
 * Validates stored checkout data structure
 */
export const validateStoredCheckoutData = (data: unknown): data is DeliveryAddress => {
    if (!data || typeof data !== 'object') {
        return false;
    }

    const address = data as Record<string, unknown>;

    return (
        typeof address.fullName === 'string' &&
        typeof address.email === 'string' &&
        typeof address.phoneNumber === 'string' &&
        typeof address.address === 'string' &&
        typeof address.landmark === 'string' &&
        typeof address.pincode === 'string' &&
        typeof address.deliveryInstructions === 'string'
    );
};

/**
 * Checks if checkout data exists in localStorage
 */
export const hasCheckoutData = (): boolean => {
    try {
        const data = localStorage.getItem(CHECKOUT_DATA_KEY);
        return data !== null;
    } catch (error) {
        return false;
    }
};

/**
 * Converts DeliveryAddress to CheckoutFormData
 */
export const deliveryAddressToFormData = (address: DeliveryAddress): CheckoutFormData => {
    return {
        fullName: address.fullName,
        email: address.email,
        phoneNumber: address.phoneNumber,
        address: address.address,
        landmark: address.landmark,
        pincode: address.pincode,
        deliveryInstructions: address.deliveryInstructions,
    };
};
