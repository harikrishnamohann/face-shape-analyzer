import { type JSX } from "react";
import { useNavigate } from "react-router-dom";

export type NavBarProps = {
  component: JSX.Element;
  stateHooks?: {
    isState: boolean;
    setIsState: (value: boolean) => void;
  };
};

export function NavBar({ items }: { items: NavBarProps[] }): JSX.Element {
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
            onClick={() =>
              component.stateHooks?.setIsState(!component.stateHooks.isState)
            }
          >
            {component.component}
          </div>
        ))}
      </div>
    </nav>
  );
}
