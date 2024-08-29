import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import userModel, { IUser } from "@/models/user";

export const POST = async (req: Request, res: Response) => {
  try {
    const { activation_token, activation_code } = await req.json();

    const newUser: { user: IUser; activationCode: string } = jwt.verify(
      activation_token,
      process.env.JWT_SECRET_KEY as string
    ) as { user: IUser; activationCode: string };

    if (newUser.activationCode !== activation_code) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid activation code `,
        },
        { status: 201 }
      );
    }

    const { name, email, password, role } = newUser.user;
    const existUser = await userModel.findOne({ email });

    if (existUser) {
      return NextResponse.json(
        {
          success: false,
          message: `Email already exists !`,
        },
        { status: 201 }
      );
    }

    const user = await userModel.create({
      name,
      email,
      password,
      role,
    });

    return NextResponse.json(
      {
        success: true,
        message: `User registered successfully!`,
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
};
