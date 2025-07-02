import { type JSX } from "react";
import { NavBar } from "./components/navBar";
import "./stylesheets/loadingPage.css";

export default function LoadingPage(): JSX.Element {
  return (
    <section className="loadingPage stylize">
      <NavBar />
      <div className="content">
        <img src="/src/assets/images/loading.gif" alt="loading..." />
        <p>Analyzing shape</p>
      </div>
    </section>
  );
}
