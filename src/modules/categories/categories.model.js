import mongoose from "mongoose";
import slugify from "slugify";

//category collection
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
});

categorySchema.pre("validate", function () {
  if (!this.isModified("name")) return;
  this.slug = slugify(this.name, { lower: true });
});

export const category = mongoose.model("category", categorySchema);

//-------- sub-category collection---------\\
const subcategorySchema = mongoose.Schema({
  category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
  name: {
    type: String,
    required: true,
    maxLength: 50,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  specSchema: [
    //products specs schema per category [for standring and validation]
    {
      key: {
        type: String,
        required: true,
      },

      label: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        enum: ["string", "number", "boolean", "enum"],
        required: true,
      },

      required: {
        type: Boolean,
        default: false,
      },

      filterable: {
        type: Boolean,
        default: false,
      },
      isVariant: {
        type: Boolean,
        default: false,
      },

      enumValues: [String],

      unit: String,
    },
  ],
});

subcategorySchema.pre("validate", function () {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true });
  }
});

export const subcategory = mongoose.model("subcategory", subcategorySchema);
