import Cart from "./cart.model.js"
import Product from "../Products/product.model.js";
import AppError from "../../utils/AppError.js";

export const addToCartService = async (userId, data) => {
    const product = await Product.findOne({ slug: data.slug })
    let options = new Map();

    if (!product) {
        throw new AppError("Product not found", 404);
    }
    //check of valid sku, stock and fill option if exist
    if (product.hasVariants) {
        const variant = product.variants.find(item => item.sku === data.sku);
        if (!variant) {
            throw new AppError("Invalid SKU for this product", 404);
        }
        if (variant.stock === 0) {
            throw new AppError("This variant is out of stock", 400);
        }
        options = new Map(Object.entries(variant.options || {}));
    } else {
        if (product.sku !== data.sku) {
            throw new AppError("Invalid SKU for this product", 404);
        }

        if (product.stock === 0) {
            throw new AppError("This product is out of stock", 400);
        }

    }

    const cart = await Cart.findOne({ userId })
    if (!cart) {
        return await Cart.create({
            userId, items: [{
                productId: product._id,
                sku: data.sku,
                options
            }],
        })
    } else {
        const existingItem = cart.items.find(item => item.sku === data.sku);

        if (existingItem) {
            throw new AppError(`this product already in the cart`, 400);
        }

        return await cart.addItem(product._id, data.sku, options)
    }

}