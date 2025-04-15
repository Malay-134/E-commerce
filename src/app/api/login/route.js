import { NextResponse } from "next/server";
import User from "../../../../models/User";
import bcrypt from "bcrypt";
import connectToDatabase from "../../../../lib/db";

export async function POST(request) {
  try {
    connectToDatabase();
    const { email, password } = await request.json();
    const userExisted = await User.findOne({ email });
    if (!userExisted) {
      return NextResponse.json({ error: "User not existed", status: 500 });
    }
    const checkPassword = await bcrypt.compare(password, userExisted.password);

    if (!checkPassword) {
      return NextResponse.json({ error: "Wrong Password", status: 404 });
    }
    return NextResponse.json({
      message: "success",
      status: 201,
      user: {
        id: userExisted._id,
        name: userExisted.name,
        email: userExisted.email,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}
