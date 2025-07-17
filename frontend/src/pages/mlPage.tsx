import { type JSX, useState, useEffect } from "react";
import { NavBar, type NavBarProps } from "./components/navBar";
import ToggleModeButton from "./components/toggleModeButton";
import { useNavigate } from "react-router-dom";
import { UploadImagesErr, UploadImages } from "./components/uploadImages";
import { type AnalyzeShapeProps } from "./components/serverActions";
import "./stylesheets/mlPage.css";

export default function MlPage(): JSX.Element {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [err, setErr] = useState<UploadImagesErr | null>(null);

  let facialData: AnalyzeShapeProps = {};

  useEffect(() => {
    if (err === UploadImagesErr.ok) {
      facialData.imageFile = imageFiles && imageFiles[0];
      navigate("/loading", { state: facialData });
    }
  }, [err]);

  const navBarContent: NavBarProps<null>[] = [
    { component: <ToggleModeButton currentPage="ml" to="query" /> },
  ];
  return (
    <section className="stylize mlPage">
      <NavBar items={navBarContent} />
      <div className="content">
        <img src="/src/assets/images/tmp.png" alt="upload a selfie image" />
        <UploadImages
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
          err={err}
          setErr={setErr}
          placeholder="Upload"
        />
        <p className={err ? "errText" : undefined}>
          {err || "Upload a clear front facing selfie."}
        </p>
      </div>
    </section>
  );
}
