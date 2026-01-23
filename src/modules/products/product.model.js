import mongoose from "mongoose";
import slugify from "slugify";

const ProductSchema = mongoose.Schema(
  {
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
      index: true,
    },
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
    specs: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
    },

    hasVariants: {
      type: Boolean,
      default: false,
    },

    images: [
      {
        url: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],

    sku: {
      type: String,
      sparse: true,
      unique: true,
      index: true,
      uppercase: true,
      required: function () {
        return !this.hasVariants;
      },
    },

    stock: {
      type: Number,
      min: 0,
      required: function () {
        return !this.hasVariants;
      },
    },

    variantOptions: {
      type: Map,
      of: [String],
    },

    variants: [
      {
        sku: {
          type: String,
          required: true,
          uppercase: true,
        },
        options: {
          type: Map,
          of: mongoose.Schema.Types.Mixed,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        stock: {
          type: Number,
          required: true,
          min: 0,
        },
        images: [
          {
            url: { type: String, required: true },
            isPrimary: { type: Boolean, default: false },
          },
        ],
        isAvailable: {
          type: Boolean,
          default: true,
        },
        isDefault: {
          type: Boolean,
          default: false,
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
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Auto-generate slug and check duplicate SKUs within document
ProductSchema.pre("validate", function () {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true });
  }

  if (!this.hasVariants || !this.variants) return;
  const skus = this.variants.map((v) => v.sku);
  if (skus.length !== new Set(skus).size) {
    throw new Error("Duplicate variant SKU detected");
  }
});

// Comprehensive validation before save
ProductSchema.pre("save", async function () {
  try {
    // Validate hasVariants consistency
    if (this.hasVariants && (!this.variants || this.variants.length === 0)) {
      throw new Error(
        "Products with hasVariants=true must have at least one variant",
      );
    }

    if (!this.hasVariants && this.variants && this.variants.length > 0) {
      throw new Error("Products with hasVariants=false cannot have variants");
    }

    if (this.hasVariants && this.variants && this.variants.length > 0) {
      // Ensure only one default variant
      const defaultVariants = this.variants.filter((v) => v.isDefault);
      if (defaultVariants.length > 1) {
        throw new Error("Only one variant can be marked as default");
      }
      if (defaultVariants.length === 0 && this.variants.length > 0) {
        this.variants[0].isDefault = true;
      }

      // Validate variant images
      for (let variant of this.variants) {
        if (variant.images && variant.images.length > 0) {
          const primaryImages = variant.images.filter((img) => img.isPrimary);
          if (primaryImages.length === 0) {
            variant.images[0].isPrimary = true;
          } else if (primaryImages.length > 1) {
            throw new Error(
              `Variant with SKU "${variant.sku}" has multiple primary images`,
            );
          }
        }
      }
    }

    // Validate product-level images for non-variant products
    if (!this.hasVariants) {
      if (!this.images || this.images.length === 0) {
        throw new Error(
          "Products without variants must have at least one image",
        );
      }
    }

    // Ensure one primary image for product
    if (this.images && this.images.length > 0) {
      const primaryImages = this.images.filter((img) => img.isPrimary);
      if (primaryImages.length === 0) {
        this.images[0].isPrimary = true;
      } else if (primaryImages.length > 1) {
        throw new Error("Only one product image can be marked as primary");
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});

ProductSchema.index(
  { "variants.sku": 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { hasVariants: true },
  },
);

export const Products = mongoose.model("products", ProductSchema);
