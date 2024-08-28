"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingGif from "../../../assets/Loading2.gif";
import { useToast } from "@/components/ui/use-toast";
import OTPPopup from "@/components/OTPPopup";

const SignupPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 4000);
  }, [error]);

  const handleSignUp = async (e: any) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your email");
      return;
    }
    if (!email) {
      setError("Please enter your email");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`api/register`, {
        name,
        email,
        password,
      });
      toast({
        style: { backgroundColor: "#4CAF50", color: "#fff" },
        description: response.data.message,
      });
      setToken(response.data.activationToken);
      setOpen(true);
    } catch (err: any) {
      console.log(err);
      if (err.response) {
        setError(
          `Error: ${err.response.data.message || "Something went wrong"}`
        );
      } else if (err.request) {
        setError("Network error. Please try again later.");
      } else {
        setError("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full  max-w-md pt-8 pb-2 px-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-4xl font-bold  text-center text-[black]">
          Register
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Enter your name
              <span className="mx-1 text-[red] text-[20px] font-bold">*</span>
            </label>
            <input
              id="name"
              type="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=" h-[40px] px-2 mt-1 block w-full border border-[black] rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Enter your email
              <span className="mx-1 text-[red] text-[20px] font-bold">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" h-[40px] px-2 mt-1 block w-full border border-[black] rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Enter your password
              <span className="mx-1 text-[red] text-[20px] font-bold">*</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-[40px] px-2 mt-1 mb-2 block w-full border border-[black] rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="space-y-4 mb-6 text-[14px]">
            <label className="block text-sm font-medium text-gray-700">
              Select your role
              <span className="mx-1 text-[red] text-[20px] font-bold">*</span>
            </label>
            <div className="flex  gap-6">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="role"
                  value="team-member"
                  checked={role === "team-member"}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">Team Member</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">Admin</span>
              </label>
            </div>
          </div>

          <button
            disabled={loading}
            onClick={(e) => handleSignUp(e)}
            className="w-full disabled:bg-[gray] disabled:cursor-not-allowed py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <Image
                  className="h-[30px] w-[30px]"
                  src={LoadingGif}
                  width={500}
                  height={500}
                  alt="Loading Icon"
                />
                <p>Loading</p>
              </div>
            ) : (
              "Signin"
            )}
          </button>
        </div>
        <div className="text-center h-[23px] text-[red] font-bold">
          {error && error}
        </div>
      </div>
      <div className="font-[600] mt-[20px]">
        <h1
          className=" cursor-pointer text-[#2c76f7] hover:text-[blue]"
          onClick={() => router.push("/login")}
        >
          Already have account.
        </h1>
      </div>
      {!open && <OTPPopup open={open} setOpen={setOpen} token={token} />}
    </div>
  );
};

export default SignupPage;
