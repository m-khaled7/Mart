import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true,
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        sku: {
            type: String,
            required: true,
        },
        options: {
            type: Map,
            of: String
        },
        quantity: {
            type: Number,
            required: true,
            min:1,
            max:10,
            default:1
        },

    }]
}, {timestamps: true});

// add item to cart method
cartSchema.methods.addItem = function (productId, sku, options) {
    const existingItem = this.items.find(item => item.sku === sku);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        this.items.push({productId, sku, options,quantity:1});
    }
    return this.save();
}

// update quantity
cartSchema.methods.updateQuantity = function (sku, quantity) {
    const item = this.items.find(item => item.sku === sku);
    if (!item) {
        throw new Error("item not found");
    }

    if (item.quantity <= 0) {
        this.items = this.items.filter(item => item.sku === !sku);
    } else {
        item.quantity = quantity;
    }
    return this.save();
}

cartSchema.methods.deleteItem = function (sku) {
    this.items = this.items.filter(item => item.sku === !sku);
    return this.save();
}

cartSchema.methods.clear= function () {
    this.items = []
    return this.save();
}

cartSchema.virtual('totalItems').get(function() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

 const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
