import ejs from "ejs";
import path from "path";
import nodemailer, { Transporter } from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;
  console.log(email, subject, template, options);
  // get the path to the email template file
  const templatePath = path.join(
    process.cwd(),
    "app",
    "lib",
    "mails",
    "activation-mail.ejs"
  );
  // render the email template with EJS
  const html: string = await ejs.renderFile(templatePath, data);
  // send the email
  const mailOptions = await transporter.sendMail({
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  });
};

export default sendMail;
