import { type JSX } from "react";
import { NavBar } from "./components/navBar";
import "./stylesheets/loadingPage.css";

type HairStyle = {
  _id: string;
  name: string;
  images: string[];
};
async function fetchHairstyle(imageId: string): Promise<HairStyle | null> {
  const url = `http://localhost:3000/hairstyles/${imageId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
  return null;
}

type ShapeData = {
  _id: string;
  shape: string;
  description: string;
  hairstyles: string[];
};
async function fetchShape(shapeName: string): Promise<ShapeData | null> {
  const url = `http://localhost:3000/stylesheet/${shapeName}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
  return null;
}

type FaceialData = {
  image: File | null;
  isMl: boolean;
  jawline: number;
  height: number;
  cheekbone: number;
  forehead: number;
};

async function analyzeShape(data: FaceialData): Promise<string | null> {
  const url = `http://localhost:3000/${data.isMl ? "processImage" : "processMeasurements"}`;
  const formData = new FormData();

  if (data.isMl) {
    data.image && formData.append("image", data.image);
  }
  formData.append("jawline", String(data.jawline));
  formData.append("height", String(data.height));
  formData.append("cheekbone", String(data.cheekbone));
  formData.append("forehead", String(data.forehead));

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
  return null;
}

export default function LoadingPage(): JSX.Element {
  const data: FaceialData = {
    isMl: false,
    image: null,
    height: 20,
    jawline: 12,
    forehead: 23,
    cheekbone: 8,
  };

  analyzeShape(data)
    .then((result) => {
      console.log(result);
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
