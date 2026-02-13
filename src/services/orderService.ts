// Use environment variable with fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Debug: Log environment variable loading
console.log("🔧 [ENV] VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("🔧 [ENV] Final API_URL:", API_URL);

export interface OrderItem {
    name: string;
    price: number;
    quantity: number;
}

export interface OrderData {
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    items: OrderItem[];
    totalAmount: number;
    paymentMethod: string;
}

export const createOrder = async (orderData: OrderData) => {
    const REQUEST_TIMEOUT = 30000; // 30 seconds timeout

    // Debug: Log API configuration
    console.log("🌐 [DEBUG] API URL:", API_URL);
    console.log("🌐 [DEBUG] Final Request URL:", `${API_URL}/orders`);
    console.log("📦 [DEBUG] Payload:", JSON.stringify(orderData, null, 2));

    try {
        // Log request payload for debugging
        console.log('[API Request] POST /orders', {
            endpoint: `${API_URL}/orders`,
            payload: orderData,
            timestamp: new Date().toISOString()
        });

        // Create abort controller for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        console.log("🚀 [DEBUG] Sending fetch request...");

        const response = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log("✅ [DEBUG] Fetch completed");
        console.log("📊 [DEBUG] Response Status:", response.status);
        console.log("📊 [DEBUG] Response OK:", response.ok);
        console.log("📊 [DEBUG] Response Status Text:", response.statusText);

        const data = await response.json();

        console.log("📄 [DEBUG] Response Body:", JSON.stringify(data, null, 2));

        // Log full API response for debugging
        console.log('[API Response]', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            data: data,
            timestamp: new Date().toISOString()
        });

        if (!response.ok) {
            // Log server error details
            console.error('[API Error] Server returned error:', {
                status: response.status,
                statusText: response.statusText,
                message: data.message,
                errorDetails: data,
                requestPayload: orderData
            });

            // Return meaningful error message based on status code
            if (response.status === 400) {
                throw new Error(data.message || "Invalid order data. Please check your information.");
            } else if (response.status === 401 || response.status === 403) {
                throw new Error("Authentication failed. Please try again.");
            } else if (response.status === 404) {
                throw new Error("Order service not found. Please contact support.");
            } else if (response.status === 500) {
                throw new Error(data.message || "Server error. Please try again later.");
            } else {
                throw new Error(`Server error (${response.status}): ${data.message || response.statusText}`);
            }
        }

        console.log('[API Success] Order created successfully:', data);
        return data;

    } catch (error: any) {
        console.error("❌ [DEBUG] Fetch Error Caught:", error);
        console.error("❌ [DEBUG] Error Name:", error.name);
        console.error("❌ [DEBUG] Error Message:", error.message);
        console.error("❌ [DEBUG] Error Stack:", error.stack);

        // Handle timeout errors
        if (error.name === 'AbortError') {
            console.error('[API Error] Request timeout:', {
                timeout: REQUEST_TIMEOUT,
                requestPayload: orderData,
                timestamp: new Date().toISOString()
            });
            throw new Error("Request timeout. Please check your connection and try again.");
        }

        // Handle CORS errors
        if (error.message.includes('CORS') || error.message.includes('cors')) {
            console.error('[API Error] CORS error detected:', {
                error: error.message,
                apiUrl: API_URL,
                requestPayload: orderData,
                timestamp: new Date().toISOString()
            });
            throw new Error("CORS error. Backend must allow requests from your frontend origin.");
        }

        // Handle network errors (fetch failed)
        if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
            console.error('[API Error] Network/Fetch error:', {
                error: error.message,
                apiUrl: API_URL,
                finalUrl: `${API_URL}/orders`,
                requestPayload: orderData,
                timestamp: new Date().toISOString()
            });
            throw new Error(`Cannot reach backend at ${API_URL}/orders. Check if backend is running and URL is correct.`);
        }

        // Handle invalid URL errors
        if (error.message.includes('URL') || error.message.includes('url')) {
            console.error('[API Error] Invalid URL:', {
                error: error.message,
                apiUrl: API_URL,
                requestPayload: orderData,
                timestamp: new Date().toISOString()
            });
            throw new Error(`Invalid API URL: ${API_URL}. Check your environment configuration.`);
        }

        // Log unexpected errors
        console.error('[API Error] Unexpected error:', {
            error: error.message,
            stack: error.stack,
            requestPayload: orderData,
            timestamp: new Date().toISOString()
        });

        // Re-throw the error with original message or fallback
        throw new Error(error.message || "Something went wrong. Please try again.");
    }
}

// Import Axios for GET request
import axios from 'axios';
import { Order, OrderResponse } from '@/types/order.types';

/**
 * Fetch a single order by ID using Axios
 * Backend returns: { success: true, data: { ...order } }
 */
export const getOrder = async (orderId: string): Promise<Order> => {
    try {
        console.log(`🔍 [GET ORDER] Fetching order with ID: ${orderId}`);
        console.log(`🌐 [GET ORDER] Request URL: ${API_URL}/orders/${orderId}`);

        const response = await axios.get<OrderResponse>(`${API_URL}/orders/${orderId}`);

        console.log('✅ [GET ORDER] Response received:', response.data);

        // Backend returns { success: true, data: order }
        // So we access response.data.data (first .data is axios, second is backend structure)
        if (!response.data.success) {
            throw new Error('Failed to fetch order');
        }

        const order = response.data.data;
        console.log('📦 [GET ORDER] Order data extracted:', order);

        return order;
    } catch (error: any) {
        console.error('❌ [GET ORDER] Error fetching order:', error);

        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                const message = error.response.data?.message || error.message;

                if (status === 404) {
                    throw new Error('Order not found');
                } else if (status === 400) {
                    throw new Error('Invalid order ID');
                } else if (status === 500) {
                    throw new Error('Server error. Please try again later.');
                } else {
                    throw new Error(message || 'Failed to fetch order');
                }
            } else if (error.request) {
                // Request made but no response
                throw new Error('Cannot reach server. Please check your connection.');
            }
        }

        throw new Error(error.message || 'An unexpected error occurred');
    }
};

