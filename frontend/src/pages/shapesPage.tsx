import { useEffect, useState, type JSX } from "react";
import { useParams } from "react-router-dom";
import { ServerApi } from "./components/serverActions";
import { type StyleSheetItem } from "./components/serverActions";

const server = new ServerApi("http://localhost:3000");

export default function ShapesPage(): JSX.Element {
  const { shape } = useParams();
  const [shapeData, setShapeData] = useState<StyleSheetItem | null>(null);

  useEffect(() => {
    if (!shape) return;

    const fetchShape = async () => {
      const data = await server.fetchShape(shape);
      setShapeData(data);
      console.log(data);
    };

    fetchShape();
  }, [shape]);

  return (
    <section className="stylize shapesPage">
      <h1>{shapeData?.shape}</h1>
      {shapeData && JSON.stringify(shapeData, null, 2)}
    </section>
  );
}
