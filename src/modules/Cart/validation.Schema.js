import { z } from "zod";

//  Add Product to Cart
export const addToCartSchema = z.object({
    slug: z
        .string({
            required_error: "slug is required",
            invalid_type_error: "slug must be a string",
        })
        .min(1, { message: "slug cannot be empty" })
        .max(200, { message: "slug should be less than 200" }),
    sku: z
        .string({
            required_error: "sku is required",
            invalid_type_error: "sku must be a string",
        })
        .min(1, { message: "sku cannot be empty" })
        .max(50, { message: "sku should be less than 50" })
});

// Update Product Quantity
export const updateQuantitySchema = z.object({
    quantity: z
        .number({
            required_error: "Quantity is required",
            invalid_type_error: "Quantity must be a number",
        })
        .int()
        .min(1, { message: "Quantity must be at least 1" }),
    sku: z
        .string({
            required_error: "sku is required",
            invalid_type_error: "sku must be a string",
        })
        .min(1, { message: "sku cannot be empty" })
        .max(50, { message: "sku should be less than 50" })
});
