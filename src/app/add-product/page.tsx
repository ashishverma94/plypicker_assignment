"use client";

import Modal from "@/components/ImageModal";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/utils/firebase";

const page = () => {
  const [prodName, setProdName] = useState<string>("");
  const [prodDesc, setProdDesc] = useState<string>("");
  const [prodDepartment, setProdDepartment] = useState<string>("");
  const [imageObj, setImageObj] = useState<any>(null);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const avatarUrl = useRef(
    "https://avatarfiles.alphacoders.com/161/161002.jpg"
  );

  const updateAvatar = (imgSrc: any) => {
    avatarUrl.current = imgSrc;
  };

  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async () => {
    if (!imageObj) {
      alert("No file selected");
      return;
    }

    const userId = "USER_ID"; // Replace with the actual user ID
    const oldProfilePicPath = `profile_pics/${userId}/old_profile_pic.jpg`;
    const newProfilePicPath = `profile_pics/${userId}/new_profile_pic.jpg`;

    try {
      const oldPicRef = ref(storage, oldProfilePicPath);
      await deleteObject(oldPicRef);
      const newPicRef = ref(storage, newProfilePicPath);
      await uploadBytes(newPicRef, imageObj);
      alert("Profile picture updated successfully");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Failed to update profile picture");
    }
  };

  const handleSubmit = async () => {
    console.log(prodName, prodDesc, prodDepartment);
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
                type="email"
                name="email"
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                className=" h-[40px] px-2 mt-1 block w-full border border-[black] rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Select product department
                <span className="mx-1 text-[red] text-[20px] font-bold">*</span>
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={prodDepartment}
                onChange={(e) => setProdDepartment(e.target.value)}
                className="h-[40px] px-2 mt-1 mb-2 block w-full border border-[black] rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
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
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default page;
