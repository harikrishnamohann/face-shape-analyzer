import { type JSX } from "react";
import { type ComputeModeType } from "../measurementsPage";
import "../stylesheets/toggleModeButton.css";
import { useNavigate } from "react-router-dom";

type ToggleModeButtonProps = {
  currentPage: ComputeModeType;
  to: ComputeModeType;
};

export default function ToggleModeButton(props: ToggleModeButtonProps): JSX.Element {
  const navigate = useNavigate();
  return (
    <div
      className="toggleButtonWrapper"
      onClick={() => navigate(`/${props.to}`, { replace: true })}
    >
      <img
        className={props.currentPage === "query" ? "modeEnabled" : undefined}
        src="/src/assets/icons/scissors.png"
        alt="scissors"
      />
      <img
        className={props.currentPage === "ml" ? "modeEnabled" : undefined}
        src="/src/assets/icons/trimmer.png"
        alt="trimmer"
      />
    </div>
  );
}
