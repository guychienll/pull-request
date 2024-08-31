import { Toaster } from "@/components/ui/toaster";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import dynamic from "next/dynamic";

const SideNav = dynamic(() => import("@/components/SideNav"), {
  ssr: false,
});

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
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
      <SideNav
        isCollapsed={isMobile ? true :isCollapsed}
        setIsCollapsed={isMobile ? () => 0 : setIsCollapsed}
      />
      <main className="flex-1">{children}</main>
      <Toaster />
    </div>
  );
};

export default Layout;
