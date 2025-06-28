import { type JSX } from "react";

export type MenuProps = {
  position: [number, number];
  menuItems: string[];
  handleItemClick: (item: string) => void;
};

export function Menu({ props }: { props: MenuProps }): JSX.Element {
  return (
    <menu
      style={{
        left: `${props.position[0] - 40}px`,
        top: `${props.position[1] + 16}px`,
      }}
      className="stylize"
    >
      {props.menuItems.map((itemName) => (
        <li
          className="menuItem"
          key={itemName}
          onClick={() => props.handleItemClick(itemName)}
        >
          {itemName}
        </li>
      ))}
    </menu>
  );
}
