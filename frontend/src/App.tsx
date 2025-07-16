import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { type JSX } from "react";
import LanderPage from "./pages/landerPage";
import MeasurementsPage from "./pages/measurementsPage";
import MlPage from "./pages/mlPage";
import ShapesPage from "./pages/shapesPage";
import LoadingPage from "./pages/loadingPage";
import "./App.css";

export default function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LanderPage />} />
        <Route path="/query" element={<MeasurementsPage />} />
        <Route path="/ml" element={<MlPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/shapes/:shape" element={<ShapesPage />} />
      </Routes>
    </Router>
  );
}
