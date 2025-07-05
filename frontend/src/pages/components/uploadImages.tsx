import { type JSX, useRef, type ChangeEvent } from "react";

export const enum UploadImagesErr {
  ok = "ok",
  noFilesSelected = "Please select a selfie",
  invalidFiles = "Select only png, jpg, or webp images",
}

type UploadImagesProps = {
  imageFiles: FileList | null;
  setImageFiles: (imageFiles: FileList | null) => void;
  err: UploadImagesErr | null;
  setErr: (errMsg: UploadImagesErr | null) => void;
  placeholder: string;
};

export function UploadImages(props: UploadImagesProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function clickFileInput(): void {
    fileInputRef.current?.click();
  }

  function areImageFiles(images: FileList): boolean {
    const validMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];

    for (let image of images) {
      if (
        !validExtensions.some((ext) => image.name.toLowerCase().endsWith(ext)) ||
        !validMimeTypes.includes(image.type)
      ) {
        return false;
      }
    }
    return true;
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const selectedImages = event.target.files;
    if (selectedImages) {
      if (areImageFiles(selectedImages)) {
        props.setErr(UploadImagesErr.ok);
        props.setImageFiles(selectedImages);
      } else {
        props.setErr(UploadImagesErr.invalidFiles);
      }
    } else {
      props.setErr(UploadImagesErr.noFilesSelected);
    }
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(event) => handleFileChange(event)}
        style={{ display: "none" }}
        multiple={false}
        accept=".png,.jpg,.jpeg,.webp"
      />
      <button
        onClick={() => {
          clickFileInput();
        }}
        className="stylize"
      >
        {props.placeholder}
      </button>
    </>
  );
}
