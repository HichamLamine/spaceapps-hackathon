import { Brain, Home, LayoutDashboard } from "lucide-react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidemenu() {
  return (
    <div className="bg-[#303030] flex flex-col gap-6 sm:w-[25%] md:w-[25%] lg:w-[15%] p-3 rounded h-[calc(100vh-1.5rem)]">
      <MenuItem title="Accueil" icon={<Home />} route="/" />
      <MenuItem
        title="Dashboard"
        icon={<LayoutDashboard />}
        route="/dashboard"
      />
      <MenuItem title="Assistant" icon={<Brain />} route="/assistant" />
    </div>
  );
}

function MenuItem({
  title,
  icon,
  route,
}: {
  title: string;
  icon: ReactNode;
  route: string;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className={`flex gap-1 ${location.pathname == route ? "text-green-500" : "text-white"}`}
      onClick={() => navigate(route)}
    >
      {icon}
      <span>{title}</span>
    </div>
  );
}
