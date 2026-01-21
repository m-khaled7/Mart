import mongoose from "mongoose";
import slugify from "slugify";

const variantSchema = new mongoose.Schema(
  {
    attributes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, 
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    stock: {
      type: Number,
      required: true,
      min: 0
    },

    sku: {
      type: String,
      unique: true
    },

    isDefault: {
      type: Boolean,
      default: false
    }
  },
  { _id: true }
);


const productSchema = mongoose.Schema({
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategory",
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxLength: 200,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  images: [
    {
      url: String,
      alt: String,
    },
  ],
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  discountPrice: {
    type: Number,
    validate: {
      validator(value) {
        return value < this.price;
      },
      message: "Discount price must be less than regular price",
    },
  },
  overview: {
    type: String,
    required: true,
    minLength: 100,
    maxlength: 2000,
  },
  specs: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  
  variants: [variantSchema],

  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  sold: {
    type: Number,
    min: 0,
    default: 0,
  },
  ratingAvg: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    set: (v) => Math.round(v * 10) / 10,
  },
  ratingQuantity: {
    type: Number,
    min: 0,
    default: 0,
  },
  isActive: Boolean,
  isFeatured: Boolean,
});

productSchema.pre("validate", function () {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true });
  }
});

productSchema.virtual("finalPrice").get(function () {
  return this.discountPrice ?? this.price;
});

export const Products = mongoose.model("products", productSchema);
