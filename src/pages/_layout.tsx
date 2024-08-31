import SideNav from "@/components/SideNav";
import { Toaster } from "@/components/ui/toaster";
import React, { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="flex">
      <SideNav isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className="flex-1">{children}</main>
      <Toaster />
    </div>
  );
};

export default Layout;
