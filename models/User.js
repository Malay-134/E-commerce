import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
