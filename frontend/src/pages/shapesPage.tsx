import { useEffect, useState, type JSX } from "react";
import { useParams } from "react-router-dom";

const serverAddress = "http://localhost:3000";

export default function ShapesPage(): JSX.Element {
  const { id } = useParams();
  const [shapeData, setShapeData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchShape() {
      try {
        const response = await fetch(`${serverAddress}/shapes/${id}`);
        if (!response.ok) throw new Error("shape not found");
        const data = await response.json();
        console.log(data);
        setShapeData(data);
      } catch (err: any) {
        console.log(err.message);
      }
    }

    fetchShape();
  }, [id]);
  return (
    <section className="stylize shapesPage">
      <h1>{id} shape</h1>
    </section>
  );
}
