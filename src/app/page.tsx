"use client";

import { useRef, useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, { Crop } from "react-image-crop";

export default function Home() {
  const [imgSrc, setImgSrc] = useState();
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState<any>(null);

  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const [croppedImageUrl, setCroppedImageUrl] = useState('');


  const handleFileSelect = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImgSrc((reader as any)?.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCompleteCrop = (crop: any) => {
    drawImageOnCanvas(imgRef.current, canvasRef.current, crop);
    setCompletedCrop(crop);
  };

  function generateDownload(canvas: any, crop: any) {
    console.log("hi");

    console.log(crop, canvas);
    if (!crop || !canvas) {
      return;
    }

    canvas.toBlob(async (blob:any) => {
      if (blob) {
        const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        console.log(file) ;
        // Upload to Firebase Storage
        // const storageRef = storage.ref(`images/${file.name}`);
        // await storageRef.put(file);

        // const downloadURL = await storageRef.getDownloadURL();
        // console.log('File available at', downloadURL);
        // setCroppedImageUrl(downloadURL);
      }
    }, 'image/jpeg');


  }

  const handleDownload = () => {
    generateDownload(canvasRef.current, completedCrop);
  };

  const canvasStyles = {
    width: Math.round((completedCrop as any)?.width ?? 0),
    height: Math.round((completedCrop as any)?.height ?? 0),
  };
  const [croppedImage, setCroppedImage] = useState(null);

  function drawImageOnCanvas(image: any, canvas: any, crop: any) {
    if (!crop || !canvas || !image) {
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    const dataUrl = canvas.toDataURL('image/jpeg');
    setCroppedImage(dataUrl);
  }

  return (
    <div className="App">
      <div className="FileSelector">
        <input
          id="file"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          placeholder="Choose file"
        />
      </div>

      <div className="CropperWrapper w-[400px] flex justify-center items-center gap-3 flex-col h-[400px] border-[2px] border-black p-8">
        <ReactCrop
          className="w-[300px] h-[300px]"
          crop={crop}
          // @ts-ignore
          onChange={setCrop}
          aspect={1}
          // onComplete={handleCompleteCrop}
        >
          <div className="flex justify-center items-center">
            {imgSrc && (
              <img
                className="h-max-[300px] bg-cover"
                ref={imgRef}
                src={imgSrc}
                alt="cropper image"
              />
            )}
          </div>
        </ReactCrop>
        {!imgSrc && <p className="InfoText">Choose file to crop</p>}
        {/* <div className="CanvasWrapper">
          <canvas ref={canvasRef} style={canvasStyles} />
        </div> */}
      </div>

      <div>
        <button
          type="button"
          disabled={!completedCrop}
          onClick={handleDownload}
        >
          Download cropped image
        </button>
      </div>

      {!!completedCrop && (
        <>
          <div>
            <canvas
              ref={canvasRef}
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                width: completedCrop.width,
                height: completedCrop.height,
              }}
            />
          </div>
          <div>
            <button onClick={handleDownload}>Download Crop</button>
            
            <a
              href="#hidden"
              // download
              style={{
                position: 'absolute',
                top: '-200vh',
                visibility: 'hidden',
              }}
            >
              Hidden download
            </a>
          </div>
        </>
      )}
    </div>
  );
}
