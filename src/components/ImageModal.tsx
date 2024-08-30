import ImageCropper from "../components/ImageCropper";

const Modal = ({ updateAvatar, closeModal, imageObj }: any) => {
  console.log(updateAvatar, closeModal, imageObj);
  return (
    <div
      className="relative z-10"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center px-2 py-12 text-center ">
          <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-gray-800 text-slate-100 text-left shadow-xl transition-all">
            <div className="px-5 py-4">
              <button
                type="button"
                className="rounded-md p-1 inline-flex items-center w-[30px] h-[30px] font-[700] text-center text-[25px] justify-center text-gray-400 hover:bg-gray-700 focus:outline-none absolute top-2 right-2"
                onClick={closeModal}
              >
                &times;
              </button>
              <ImageCropper
                updateAvatar={updateAvatar}
                closeModal={closeModal}
                imageObj={imageObj}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
