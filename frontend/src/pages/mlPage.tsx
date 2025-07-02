import { type JSX, useState, useEffect } from "react";
import { NavBar, type NavBarProps } from "./components/navBar";
import ToggleModeButton from "./components/toggleModeButton";
import { useNavigate } from "react-router-dom";
import { UploadImagesErr, UploadImages } from "./components/uploadImages";
import "./stylesheets/mlPage.css";

export default function MlPage(): JSX.Element {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [err, setErr] = useState<UploadImagesErr | null>(null);

  useEffect(() => {
    if (err === UploadImagesErr.ok) navigate("/loading");
  }, [err]);

  const navBarContent: NavBarProps<null>[] = [
    { component: <ToggleModeButton currentPage="ml" to="query" /> },
  ];
  return (
    <section className="stylize mlPage">
      <NavBar items={navBarContent} />
      <div className="content">
        <img src="/src/assets/images/tmp.png" alt="upload a selfie image" />
        <p className={err ? "errText" : undefined}>
          {err ? err : "Upload a clear front facing selfie."}
        </p>
        <UploadImages
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
          err={err}
          setErr={setErr}
        />
      </div>
    </section>
  );
}
