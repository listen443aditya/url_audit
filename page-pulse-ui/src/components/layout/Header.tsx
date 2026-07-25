import React from "react";
import { Activity } from "lucide-react";

export const Header: React.FC = () => (
  <header className="w-full bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between shadow-sm z-10 relative">
    <div className="flex items-center gap-2 text-blue-700">
      <Activity className="h-6 w-6" />
      <span className="text-xl font-bold tracking-tight text-slate-900">
        Page<span className="text-blue-600">Pulse</span>
      </span>
    </div>
  </header>
);
