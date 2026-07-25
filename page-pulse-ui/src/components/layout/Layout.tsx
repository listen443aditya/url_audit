import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-200">
    <Header />
    <main className="flex-grow flex flex-col items-center justify-center p-6 w-full">
      {children}
    </main>
    <Footer />
  </div>
);
