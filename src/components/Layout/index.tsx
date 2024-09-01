import { Toaster } from "@/components/ui/toaster";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import SideNav from "@/components/SideNav";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const segment = router.pathname.split("/")[1];
  const title = `PR Platform ${
    router.pathname === "/" ? "" : `| ${t(`title.${segment}`)}`
  }`;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-B6XESXE041";
    script.async = true;
    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      const gtag = function (...args: any[]) {
        window.dataLayer.push(...args);
      };
      gtag("js", new Date());
      gtag("config", "G-B6XESXE041");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex max-w-screen max-w-[1024px] mx-auto">
      <title>{title}</title>
      <meta name="description" content={t("description")} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={t("description")} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
      <div className="flex flex-col w-full">
        <SideNav />
        <main className="w-full">{children}</main>
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;
