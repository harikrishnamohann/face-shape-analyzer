import { type JSX } from "react";

export default function ShowDemoGIF({ demoName }: { demoName: string }): JSX.Element {
  return (
    <div className="demoContainer">
      <img
        className="stylize"
        src={`/src/assets/demos/measure_${demoName}.gif`}
        alt={`measure_${demoName}.gif`}
      />
      <p>Measure {demoName}</p>
    </div>
  );
}
