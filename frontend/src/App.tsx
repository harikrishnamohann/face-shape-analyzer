import { HashRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { type JSX, useState, useEffect } from "react";
import LanderPage from "./pages/landerPage";
import MeasurementsPage, { type ComputeModeType } from "./pages/measurementsPage";
import MlPage from "./pages/mlPage";
import ShapesPage from "./pages/shapesPage";
import LoadingPage from "./pages/loadingPage";
import "./App.css";

function AppRoutes(): JSX.Element {
  const [computeMode, setComputeMode] = useState<ComputeModeType>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (computeMode) {
      navigate(computeMode);
      setComputeMode(null);
    }
  }, [computeMode]);
  return (
    <Routes>
      <Route path="/" element={<LanderPage />} />
      <Route
        path="/query"
        element={<MeasurementsPage computeMode={computeMode} setComputeMode={setComputeMode} />}
      />
      <Route path="/ml" element={<MlPage />} />
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/shapes/:id" element={<ShapesPage />} />
    </Routes>
  );
}

export default function App(): JSX.Element {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
