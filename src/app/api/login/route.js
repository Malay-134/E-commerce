import { NextResponse } from "next/server";
import User from "../../../../models/User";
import bcrypt from "bcrypt";
import connectToDatabase from "../../../../lib/db";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();
    const userExisted = await User.findOne({ email });
    if (!userExisted) {
      return NextResponse.json({ error: "User not existed" }, { status: 404 });
    }
    const checkPassword = await bcrypt.compare(password, userExisted.password);

    if (!checkPassword) {
      return NextResponse.json({ error: "Wrong Password" }, { status: 401 });
    }
    const token = jwt.sign(
      { id: userExisted._id, email: userExisted.email },
      secret,
      { expiresIn: "1d" }
    );
    const response = NextResponse.json({
      message: "success",
      success:"true",                     /////////////////////////
      user: {
        id: userExisted._id,
        name: userExisted.name,
        email: userExisted.email,
      },
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, 
      path: "/",
    });
    return response;
    // return NextResponse.json({
    //   message: "success",
    //   status: 201,
    //   user: {
    //     id: userExisted._id,
    //     name: userExisted.name,
    //     email: userExisted.email,
    //   },
    // });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
