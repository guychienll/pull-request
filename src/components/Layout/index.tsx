import SideNav from "@/components/SideNav";
import { Toaster } from "@/components/ui/toaster";
import { useTranslation } from "next-i18next";
import { Head } from "next/document";
import { useRouter } from "next/router";
import React, { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();
  const segment = router.pathname.split("/")[1];
  const title = `PR Platform ${
    router.pathname === "/" ? "" : `| ${t(`title.${segment}`)}`
  }`;

  return (
    <div className="flex">
      <title>{title}</title>
      <meta name="description" content={t("description")} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={t("description")} />
      <SideNav isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className="flex-1">{children}</main>
      <Toaster />
    </div>
  );
};

export default Layout;
