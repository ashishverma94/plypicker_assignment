"use client";

import axios from "axios";
import { Loader2 } from "lucide-react";
import Modal from "@/components/ImageModal";
import { departmentArray } from "@/utils/data";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/utils/uploadImage";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const page = () => {
  const { toast } = useToast();

  const [prodName, setProdName] = useState<string>("");
  const [prodDesc, setProdDesc] = useState<string>("");
  const [prodDepartment, setProdDepartment] = useState<string>("");
  const [imageObj, setImageObj] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 7000);
  }, [error]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const avatarUrl = useRef(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG9CErcUzmfCXsJWF7kHzMbru22qdGhaGZF251M1c_yYhduC-Bx4SHVFtOn2g9R1-ShOo&usqp=CAU"
  );

  const updateAvatar = (imgSrc: any) => {
    avatarUrl.current = imgSrc;
  };

  const handleSubmit = async () => {
    if (!prodName) {
      setError("Product Name is required");
      return;
    }
    if (!prodDesc) {
      setError("Product Description is required");
      return;
    }
    if (!prodDepartment) {
      setError("Product Department is required");
      return;
    }

    try {
      setLoading(true);
      setMessage("Uploading Image");
      const imageURL = await uploadImage(imageObj);
      console.log(imageURL);
      setMessage("Sending Data");

      if (!imageURL) {
        setError("Error in uploading image");
        return;
      }

      const currProduct = {
        prodName,
        prodDesc,
        prodDepartment,
        prodPic: imageURL,
      };

      const response = await axios.post(`/api/product/add`, {
        currProduct,
      });
      toast({
        style: { backgroundColor: "#4CAF50", color: "#fff" },
        description: "Product added successfully",
      });
      setImageObj(null);
      setProdName("");
      setProdDesc("");
      setProdDepartment("");
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
      setMessage("");
    }
  };

  return (
    <div className=" h-[100vh] w-[full] justify-center items-center">
      <h1 className="text-center font-[700] text-[30px] pt-4">Add Product</h1>
      <div className="w-full justify-center items-center flex flex-col gap-3 p-10">
        <div className="flex flex-col md:flex-row gap-4 border-black border-[2px] rounded-lg p-5">
          <div className="flex flex-col justify-start items-center gap-3">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Enter your product name
                <span className="mx-1 text-[red] text-[20px] font-bold">*</span>
              </label>
              <input
                id="name"
                type="name"
                name="name"
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                className=" h-[40px] px-2 mt-1 block w-full border border-[black] rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Enter your product description
                <span className="mx-1 text-[red] text-[20px] font-bold">*</span>
              </label>
              <input
                id="email"
                name="email"
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                className=" h-[40px] px-2 mt-1 block w-full border border-[black] rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700"
              >
                Select product department
                <span className="mx-1 text-[red] text-[20px] font-bold">*</span>
              </label>
              <select
                id="department"
                name="department"
                value={prodDepartment}
                onChange={(e) => setProdDepartment(e.target.value)}
                className="h-[40px] px-2 mt-1 mb-2 block w-full border border-[black] rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="" disabled>
                  Select product department
                </option>
                {departmentArray.map((department, index) => (
                  <option key={index} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-3">
            <div className="relative flex justify-center items-center gap-3 flex-col">
              <img
                src={avatarUrl.current}
                alt="Avatar"
                className="w-[250px] h-[250px] border-2 border-gray-400"
              />
              <button
                className="m-auto bg-[#22b6e3] hover:border-[2px] hover:border-[#22b6e3] hover:bg-white px-3 py-2 rounded-md"
                title="Change photo"
                onClick={() => setModalOpen(true)}
              >
                Select Product Image
              </button>
            </div>
          </div>
          {modalOpen && (
            <Modal
              updateAvatar={updateAvatar}
              closeModal={() => setModalOpen(false)}
              imageObj={setImageObj}
            />
          )}
        </div>
        <div className="text-[red] font-bold h-[18px]">{error && error}</div>
        {loading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {message}
          </Button>
        ) : (
          <Button onClick={handleSubmit}>Submit</Button>
        )}
      </div>
    </div>
  );
};

export default page;
