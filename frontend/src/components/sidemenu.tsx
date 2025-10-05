import { Brain, GitGraph, Home, Info, LayoutDashboard } from "lucide-react";
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
    <div className="bg-[#303030]/40 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-between p-4 rounded-2xl h-[calc(100vh-1.5rem)] sm:w-[25%] md:w-[20%] lg:w-[15%] transition-all duration-300">
      {/* Top section (main items) */}
      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <MenuItem
            key={i}
            title={item.title}
            icon={item.icon}
            route={item.route}
          />
        ))}
      </div>

      {/* Bottom section (about page) */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <MenuItem
          title="About"
          icon={<Info/>} // or any icon you use
          route="/about"
        />
      </div>
    </div>
  );
}

function MenuItem({ title, icon, route }: MenuItem) {
  const location = useLocation();
  const navigate = useNavigate();
  const active = location.pathname === route;

  return (
    <div
      onClick={() => navigate(route)}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200
        ${
          active
            ? "text-[#0087FD] bg-[#0087FD]/10"
            : "text-white/80 hover:text-[#0087FD] hover:bg-white/5"
        }`}
    >
      <div className="text-xl">{icon}</div>
      <span className="font-medium text-sm">{title}</span>
    </div>
  );
}
