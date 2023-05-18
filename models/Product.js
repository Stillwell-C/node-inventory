const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    rating: { type: Number, required: true },
    stock: { type: Number, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

ProductSchema.virtual("url").get(function () {
  return `/products/${this.id}`;
});

//Convert images array into string
ProductSchema.virtual("imageLinks").get(function () {
  return this.images.join(", ");
});

module.exports = mongoose.model("Product", ProductSchema);
