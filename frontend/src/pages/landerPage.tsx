import { NavBar, type NavBarProps } from "./navBar";
import { type JSX, useEffect, useState } from "react";

function CatalogMenu(): JSX.Element {
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
    <menu className="catalogMenu">
      {items.map((itemName) => (
        <div key={itemName} onClick={() => setItem(`${itemName}`)}>
          {itemName}
        </div>
      ))}
    </menu>
  );
}

export default function LanderPage(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log(`Menu is now ${isMenuOpen ? "open" : "closed"}`);
  }, [isMenuOpen]);

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
        component: <a key="catalog">Catalog</a>,
        stateHooks: {
          isState: isMenuOpen,
          setIsState: setIsMenuOpen,
        },
      },
      {
        component: (
          <a key="about" href="#">
            About
          </a>
        ),
        stateHooks: {
          isState: isMenuOpen,
          setIsState: setIsMenuOpen,
        },
      },
    ],
  };
  return (
    <section className="landerPage stylize">
      <NavBar
        leftBox={navBar.leftBox}
        middleBox={navBar.middleBox}
        rightBox={navBar.rightBox}
      />
      {isMenuOpen && <CatalogMenu />}
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
