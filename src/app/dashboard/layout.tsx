// app/layout.tsx or wherever you're using the layout
'use client';

import NavBar from "../components/layout/navbar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="min-w-40 w-[200px] max-md:hidden h-full">
        <NavBar className="h-full" />
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}