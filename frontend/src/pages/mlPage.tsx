import { useRef, type JSX, type ChangeEvent, useState, useEffect } from "react";
import { NavBar, type NavBarProps } from "./components/navBar";
import ToggleModeButton from "./components/toggleModeButton";
import { useNavigate } from "react-router-dom";
import "./stylesheets/mlPage.css";

const enum FileInputErrMsg {
  noErr = "Upload a clear front facing selfie.",
  noFileSelected = "Please select a selfie",
  invalidFile = "Select only png, jpg, or webp images",
}

export default function MlPage(): JSX.Element {
  const [fileStatus, setFileStatus] = useState<FileInputErrMsg>(FileInputErrMsg.noErr);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const isImageFile = (file: File): boolean => {
    const validMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const fileName = file.name.toLowerCase();
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const hasValidExtension = validExtensions.some((ext) => fileName.endsWith(ext));
    return validMimeTypes.includes(file.type) && hasValidExtension;
  };

  useEffect(() => {
    if (imageFile) {
      if (isImageFile(imageFile)) {
        // todo
        navigate("/loading");
      } else {
        setFileStatus(FileInputErrMsg.invalidFile);
      }
    }
  }, [imageFile]);

  const navBarContent: NavBarProps<null>[] = [
    { component: <ToggleModeButton currentPage="ml" to="query" /> },
  ];
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function clickFileInput(): void {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const selectedImage = event.target.files && event.target.files[0];
    if (selectedImage) {
      setImageFile(selectedImage);
    } else {
      setFileStatus(FileInputErrMsg.noFileSelected);
    }
  }

  return (
    <section className="stylize mlPage">
      <NavBar items={navBarContent} />
      <div className="content">
        <img src="/src/assets/images/tmp.png" alt="upload a selfie image" />
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
          Upload
        </button>
        <p className={fileStatus !== FileInputErrMsg.noErr ? "errText" : undefined}>{fileStatus}</p>
      </div>
    </section>
  );
}
