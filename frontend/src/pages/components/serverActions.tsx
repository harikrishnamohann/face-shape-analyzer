export type HairstylesItem = {
  _id: string;
  name: string;
  images: string[];
};

export type StyleSheetItem = {
  _id: string;
  shape: string;
  description: string;
  hairstyles: string[];
};

export type FacialDataProps = {
  imageFile?: File | null;
  jawline?: number;
  height?: number;
  cheekbone?: number;
  forehead?: number;
};

export class ServerApi {
  private server: string;

  constructor(host: string) {
    this.server = host;
  }
  async fetchHairstyle(imageId: string): Promise<HairstylesItem | null> {
    const url = `${this.server}/hairstyles/${imageId}`;
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
  async fetchShape(shapeName: string): Promise<StyleSheetItem | null> {
    const url = `${this.server}/stylesheet/${shapeName}`;
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
  async analyzeShape(data: FacialDataProps): Promise<string | null> {
    const url = `${this.server}/${data.imageFile ? "processImage" : "processMeasurements"}`;
    const formData = new FormData();

    if (data.imageFile) {
      data.imageFile && formData.append("image", data.imageFile);
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
}
