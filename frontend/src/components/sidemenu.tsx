import { Brain, GitGraph, Home, LayoutDashboard } from "lucide-react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuItem {
  title: string;
  icon: ReactNode;
  route: string;
}

export default function Sidemenu() {
  const items: MenuItem[] = [
    { title: "Accueil", icon: <Home />, route: "/accueil" },
    { title: "Dashboard", icon: <LayoutDashboard />, route: "/dashboard" },
    { title: "Assistant", icon: <Brain />, route: "/assistant" },
  ];

  return (
    <div className="bg-[#303030]/30 backdrop-blur-2xl border border-white/20 shadow-lg flex flex-col gap-6 sm:w-[25%] md:w-[25%] lg:w-[15%] p-3 rounded-2xl h-[calc(100vh-1.5rem)]">
      {items.map((item, i) => (
        <MenuItem
          key={i}
          title={item.title}
          icon={item.icon}
          route={item.route}
        />
      ))}
    </div>
  );
}

function MenuItem({ title, icon, route }: MenuItem) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className={`flex gap-1 ${location.pathname == route ? "text-[#0087FD]" : "text-white"}`}
      onClick={() => navigate(route)}
    >
      {icon}
      <span>{title}</span>
    </div>
  );
}
