import { NextResponse } from "next/server";
import connectDB from "@/app/lib/config/db";
import userModel from "@/app/lib/models/user";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "@/app/utils/sendMail";

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const GET = async () => {
  try {
    await connectDB();
    const users = await userModel.find();
    return NextResponse.json(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching users" + error.message, {
      status: 500,
    });
  }
};

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.JWT_SECRET_KEY as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

export const POST = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = await req.json();
    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return new NextResponse(
        JSON.stringify({
          message: "User already exist!",
        }),
        { status: 500 }
      );
    }
    const user: IRegistrationBody = {
      name,
      email,
      password,
    };

    const activationToken = createActivationToken(user);
    const activationCode = activationToken.activationCode;

    const templatePath = path.join(
      process.cwd(),
      "app",
      "lib",
      "mails",
      "activation-mail.ejs"
    );

    const data = { user: { name: user.name }, activationCode };
    const html = await ejs.renderFile(templatePath, data);

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        template: "activation-mail.ejs",
        data,
      });

      return NextResponse.json(
        {
          success: true,
          message: `Please check your email: ${user.email} to activate your account!`,
          activationToken: activationToken.token,
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
