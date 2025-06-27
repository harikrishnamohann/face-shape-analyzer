import { NavBar, type NavBarProps } from "./navBar";
import { type JSX, useEffect, useState } from "react";

function CatalogMenu({
  pos = [0, 0],
}: {
  pos?: [number, number];
}): JSX.Element {
  const [item, setItem] = useState<string>("/#");
  const items: string[] = [
    "Heart",
    "Oval",
    "Square",
    "Round",
    "Triangle",
    "Diamond",
    "Oblong",
  ];

  useEffect(() => {
    if (item !== "/#") {
      console.log(`Selected item: ${item}`); // for later
    }
  }, [item]);
  return (
    <menu
      style={{ left: `${pos[0] - 40}px`, top: `${pos[1] + 16}px` }}
      className="catalogMenu stylize"
    >
      {items.map((itemName) => (
        <li
          className="menuItem"
          key={itemName}
          onClick={() => setItem(`${itemName}`)}
        >
          {itemName}
        </li>
      ))}
    </menu>
  );
}

export default function LanderPage(): JSX.Element {
  const [isCatalogMenuOpen, setIsCatalogMenuOpen] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<[number, number]>([0, 0]);

  const navBar: NavBarProps = {
    leftBox: [
      {
        component: (
          <p key="logo" className="topLogo">
            Style Me
          </p>
        ),
      },
    ],
    rightBox: [
      {
        component: (
          <a key="catalog" href="#">
            Catalog
          </a>
        ),
        stateHooks: {
          isState: isCatalogMenuOpen,
          setIsState: setIsCatalogMenuOpen,
        },
      },
      {
        component: (
          <a key="about" href="#">
            About
          </a>
        ),
      },
    ],
  };

  return (
    <section
      className="landerPage stylize"
      onClick={(event) => {
        isCatalogMenuOpen &&
          (event.target as HTMLElement).className !== "menuItem" &&
          setIsCatalogMenuOpen(false);
        !isCatalogMenuOpen && setMenuPosition([event.clientX, event.clientY]);
      }}
    >
      <NavBar
        leftBox={navBar.leftBox}
        middleBox={navBar.middleBox}
        rightBox={navBar.rightBox}
      />
      {isCatalogMenuOpen && <CatalogMenu pos={menuPosition} />}
      <div className="content">
        <div className="logoContainer">
          <h1 className="logo">Style Me &lt;/&gt; </h1>
          <p className="slogan">
            Still confused to choose a hairstyle? Let's find out!
          </p>
          <button className="stylize">Explore !</button>
        </div>
        <div className="illustrationContainer">
          <img
            className="salonIllustration"
            src="src/assets/images/salon_scene.png"
          />
          <div className="conversationBubble stylize">
            <p>⏵ Salon :: What hair cut do you want?</p>
            <p>⏵ Me :: Huh?... well... ?!?!?!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
