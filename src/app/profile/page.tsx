"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import LoadingGif from "../../../assets/Loading2.gif";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface IUserData {
  approvedReq: number;
  rejectedReq: number;
  _id: string;
  name: string;
  email: string;
  role: string;
  totReq: number;
}

const page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        setLoadingData(true);
        const response = await axios.get(`/api/user/me`);
        console.log(response);
        setUserData(response?.data?.user);
      } catch (err: any) {
        if (err.response) {
          setError(err?.response.data.message || "An error occurred");
        } else {
          setError(err.message || "An unexpected error occurred");
        }
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  let pendReqs: number = 0;
  if (userData) {
    pendReqs =
      userData?.totReq - (userData?.approvedReq + userData?.rejectedReq);
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/api/user/logout`);

      toast({
        style: { backgroundColor: "#4CAF50", color: "#fff" },
        description: "Logged out successfully!",
      });
      router.push("/login")
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: err.message || "Server Error !",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-[80px] bg-[#edebeb] flex flex-col  gap-5 p-3 h-[90vh]">
      {error && <div className="text-[red] font-bold"> {error && error} </div>}
      <div className="w-full justify-end flex">
        {loadingData === false && (
          <div className=" flex flex-row gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-orange-500 text-white font-semibold py-2 px-3 rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300"
            >
              Go to Dashboard
            </button>
            {isLoading ? (
              <Button disabled>
                <Loader2 className="rounded-[25px] w-[45px] animate-spin" />
              </Button>
            ) : (
              <Button
                onClick={() => handleLogout()}
                className="bg-[#eb8743] p-0 w-[40px] hover:bg-[#eb9963] hover:ring-2 hover:ring-[#ae96ea]  hover:text-[black] rounded-[20px]"
              >
                <img
                  src="https://img.icons8.com/?size=100&id=24340&format=png&color=FFFFFF"
                  className="w-[30px]"
                  alt="Logout"
                  title="Logout"
                />
              </Button>
            )}
          </div>
        )}
      </div>
      {loadingData || !userData ? (
        <div className=" flex justify-center items-center w-full h-[70vh]">
          <Image
            className="h-[130px] w-[130px]"
            src={LoadingGif}
            width={400}
            height={400}
            alt="Loading Icon"
          />
        </div>
      ) : (
        <div className="flex flex-col w-full justify-center items-center gap-4">
          <div className="bg-[white] w-[40%] p-[20px] rounded-[12px] shadow-lg  flex justify-center items-center flex-col gap-2 h-[200px]">
            <h1 className="font-[700] text-[20px] ">User Infomation</h1>
            <h1>
              <span className="font-bold text-gray-800">Name : </span>
              {userData?.name}
            </h1>
            <h1>
              <span className="font-bold text-gray-800">Email : </span>
              {userData?.email}
            </h1>
          </div>
          <div className="bg-[white] w-[40%] p-[20px] rounded-[12px] shadow-lg  flex justify-center items-center flex-col gap-2">
            <h1 className="font-[700] text-[23px] ">Statistics</h1>
            {userData?.role !== "admin" && (
              <h1>
                <span className="font-bold text-gray-800">
                  Total Requests :
                </span>
                {userData?.totReq}
              </h1>
            )}
            <h1>
              <span className="font-bold text-[#d82c2c]">
                Rejected Requests :
              </span>
              {userData?.rejectedReq}
            </h1>
            {userData?.role !== "admin" && (
              <h1>
                <span className="font-bold text-[#ee9939]">
                  Pending Requests :
                </span>
                {pendReqs}
              </h1>
            )}
            <h1>
              <span className="font-bold text-[#2ecd36]">
                Approved Requests :
              </span>
              {userData?.approvedReq}
            </h1>
            <button
              onClick={() =>
                router.push(
                  userData.role === "admin"
                    ? "/pending-requests"
                    : "/profile/my-submissions"
                )
              }
              className="bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              {userData.role === "admin"
                ? "View Pending Requests"
                : "View Submissions"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
