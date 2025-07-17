import { useState, type JSX } from "react";
import { NavBar, type NavBarProps } from "./components/navBar";
import { useNavigate } from "react-router-dom";
import { QueryForm, InputErrMsg } from "./components/queryForm";
import ShowDemoGIF from "./components/showDemoGIF";
import ToggleModeButton from "./components/toggleModeButton";
import { type AnalyzeShapeProps } from "./components/serverActions";
import "./stylesheets/measurementsPage.css";

export type ComputeModeType = "query" | "ml";

const faceParts = ["Forehead", "Cheekbone", "Jawline", "Height"];
const faceStructure: { [part: string]: number } = {};
faceParts.map((part) => (faceStructure[part] = 0));
// faceStructure can be accessed as faceStructure["oval"]

function HowToMeasure(): JSX.Element {
  return (
    <p>
      <u>
        <b>How to measure?</b>
      </u>
      <br />
      1. Grab a piece of string and a ruler or a measuring tape <br />
      2. Click input fields to see how to measure each part of your face. <br />
      3. Fill the form using the values you've got in{" "}
      <b>
        <u>centimeters</u>
      </b>
      .
    </p>
  );
}

// navbar contains a toggle button component to switch between compute modes.
const navBarContent: NavBarProps<null>[] = [
  { component: <ToggleModeButton currentPage="query" to="ml" /> },
];

export default function measurementsPage(): JSX.Element {
  const navigate = useNavigate(); // for go button
  const [inputErr, setInputErr] = useState<InputErrMsg>(InputErrMsg.NoErr);
  const [currentInputField, setCurrentInputField] = useState("none");

  let facialData: AnalyzeShapeProps = {};

  function updateFacialData({ key, val }: { key: string; val: number }) {
    if (key === "forehead") facialData.forehead = val;
    else if (key === "height") facialData.height = val;
    else if (key === "cheekbone") facialData.cheekbone = val;
    else if (key === "jawline") facialData.jawline = val;
  }

  function handleGoButton(): void {
    let isEmptyFieldsPresent: boolean = false;
    let isValuesInRange = true;
    faceParts.map((part) => {
      const target = document.getElementById(part) as HTMLInputElement;
      faceStructure[part] = Number(target.value);
      if (faceStructure[part] === 0) {
        isEmptyFieldsPresent = true;
        document.getElementById(part)?.classList.add("err");
      }
      if (faceStructure[part] < 5 || faceStructure[part] > 40) isValuesInRange = false;
    });
    if (isEmptyFieldsPresent) {
      setInputErr(InputErrMsg.EmptyFields);
      return;
    }
    if (isValuesInRange) {
      faceParts.map((part) =>
        updateFacialData({ key: part.toLowerCase().trim(), val: faceStructure[part] })
      );
      navigate("/loading", { state: facialData });
    } else {
      setInputErr(InputErrMsg.RangeInvalid);
    }
  }

  return (
    <section
      className="stylize measurementsPage"
      onClick={(event) => {
        const target = event.target as HTMLElement;
        !target.parentElement?.classList.contains("queryInputField") &&
          setCurrentInputField("none");
      }}
    >
      <NavBar items={navBarContent} />
      <div className="content">
        <h1 className="title">Let's measure your face</h1>
        <HowToMeasure />
        <div className="querySection">
          <QueryForm
            queryItems={faceParts}
            setQueryItem={setCurrentInputField}
            inputErr={inputErr}
            setInputErr={setInputErr}
          />
          {currentInputField !== "none" && <ShowDemoGIF demoName={currentInputField} />}
        </div>
      </div>
      <button className="stylize" onClick={() => handleGoButton()}>
        Go!
      </button>
    </section>
  );
}
