import { BUSINESS_CONFIG } from "@/config/businessConfig";

export interface WhatsAppCustomerDetails {
    name: string;
    phone: string;
    address: string;
    pincode: string;
    landmark?: string;
    deliveryInstructions?: string;
}

export interface WhatsAppCartItem {
    name: string;
    quantity: number;
    price: number;
}

export function buildWhatsAppOrderMessage(
    cartItems: WhatsAppCartItem[],
    customerDetails: WhatsAppCustomerDetails,
    totalAmount: number
): string {
    const itemLines = cartItems
        .map(
            (item) =>
                `• ${item.name} - Qty: ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
        )
        .join("\n");

    const addressExtras = [
        customerDetails.landmark ? `Landmark: ${customerDetails.landmark}` : null,
        customerDetails.deliveryInstructions ? `Note: ${customerDetails.deliveryInstructions}` : null,
    ]
        .filter(Boolean)
        .join("\n");

    const message = [
        `Hello ${BUSINESS_CONFIG.name},`,
        "",
        "I would like to place an order.",
        "",
        "📋 *Customer Details*",
        `Name: ${customerDetails.name}`,
        `Phone: ${customerDetails.phone}`,
        `Address: ${customerDetails.address}`,
        `Pincode: ${customerDetails.pincode}`,
        addressExtras ? addressExtras : null,
        "",
        "🛒 *Order Items*",
        itemLines,
        "",
        `💰 *Total Amount: ₹${totalAmount.toFixed(2)}*`,
        "",
        "Please confirm my order. Thank you! 🙏",
    ]
        .filter((line) => line !== null)
        .join("\n");

    return message;
}
