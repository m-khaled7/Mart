import mongoose from "mongoose";
import slugify from "slugify";

const ProductSchema = mongoose.Schema({
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
  slug: { type: String, required: true, unique: true, index: true },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  overview: {
    type: String,
    required: true,
    minLength: 100,
    maxLength: 2000,
  },
  specs: [
    {
      name: String,
      values: [String],
    },
  ],

  images: [
    {
      url: {
        type: String,
        required: true,
      },
      isPrimary: {
        type: Boolean,
        default: false,
      },
    },
  ],

  sku: {
    type: String,
    sparse: true,
    unique: true,
    index: true,
    lowercase: true,
  },

  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },

  hasVariants: {
    type: Boolean,
    default: false,
  },

  variantOptions: [
    {
      name: String,
      values: [String],
    },
  ],

  variants: [
    {
      sku: {
        type: String,
        required: true,
      },
      options: [
        {
          name: String,
          value: String,
        },
      ],
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      images: [
        {
          url: {
            type: String,
            required: true,
          },
          isPrimary: {
            type: Boolean,
            default: false,
          },
        },
      ],
      isAvailable: {
        type: Boolean,
        default: true,
      },
    },
  ],

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

//auto generate slug
ProductSchema.pre("validate", function () {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true });
  }
});

export const Products = mongoose.model("products", ProductSchema);
