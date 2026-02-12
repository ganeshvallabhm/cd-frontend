/**
 * Converts a product name to a web-safe filename
 * Rules:
 * - Convert to lowercase
 * - Replace spaces with hyphens
 * - Remove special characters (/, &, etc.)
 * - Replace em dash (–) with hyphen
 */
export const getImageFilename = (productName: string): string => {
    return productName
        .toLowerCase()
        .replace(/–/g, '-') // Replace em dash with hyphen
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[\/&]/g, '-') // Replace / and & with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim();
};

/**
 * Gets the image URL for a product
 * Tries .png first, then .jpg
 * Returns fallback if no image exists
 */
export const getProductImageUrl = (productName: string): string => {
    const filename = getImageFilename(productName);

    // For rasam powder specifically, use .jpg
    if (filename === 'rasam-powder') {
        return `/images/products/${filename}.jpg`;
    }

    // Default to .png for all other products
    return `/images/products/${filename}.png`;
};

/**
 * Fallback placeholder for products without images
 */
export const FALLBACK_IMAGE = '/placeholder.svg';
