import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LanderPage from "./pages/landerPage";
import MeasurementsPage from "./pages/measurementsPage";
import MlPage from "./pages/mlPage";
import ShapesPage from "./pages/shapesPage";
import LoadingPage from "./pages/loadingPage";

import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LanderPage />} />
        <Route path="/measurements" element={<MeasurementsPage />} />
        <Route path="/ml" element={<MlPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/shapes/:id" element={<ShapesPage />} />
      </Routes>
    </Router>
  );
}
