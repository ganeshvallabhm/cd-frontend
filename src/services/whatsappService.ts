import { BUSINESS_CONFIG } from "@/config/businessConfig";
import {
    buildWhatsAppOrderMessage,
    WhatsAppCartItem,
    WhatsAppCustomerDetails,
} from "@/utils/whatsappOrder";

/**
 * Generates the wa.me URL with the pre-filled order message.
 *
 * @param message - Plain-text message to encode into the URL
 * @returns Full WhatsApp URL ready to open
 */
export function generateWhatsAppURL(message: string): string {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodedMessage}`;
}

/**
 * Opens WhatsApp in a new browser tab with a pre-filled order message.
 *
 * @param message - The order message string
 */
export function openWhatsApp(message: string): void {
    const url = generateWhatsAppURL(message);
    window.open(url, "_blank");
}

/**
 * All-in-one helper — builds the message and opens WhatsApp.
 *
 * Usage inside a checkout submit handler:
 *
 * ```ts
 * import { sendOrderToWhatsApp } from "@/services/whatsappService";
 *
 * sendOrderToWhatsApp(
 *   items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
 *   {
 *     name: formData.fullName,
 *     phone: formData.phoneNumber,
 *     address: formData.address,
 *     pincode: formData.pincode,
 *     landmark: formData.landmark,
 *     deliveryInstructions: formData.deliveryInstructions,
 *   },
 *   totalAmount
 * );
 * clearCart();
 * toast({ title: "Order message opened in WhatsApp" });
 * ```
 *
 * @param cartItems        - Cart items (name, quantity, price)
 * @param customerDetails  - Customer delivery details
 * @param totalAmount      - Total order amount
 */
export function sendOrderToWhatsApp(
    cartItems: WhatsAppCartItem[],
    customerDetails: WhatsAppCustomerDetails,
    totalAmount: number
): void {
    const message = buildWhatsAppOrderMessage(
        cartItems,
        customerDetails,
        totalAmount
    );
    openWhatsApp(message);
}
