import TSX from "react";
import { useState, useEffect, type JSX } from "react";
import "./App.css";

function NavBar(): JSX.Element {
  return (
    <nav>
      <div className="leftBox">
        <div>Style Me</div>
      </div>
      <div className="middleBox"></div>
      <div className="rightBox">
        <div>
          <a href="#"></a>
        </div>
      </div>
    </nav>
  );
}

function LanderPage(): JSX.Element {
  return (
    <section className="landerPage stylize">
      <div className="illustrationContainer">
        <img
          className="salonIllustration"
          src="src/assets/images/salon_scene.png"
        />
        <div className="conversationBubble">What hair style do you want?</div>
        <div className="confused">?!</div>
      </div>
      <h1 className="Logo">Style Me &lt;/&gt; </h1>
      <p className="slogan">
        Discover the perfect hairstyle for your face shape
      </p>
      <button className="stylize">Explore</button>
    </section>
  );
}

export default function App() {
  return <LanderPage />;
}
