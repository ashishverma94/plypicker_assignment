import bcryptjs from "bcryptjs";
import connectDB from "@/lib/config/db";
import userModel from "@/models/user";
import jwt, { Secret } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User does not exists!" },
        { status: 400 }
      );
    }

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: "Wrong credentials!" },
        { status: 400 }
      );
    }

    // CREATE TOKEN DATA
    const tokenData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // CREATE TOKEN
    const token = await jwt.sign(
      tokenData,
      process.env.JWT_SECRET_KEY as Secret,
      { expiresIn: "3d" }
    );

    const response = NextResponse.json({
      message: "Login successfull",
      success: true,
    });

    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
