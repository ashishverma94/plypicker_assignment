import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import mongoose, { Document, Model, Schema } from "mongoose";
import { models } from "mongoose";

const emailRegexPattern: RegExp =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  totReq: number;
  pendingReq: number;
  approvedReq: number;
  rejectedReq: number;
  comparePassword: (password: string) => Promise<boolean>;
  getJwtToken: () => any;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      default: "team-member",
      required: [true, "role is required"],
    },
    totReq: { type: Number, default: 0 },
    approvedReq: { type: Number, default: 0 },
    rejectedReq: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY as Secret, {
    expiresIn: "7d",
  });
};

const userModel: Model<IUser> =
  models.User || mongoose.model("User", userSchema);

// const userModel: Model<IUser> =  mongoose.model("User", userSchema);
export default userModel;
