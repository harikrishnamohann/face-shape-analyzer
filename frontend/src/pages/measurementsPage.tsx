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

  return (
    <section className="stylize measurementsPage">
      <NavBar items={navBarContent} />
      <div className="content">
        <h1 className="title">Let's to measure your face</h1>
        <p>
          Grab a piece of string and a ruler (or measuring tape) to measure
          these face dimensions in centimeters, then fill in your results below.
          Take your time for accuracy - measuring twice is always a smart idea!
        </p>
        <div className="querySection">
          <div className="queryBox stylize">
            <h3>your facial data</h3>
            <ul>
              {queryItems.map((item) => (
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
              ))}
            </ul>
            <p className="errMsg">
              input error: only numerical values are allowed
            </p>
          </div>
          <div className="demoContainer">
            <img
              className="stylize"
              src="/src/assets/demos/forehead_demo.gif"
              alt="forehead_demo.gif"
            />
            <p>Forehead demo</p>
          </div>
        </div>
      </div>
      <button className="stylize">Go!</button>
    </section>
  );
}
