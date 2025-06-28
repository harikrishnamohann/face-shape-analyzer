import { type NavBarProps, NavBar } from "./components/navBar";
import { Menu } from "./components/menu";
import { type JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./stylesheets/landerPage.css";

export default function LanderPage(): JSX.Element {
  const navigate: ReturnType<typeof useNavigate> = useNavigate();
  const [isMenuShow, setIsMenuShow] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<[number, number]>([0, 0]);
  const menuItems: string[] = [
    "Oval",
    "Round",
    "Square",
    "Heart",
    "Triangle",
    "Diamond",
    "Oblong",
  ];

  const navBarContent: NavBarProps[] = [
    {
      component: (
        <div className="navBarItem" key="catalog">
          Catalog
        </div>
      ),
      stateHooks: {
        isState: isMenuShow,
        setIsState: setIsMenuShow,
      },
    },
    {
      component: (
        <div className="navBarItem" key="about">
          About
        </div>
      ),
    },
  ];

  function handleMenuItemClick(item: string): void {
    navigate(`/shapes/${item.toLowerCase()}`);
  }

  function updateMenu(event: React.MouseEvent<HTMLElement, MouseEvent>): void {
    isMenuShow &&
      (event.target as HTMLElement).className !== "menuItem" &&
      setIsMenuShow(false);
    !isMenuShow && setMenuPosition([event.clientX, event.clientY]);
  }
  return (
    <section
      className="landerPage stylize"
      onClick={(event) => updateMenu(event)}
    >
      {isMenuShow && (
        <Menu
          props={{
            position: menuPosition,
            menuItems: menuItems,
            handleItemClick: handleMenuItemClick,
          }}
        />
      )}
      <NavBar items={navBarContent} />
      <div className="content">
        <div className="logoContainer">
          <h1 className="logo">Style Me &lt;/&gt; </h1>
          <p className="slogan">
            Still confused to choose a hairstyle? Let's find out!
          </p>
          <button className="stylize" onClick={() => navigate("/measurements")}>
            Explore !
          </button>
        </div>
        <div className="illustrationContainer">
          <img
            className="salonIllustration"
            src="/src/assets/images/salon_scene.png"
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
