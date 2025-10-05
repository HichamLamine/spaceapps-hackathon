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
        <Globe
          backgroundColor="rgba(0,0,0,0)"
          ref={globeRef}
          globeImageUrl="world-light-high-quality.png"
        />
      </div>
    </div>
  );
}
