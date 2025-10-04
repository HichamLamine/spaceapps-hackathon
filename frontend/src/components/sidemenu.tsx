import { Brain, Home, LayoutDashboard } from "lucide-react";
import type { ReactNode } from "react";

export default function Sidemenu() {
  return (
    <div className="bg-[#303030] flex flex-col gap-6 sm:w-[25%] md:w-[25%] lg:w-[15%] p-3 rounded h-[calc(100vh-1.5rem)]">
      <MenuItem title="Accueil" icon={<Home />} />
      <MenuItem title="Dashboard" icon={<LayoutDashboard />} />
      <MenuItem title="Assistant" icon={<Brain />} />
    </div>
  );
}

function MenuItem({ title, icon }: { title: string; icon: ReactNode }) {
  return (
    <div className="flex gap-1">
      {icon}
      <span>{title}</span>
    </div>
  );
}
