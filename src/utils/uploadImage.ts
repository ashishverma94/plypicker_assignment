import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";

export const uploadImage = async (imageUpload:any) => {
    if (!imageUpload) return;
    const imageRef = ref(storage, `ply-images/${imageUpload.name + v4()}`);

    try {
      const uploadTask = await uploadBytes(imageRef, imageUpload);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      return downloadURL ;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };