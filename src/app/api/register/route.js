import { NextResponse } from "next/server";
import User from "../../../../models/User";
import bcrypt from "bcrypt";
import connectToDatabase from "../../../../lib/db";

export async function POST(request) {
  try {
    connectToDatabase();
    const { name, email, password } = await request.json();
    const userExisted = await User.findOne({ email });
    if (userExisted) {
      return NextResponse.json({ error: "User already exist", status: 500 });
    }
    const haspassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: haspassword,
    });
    await newUser.save();
    return NextResponse.json({ message: "User registered", status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}
