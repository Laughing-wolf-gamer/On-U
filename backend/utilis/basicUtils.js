


export const calculateGst= (originalPrice,gst)=>{
    return originalPrice * (1 + (gst / 100)).toFixed(1)
}
export function getOriginalAmount(gstRate, amountWithGST) {
    // Calculate the original amount before GST
    const originalAmount = amountWithGST / (1 + (gstRate / 100));
    return originalAmount;
}
export const calculateDiscount = (originalPrice, salePrice) => {
    // Ensure prices are valid (greater than 0)
    if (originalPrice <= 0 || salePrice < 0) {
        throw new Error("Invalid price values");
    }

    // Calculate the discount amount
    const discountAmount = originalPrice - salePrice;

    // Calculate the discount percentage
    const discountPercentage = ((discountAmount / originalPrice) * 100).toFixed(0);

    return {
        discountAmount,
        discountPercentage,
    };
};
export const calculateDiscountPercentage = (originalPrice, salePrice) => {
    if (originalPrice > 0 && salePrice > 0) {
      return Math.round(((originalPrice - salePrice) / originalPrice) * 100).toFixed(0);
    }
    return 0; // Return 0 if the prices are invalid or zero
};