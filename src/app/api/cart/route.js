import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "../../../../models/User";
import connectToDatabase from "../../../../lib/db";
import { getObjectIdFromNumber } from "@/utils/objectId";

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
    console.log(user)
    // const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ cart: user.cart });
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
      user.cart.push({ productId, quantity });
    }

    await user.save();
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
    //itemId.id=10
    await user.save();
    // console.log("USER", user);
    console.log("Updated Cart:", user.cart);
    console.log("PRODUCTID", getObjectIdFromNumber(productId));
    console.log("DECODED", decoded);
    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
