import { useEffect, useState, type JSX } from "react";
import { NavBar, type NavBarProps } from "./components/navBar";
import { useNavigate } from "react-router-dom";

type computeModeType = "calc" | "ml";

export default function measurementsPage(): JSX.Element {
  const [computeMode, setComputeMode] = useState<computeModeType>("calc");
  const navigate: ReturnType<typeof useNavigate> = useNavigate();
  useEffect(() => {
    if (computeMode === "ml") navigate("/ml");
  }, [computeMode]);
  const navBarContent: NavBarProps[] = [
    {
      component: (
        <div className="navBarItem" key="compute">
          Mode( {computeMode} )
        </div>
      ),
      stateHooks: {
        isState: computeMode === "calc",
        setIsState: (value: boolean) => {
          setComputeMode(value ? "calc" : "ml");
        },
      },
    },
  ];
  return (
    <section className="stylize">
      <NavBar items={navBarContent} />
      <div className="content">
        <h1>Ready to measure your face?</h1>
        <p>
          Grab a piece of string and a ruler (or measuring tape) to measure
          these face dimensions in centimeters, then fill in your results below.
          Take your time for accuracy - measuring twice is always a smart idea!
        </p>
        <div className="querySection stylize">
          <div className="queryBox">
            <h4>
              <u>your facial lengths</u>
            </h4>
            <div className="query">
              <label htmlFor="forehead">Forehead </label>
              <input
                type="number"
                id="forehead"
                name="forehead"
                placeholder="in cm"
              />
            </div>
            <div className="query">
              <label htmlFor="cheekbone">Cheekbone </label>
              <input
                type="number"
                id="cheekbone"
                name="cheekbone"
                placeholder="in cm"
              />
            </div>
            <div className="query">
              <label htmlFor="jawline">Jawline </label>
              <input
                type="number"
                id="jawline"
                name="jawline"
                placeholder="in cm"
              />
            </div>
            <div className="query">
              <label htmlFor="chin">Chin </label>
              <input type="number" id="chin" name="chin" placeholder="in cm" />
            </div>
          </div>
          <div className="demoContainer">
            <img
              src="/src/assets/demos/forehead_demo.gif"
              alt="forehead_demo.gif"
            />
          </div>
        </div>
        <button>Go!</button>
      </div>
    </section>
  );
}
