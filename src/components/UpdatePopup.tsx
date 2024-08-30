"use client";

import axios from "axios";
import RedMark from "./RedMark";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import Modal from "@/components/ImageModal";
import { departmentArray } from "@/utils/data";
import { uploadImage } from "@/utils/uploadImage";
import { FC, useEffect, useRef, useState } from "react";

type props = {
  setIsPopupOpen: any;
  oldProdName: string;
  oldProdDepartment: string;
  oldProdDesc: string;
  idProduct: string;
  setProductData: any;
};

interface IUserData {
  approvedReq: number;
  rejectedReq: number;
  _id: string;
  name: string;
  email: string;
  role: string;
  totReq: number;
}

const UpdatePopup: FC<props> = ({
  setIsPopupOpen,
  oldProdName,
  oldProdDepartment,
  oldProdDesc,
  idProduct,
  setProductData,
}) => {
  const { toast } = useToast();
  const [prodName, setProdName] = useState<string>(oldProdName);
  const [prodDep, setProdDep] = useState<string>(oldProdDepartment);
  const [prodDesc, setProdDesc] = useState<string>(oldProdDesc);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [imageObj, setImageObj] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // LOAD USER DATA
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        setLoadingData(true);
        const response = await axios.get(`/api/user/me`);
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
  /////////////////

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 4000);
  }, [error]);

  const avatarUrl = useRef(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG9CErcUzmfCXsJWF7kHzMbru22qdGhaGZF251M1c_yYhduC-Bx4SHVFtOn2g9R1-ShOo&usqp=CAU"
  );

  const updateAvatar = (imgSrc: any) => {
    avatarUrl.current = imgSrc;
  };

  const handleSubmit = async (route: string) => {
    if (!prodName) {
      setError("Product Name is required");
      return;
    }
    if (!prodDesc) {
      setError("Product Description is required");
      return;
    }
    if (!prodDep) {
      setError("Product Department is required");
      return;
    }

    try {
      setLoading(true);
      setMessage("Uploading Image");
      let imageURL: string | undefined = "";
      if (imageObj) {
        imageURL = await uploadImage(imageObj);
      }
      setMessage("Sending Data");

      const newProduct = {
        prodName,
        prodDesc,
        prodDepartment: prodDep,
        prodPic: imageURL,
      };

      const response = await axios.post(route, {
        newProduct,
        idProduct,
      });

      console.log(response);

      if (userData?.role === "admin") {
        setProductData(response.data.product);
      }

      let messageShow =
        userData?.role === "admin"
          ? "Product updated successfully"
          : "Request submitted successfully";
      toast({
        style: { backgroundColor: "#4CAF50", color: "#fff" },
        description: messageShow,
      });

      setImageObj(null);
      setProdName("");
      setProdDesc("");
      setProdDep("");
      setIsPopupOpen(false);
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
    <div className="fixed inset-0 flex items-center justify-center z-[50]">
      <div className="fixed inset-0 flex justify-center items-center bg-[#0000004d] z-[51]">
        <div className="relative bg-white p-6 rounded-lg shadow-lg lg:w-[40%] md:w-[70%] w-[97%] z-[52]">
          <button
            className="absolute text-[red] font-[600] text-[30px] mr-4 top-2 right-2 hover:text-[#ed7979]"
            onClick={() => setIsPopupOpen(false)}
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold mb-4">Update information</h2>
          <div className="flex gap-4 justify-center">
            <div className="">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-bold">
                  Product Name:
                  <RedMark />
                </label>
                <input
                  type="text"
                  value={prodName}
                  placeholder="Enter product name ..."
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="font-bold block text-gray-700 mb-2">
                  Product Department:
                  <RedMark />
                </label>
                <select
                  id="department"
                  name="department"
                  value={prodDep}
                  onChange={(e) => setProdDep(e.target.value)}
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
            {/* image  */}
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="relative flex justify-center items-center gap-3 flex-col">
                <img
                  src={avatarUrl.current}
                  alt="Avatar"
                  className="w-[200px] h-[200px] border-2 border-gray-400"
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
          </div>
          <div className="mb-4">
            <label className="font-bold block text-gray-700 mb-2">
              Product Description:
              <RedMark />
            </label>
            <textarea
              value={prodDesc}
              onChange={(e) => setProdDesc(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows={7}
              required
              placeholder="Share your thoughts ... "
            ></textarea>
          </div>
          <div className=" flex justify-center ">
            {modalOpen && (
              <Modal
                updateAvatar={updateAvatar}
                closeModal={() => setModalOpen(false)}
                imageObj={setImageObj}
              />
            )}
            <div className="flex flex-col justify-center items-center">
              <div className="text-[red] mb-2 font-bold h-[18px]">
                {error && error}
              </div>
              {loading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {message}
                </Button>
              ) : userData?.role === "team-member" ? (
                <Button onClick={() => handleSubmit(`/api/product/update`)}>
                  Submit Changes for Approval
                </Button>
              ) : (
                <Button
                  onClick={() => handleSubmit(`/api/product/update/admin`)}
                >
                  Update Product as Admin
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePopup;
