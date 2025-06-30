import { type JSX } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/navbar.css";

export interface NavBarProps<T> {
  component: JSX.Element;
  stateHooks?: {
    nextState: T;
    setNextState: (state: T) => void;
  };
}

export function NavBar({ items }: { items: NavBarProps<any>[] }): JSX.Element {
  const navigate: ReturnType<typeof useNavigate> = useNavigate();
  return (
    <nav className="navBar">
      <div className="navBox">
        <p onClick={() => navigate("/#")} key="logo" className="topLogo">
          Style Me
        </p>
      </div>
      <div className="navBox">
        {items.map((component, i) => (
          <div
            key={`component${i}`}
            onClick={() => component.stateHooks?.setNextState(component.stateHooks.nextState)}
          >
            {component.component}
          </div>
        ))}
      </div>
    </nav>
  );
}
