import { type JSX } from "react";
import { NavBar, type NavBarProps } from "./components/navBar";
import ToggleModeButton from "./components/toggleModeButton";
import "./stylesheets/mlPage.css";
import { useNavigate } from "react-router-dom";

export default function MlPage(): JSX.Element {
  const navBarContent: NavBarProps<null>[] = [
    { component: <ToggleModeButton currentPage="ml" to="query" /> },
  ];
  const navigate = useNavigate();
  return (
    <section className="stylize mlPage">
      <NavBar items={navBarContent} />
      <div className="content">
        <img src="/src/assets/images/tmp.png" alt="upload a selfie image" />
        <button
          onClick={() => {
            // todo
            navigate("/loading");
          }}
          className="stylize"
        >
          Upload
        </button>
        <p>Upload a clear front facing selfie.</p>
      </div>
    </section>
  );
}
