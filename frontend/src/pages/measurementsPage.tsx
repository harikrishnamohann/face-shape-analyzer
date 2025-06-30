import { useEffect, useState, type JSX } from "react";
import { NavBar, type NavBarProps } from "./components/navBar";
import { useNavigate } from "react-router-dom";
import "./stylesheets/measurementsPage.css";

type computeModeType = "query" | "image";

const enum InputErrMsg {
  NoErr = "none",
  RangeInvalid = "value is not a real facial length.",
  NonNumerical = "Non-numerical input is restricted.",
  EmptyFields = "All values should be given.",
}

let Face = {
  Forehead: 0,
  Cheekbone: 0,
  Jawline: 0,
  Chin: 0,
};

interface QueryInputProps {
  item: string;
  setItem: (item: string) => void;
  setInputErr: (statusMsg: InputErrMsg) => void;
}
function QueryInput(props: QueryInputProps): JSX.Element {
  return (
    <li
      onMouseUp={(event) => {
        const input = event.currentTarget.querySelector("input");
        input && input.focus();
      }}
    >
      <label htmlFor={props.item.toLowerCase()}>{props.item}</label>
      <input
        type="number"
        min={5}
        max={40}
        id={props.item}
        name={props.item}
        placeholder="in cm"
        onInput={(event) => {
          setTimeout(() => {
            const target = event.target as HTMLInputElement;
            if (target.value === "") {
              props.setInputErr(InputErrMsg.NonNumerical);
              target.value = "";
              target.classList.remove("err");
            } else if (
              target.validity.rangeOverflow ||
              target.validity.rangeUnderflow
            ) {
              props.setInputErr(InputErrMsg.RangeInvalid);
              target.classList.add("err");
            } else {
              props.setInputErr(InputErrMsg.NoErr);
              target.classList.remove("err");
            }
          }, 600);
        }}
        onKeyUp={(event) => {
          const target = event.target as HTMLInputElement;
          if (
            !target.classList.contains("err") &&
            target.value !== "" &&
            event.key === "Enter"
          ) {
            const inputs = Array.from(
              target.closest("ul")?.querySelectorAll("input") ?? []
            ) as HTMLInputElement[];
            const idx = inputs.indexOf(target);
            if (idx !== -1 && idx < inputs.length - 1) {
              inputs[idx + 1].focus();
            }
          }
        }}
        onFocus={() => props.setItem(props.item.toLowerCase())}
      />
    </li>
  );
}

interface QueryFormProps {
  queryItems: string[];
  setQueryItem: (item: string) => void;
  inputErr: InputErrMsg;
  setInputErr: (InputErr: InputErrMsg) => void;
}
function QueryForm(props: QueryFormProps): JSX.Element {
  return (
    <div className="queryBox stylize">
      <h3>your facial data</h3>
      <ul>
        {props.queryItems.map((item) => (
          <QueryInput
            key={item.toLowerCase()}
            item={item}
            setItem={props.setQueryItem}
            setInputErr={props.setInputErr}
          />
        ))}
      </ul>
      <p className="errMsg">
        {props.inputErr !== InputErrMsg.NoErr && props.inputErr}
      </p>
    </div>
  );
}

function ShowDemoGIF({ demoName }: { demoName: string }): JSX.Element {
  return (
    <div className="demoContainer">
      <img
        className="stylize"
        src={`/src/assets/demos/${demoName}_demo.gif`}
        alt={`${demoName}_demo.gif`}
      />
      <p>{demoName} demo</p>
    </div>
  );
}

export default function measurementsPage(): JSX.Element {
  const navigate: ReturnType<typeof useNavigate> = useNavigate();
  const [computeMode, setComputeMode] = useState<computeModeType>("query");
  const [inputErr, setInputErr] = useState<InputErrMsg>(InputErrMsg.NoErr);

  useEffect(() => {
    if (computeMode === "image") navigate("/ml");
  }, [computeMode]);

  const navBarContent: NavBarProps[] = [
    {
      component: <div className="navBarItem">Mode( {computeMode} )</div>,
      stateHooks: {
        isState: computeMode === "query",
        setIsState: (value: boolean) => {
          setComputeMode(value ? "query" : "image");
        },
      },
    },
  ];

  const faceParts = ["Forehead", "Cheekbone", "Jawline", "Chin"];
  const [currentQueryItem, setCurrentQueryItem] = useState<string>("none");

  return (
    <section
      className="stylize measurementsPage"
      onClick={(event) => {
        const target = event.target as HTMLElement;
        target.parentElement?.tagName !== "LI" && setCurrentQueryItem("none");
      }}
    >
      <NavBar items={navBarContent} />
      <div className="content">
        <h1 className="title">Let's measure your face</h1>
        <p>
          <b>How to measure?</b>
          <br />
          <b>1.</b> Grab a piece of string and a ruler or a measuring tape
          <br />
          <b>2.</b> Click on corresponding input fields to know how to measure
          each part of your face.
          <br />
          <b>3.</b> Enter the values you got in <i>cm</i>.
        </p>
        <div className="querySection">
          <QueryForm
            queryItems={faceParts}
            setQueryItem={setCurrentQueryItem}
            inputErr={inputErr}
            setInputErr={setInputErr}
          />
          {currentQueryItem !== "none" && (
            <ShowDemoGIF demoName={currentQueryItem} />
          )}
        </div>
      </div>
      <button
        className="stylize"
        onClick={() => {
          let isEmptyFieldsPresent: boolean = false;
          faceParts.map((part) => {
            const target = document.getElementById(part) as HTMLInputElement;
            Face[part as keyof typeof Face] = Number(target.value);
            if (Face[part as keyof typeof Face] === 0) {
              isEmptyFieldsPresent = true;
              document.getElementById(part)?.classList.add("err");
            }
          });
          if (!isEmptyFieldsPresent) {
            // make request to server
            navigate("/loading");
          }
        }}
      >
        Go!
      </button>
    </section>
  );
}
