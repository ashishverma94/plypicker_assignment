import { NextResponse } from "next/server";
import userModel from "@/app/lib/models/user";
import ejs from "ejs";
import path from "path";
import sendMail from "@/app/utils/sendMail";
import { createActivationToken } from "@/app/utils/token";
import connectDB from "@/app/lib/config/db";

connectDB();


interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

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
