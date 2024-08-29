"use client";

import { storage } from "@/utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { v4 } from "uuid";

const page = () => {
  const [imageUpload, setImageUpload] = useState<any>(null);
  console.log(imageUpload)
  const uploadImage = async () => {
    if (!imageUpload) return;
    const imageRef = ref(storage, `ply-images/${imageUpload.name + v4()}`);

    try {
      const uploadTask = await uploadBytes(imageRef, imageUpload);
      alert("Image uploaded");
      const downloadURL = await getDownloadURL(uploadTask.ref);
      console.log(downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e: any) => setImageUpload(e.target.files[0])}
      />

      <button onClick={() => uploadImage()}>Upload Image</button>
    </div>
  );
};

export default page;
