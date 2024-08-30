import userModel from "@/models/user";
import connectDB from "@/lib/config/db";
import { NextResponse } from "next/server";

connectDB();

export const POST = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = await req.json();

    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return new NextResponse(
        JSON.stringify({
          message: "User already exist!",
        }),
        { status: 500 }
      );
    }

    try {
      const user = await userModel.create({
        name,
        email,
        password,
        role,
      });

      return NextResponse.json(
        {
          success: true,
          message: `User registered successfully !`,
        },
        { status: 201 }
      );
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({
          message: error.message,
          error,
        }),
        { status: 500 }
      );
    }
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: error.message,
        error,
      }),
      { status: 500 }
    );
  }
};
