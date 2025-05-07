import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  rating: Number,
  thumbnail: String,
  description: String,
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);
