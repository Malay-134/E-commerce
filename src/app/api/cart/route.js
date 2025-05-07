import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "../../../../models/User";
import connectToDatabase from "../../../../lib/db";
import { getObjectIdFromNumber } from "@/utils/objectId";
import mongoose from "mongoose";
import Product from "../../../../models/Product";

const secret = process.env.JWT_SECRET;

export async function GET(request) {
  await connectToDatabase();

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).populate("cart.productId");
    console.log("decoded", decoded);
    console.log("decodedID", decoded.id);
    console.log("UserDetail(get)", user);
    // console.log("User cart before populate:", user.cart);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // return NextResponse.json({ cart: user.cart });
    const cartWithDetails = user.cart.map((item) => {
      const product = item.productId;
      if (!product) return null;
      return {
        // id: Number,
        // title: String,
        // price: Number,
        // thumbnail: String,
        // description: String,
        id: product._id.toString(),
        name: product.name,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        rating: product.rating,
        image: product.image,
        quantity: item.quantity,
      };
    });

    return NextResponse.json({ cart: cartWithDetails });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await connectToDatabase();

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const { productId, quantity } = await request.json();
    const objectId = new mongoose.Types.ObjectId(productId);
    console.log("objectId", objectId);
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const productExists = await Product.findById(objectId);
    console.log("PRODUCTexist", productExists);
    if (!productExists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ productId: objectId, quantity });
    }

    await user.save();
    console.log("UserDetail(post)", user);
    return NextResponse.json({
      message: "Item added to cart",
      cart: user.cart,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  await connectToDatabase();

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const productId = request.nextUrl.searchParams.get("productId");
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log("Before Cart:", user.cart);
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== getObjectIdFromNumber(productId)
    );
    console.log("After Cart", user.cart);
    //itemId.id=10
    await user.save();
    // console.log("USER", user);
    // console.log("Updated Cart:", user.cart);
    console.log("PRODUCTID", getObjectIdFromNumber(productId));
    // console.log("DECODED", decoded);
    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
