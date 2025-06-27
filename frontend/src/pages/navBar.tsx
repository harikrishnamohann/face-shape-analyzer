import { type JSX } from "react";

export type ComponentWithHook = {
  component: JSX.Element;
  stateHooks?: {
    isState: boolean;
    setIsState: (value: boolean) => void;
  };
};

export interface NavBarProps {
  leftBox?: ComponentWithHook[];
  middleBox?: ComponentWithHook[];
  rightBox?: ComponentWithHook[];
}

export function NavBar({
  leftBox,
  middleBox,
  rightBox,
}: NavBarProps): JSX.Element {
  return (
    <nav className="navBar">
      <div className="navBox">
        {leftBox &&
          leftBox.length > 0 &&
          leftBox.map((component, i) => (
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
      <div className="navBox">
        {middleBox &&
          middleBox.length > 0 &&
          middleBox.map((component, i) => (
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
      <div className="navBox">
        {rightBox &&
          rightBox.length > 0 &&
          rightBox.map((component, i) => (
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
