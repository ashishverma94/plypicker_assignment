"use client";

import axios from "axios";
import RedMark from "./RedMark";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type props = {
  setOpenPopup: any;
  id: string;
};

const MergePordPopup: FC<props> = ({ setOpenPopup, id }) => {
  const router = useRouter() ;
  const { toast } = useToast();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 4000);
  }, [error]);

  const handleSubmit = async () => {
    if (!status) {
      setError("Please select status");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`/api/product/update-request/${id}`, {
        status,
      });
      setOpenPopup(false) ;
      router.push("/pending-requests")
      toast({
        style: { backgroundColor: "#4CAF50", color: "#fff" },
        description: "Product status submitted !",
      });
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
    <div className="fixed inset-0 flex items-center justify-center z-[50]">
      <div className="fixed inset-0 flex justify-center items-center bg-[#0000004d] z-[51]">
        <div className="relative bg-white p-6 rounded-lg shadow-lg md:w-[25%]  w-[93%] z-[52]">
          <button
            className="absolute text-[red] font-[600] text-[30px] mr-4 top-2 right-2 hover:text-[#ed7979]"
            onClick={() => setOpenPopup(false)}
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold mb-4">Submit Request</h2>
          <div className="flex gap-4 justify-center">
            <div className="">
              <div>
                <label className="font-bold block text-gray-700 mb-2">
                  Select status for this product:
                  <RedMark />
                </label>
                <select
                  id="department"
                  name="department"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-[40px] px-2 mt-1 mb-2 block w-full border border-[black] rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                </select>
              </div>
            </div>
          </div>

          <div className=" flex justify-center ">
            <div className="flex flex-col justify-center items-center">
              <div className="text-[red] mb-2 font-bold h-[18px]">
                {error && error}
              </div>
              {loading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </Button>
              ) : (
                <button
                  onClick={() => handleSubmit()}
                  className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                >
                  Submit Request
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MergePordPopup;
