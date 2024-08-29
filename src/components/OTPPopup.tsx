"use client";

import axios from "axios";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import React, { FC, useRef, useState } from "react";

type Props = {
  open: boolean;
  setOpen: any;
  activation_token: string;
};

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const OTPPopup: FC<Props> = ({ open, setOpen, activation_token }) => {
  const router = useRouter();

  const [delLoading, setDelLoading] = useState<boolean>(false);
  const [delErr, setDelErr] = useState<string | null>("");
  const [invalidError, setInvalidError] = useState<boolean>(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [VerifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    "0": "",
    "1": "",
    "2": "",
    "3": "",
  });

  const verificationHandler = async () => {
    const activation_code =
      VerifyNumber[0] + VerifyNumber[1] + VerifyNumber[2] + VerifyNumber[3];
    try {
      setDelLoading(true);
      await axios.post(`/api/user/activation-email`, {
        activation_code,
        activation_token,
      });
      toast({
        style: { backgroundColor: "#4CAF50", color: "#fff" },
        description: "User registered successfully!",
      });
      router.push("/login");
    } catch (error: any) {
      setDelErr(
        error.response?.data.message || error.message || "Internal server error"
      );
      toast({
        variant: "destructive",
        description:
          error.response?.data.message ||
          error.message ||
          "Internal server error",
      });
    } finally {
      setDelLoading(false);
      setOpen(false);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...VerifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white pb-6 h-max p-2 rounded-lg shadow-lg w-11/12 max-w-md">
        <div className="h-full flex flex-col justify-center w-full items-center px-4">
          <h2 className="text-2xl pt-3 font-[700] mb-4 text-center">
            Verify Your Account
          </h2>
          <div className="w-full flex justify-center items-center mt-2">
            <Image
              src="https://cdn-icons-png.freepik.com/512/8631/8631499.png"
              alt="verify shield"
              width={100}
              height={100}
              className="mt-[-20px]"
            />
          </div>
          <div className="m-auto flex items-center justify-around">
            {Object.keys(VerifyNumber).map((key, index) => (
              <input
                type="text"
                key={key}
                ref={inputRefs[index]}
                className={`w-[65px] mx-2 h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-black justify-center text-[18px] outline-none text-center ${
                  invalidError ? " shake border-red-500" : "border-black"
                }`}
                placeholder=""
                maxLength={1}
                value={VerifyNumber[key as keyof VerifyNumber]}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            ))}
          </div>
          <h1 className="font-bold text-[gray] py-2 text-center ">
            Check your email for the OTP and enter it to continue.
          </h1>

          <div className=" h-[25px] ">
            {delErr && (
              <h1 className="text-[red] font-bold">Error : {delErr}</h1>
            )}
          </div>
          <div className="text-center flex  items-center justify-center gap-3">
            {delLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                onClick={() => verificationHandler()}
                className="px-[25px] py-[15px] font-[500] text-[18px] rounded-md bg-gradient-to-r from-[#3d50b9] to-[#0675c4] text-white hover:from-[#3fa6c3] hover:to-[#2c77e1] focus:outline-none focus:ring-2 focus:ring-[#000f80] hover:text-[white] hover:border-[2px] hover:border-[#000f80] focus:ring-offset-2 shadow-md transition duration-150 ease-in-out transform hover:scale-105 w-auto"
              >
                Verify OTP
              </Button>
            )}
          </div>
          <h5 className="text-center pt-4 text-[14px] text-black">
            Go back to Log in?
            <span
              className="text-[#2190ff] pl-1 cursor-pointer"
              onClick={() => router.push("login")}
            >
              Log in
            </span>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default OTPPopup;
