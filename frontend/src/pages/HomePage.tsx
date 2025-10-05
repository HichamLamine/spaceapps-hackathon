import Sidemenu from "@/components/sidemenu";
import { useEffect, useRef } from "react";
import Globe from "react-globe.gl";

export default function HomePage() {
  const globeRef = useRef<any>(null);
  useEffect(() => {
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
  }, []);

  return (
    <div
      className="flex h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/space-background.jpg')" }}
    >
      <Sidemenu />
      <div className="flex-1">
        <div className="text-center mt-10">
          <h2 className="text-4xl md:text-5xl font-bold">
            Turning <span className="text-[#0087FD]">EarthData</span> into{" "}
            <span className="italic text-[#0087FD]">EarthCare</span>
          </h2>
          <div className="mt-2 w-16 h-1 bg-[#0087FD] mx-auto rounded-full"></div>
        </div>
        <Globe
          backgroundColor="rgba(0,0,0,0)"
          ref={globeRef}
          globeImageUrl="world-light-high-quality.png"
        />
      </div>
    </div>
  );
}
