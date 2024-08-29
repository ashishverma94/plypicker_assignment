"use client";

import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import LoadingGif from "../../../assets/Loading2.gif";

const LoginPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: any) => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `api/user/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      toast({
        style: { backgroundColor: "#4CAF50", color: "#fff" },
        description: "Logged in successfully",
      });
      router.push("/dashboard");
    } catch (err: any) {
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
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-4xl font-bold  text-center text-[black]">Login</h2>
        <div className="space-y-4">
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

          <button
            disabled={loading}
            onClick={(e) => handleLogin(e)}
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
              "Login"
            )}
          </button>
        </div>
        {error && (
          <div className="text-center text-[red] font-bold">{error}</div>
        )}
      </div>
      <div className="font-[600] mt-[20px]">
        <h1
          className=" cursor-pointer text-[#2c76f7] hover:text-[blue]"
          onClick={() => router.push("/signup")}
        >
          Create a new account
        </h1>
      </div>
    </div>
  );
};

export default LoginPage;
