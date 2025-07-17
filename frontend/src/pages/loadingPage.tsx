import { useEffect, useState, type JSX } from "react";
import { NavBar } from "./components/navBar";
import { ServerApi, type AnalyzeShapeProps } from "./components/serverActions";
import { useNavigate, useLocation } from "react-router-dom";
import "./stylesheets/loadingPage.css";

const server = new ServerApi("http://localhost:3000");

export default function LoadingPage(): JSX.Element {
  // obtaining data from state parameter specified in navigate() call.
  const data: AnalyzeShapeProps = useLocation().state;

  const navigate = useNavigate();
  const [shape, setShape] = useState<string | null>(null);
  useEffect(() => {
    if (shape) {
      setTimeout(() => {
        navigate(`/shapes/${shape}`, { replace: true });
      }, 2000);
    }
  }, [shape]);

  server
    .analyzeShape(data)
    .then((result: string | null) => {
      setShape(result);
    })
    .catch((err: unknown) => {
      if (err instanceof Error) console.log(err.message);
    });

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
