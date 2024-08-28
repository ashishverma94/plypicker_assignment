import { NextResponse } from "next/server";
import ejs from "ejs";
import path from "path";
import connectDB from "@/lib/config/db";
import userModel from "@/lib/models/user";
import { createActivationToken } from "@/utils/token";
import sendMail from "@/utils/sendMail";

connectDB();


interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  role:string
}

export const POST = async (req: Request, res: Response) => {
  try {
    const { name, email, password,role } = await req.json();
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
      role,
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
