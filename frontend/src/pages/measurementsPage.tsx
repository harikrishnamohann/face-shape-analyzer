import { useEffect, useState, type JSX } from "react";
import { NavBar, type NavBarProps } from "./components/navBar";
import { useNavigate } from "react-router-dom";
import "./stylesheets/measurementsPage.css";

type computeModeType = "query" | "image";

export default function measurementsPage(): JSX.Element {
  const [computeMode, setComputeMode] = useState<computeModeType>("query");
  const navigate: ReturnType<typeof useNavigate> = useNavigate();
  useEffect(() => {
    if (computeMode === "image") navigate("/ml");
  }, [computeMode]);
  const navBarContent: NavBarProps[] = [
    {
      component: (
        <div className="navBarItem" key="compute">
          Mode( {computeMode} )
        </div>
      ),
      stateHooks: {
        isState: computeMode === "query",
        setIsState: (value: boolean) => {
          setComputeMode(value ? "query" : "image");
        },
      },
    },
  ];

  const queryItems = ["Forehead", "Cheekbone", "Jawline", "Chin"];
  function QueryInputElement({ item }: { item: string }): JSX.Element {
    return (
      <li key={item.toLowerCase()}>
        <label htmlFor={item.toLowerCase()}>{item} </label>
        <input
          onInput={(event) => {
            const target = event.target as HTMLInputElement;
            console.log(`Input for ${item}:`, target.value);
          }}
          type="number"
          id={item}
          name={item}
          placeholder="in cm"
        />
      </li>
    );
  }

  function QueryForm(): JSX.Element {
    return (
      <div className="queryBox stylize">
        <h3>your facial data</h3>
        <ul>
          {queryItems.map((item) => (
            <QueryInputElement item={item} />
          ))}
        </ul>
        <p className="errMsg">input error: only numerical values are allowed</p>
      </div>
    );
  }

  function ShowDemo({ demoName }: { demoName: string }): JSX.Element {
    return (
      <div className="demoContainer">
        <img
          className="stylize"
          src={`/src/assets/demos/${demoName}_demo.gif`}
          alt="forehead_demo.gif"
        />
        <p>{demoName} demo</p>
      </div>
    );
  }

  return (
    <section className="stylize measurementsPage">
      <NavBar items={navBarContent} />
      <div className="content">
        <h1 className="title">Let's to measure your face</h1>
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
          <QueryForm />
          <ShowDemo demoName="forehead" />
        </div>
      </div>
      <button className="stylize">Go!</button>
    </section>
  );
}
