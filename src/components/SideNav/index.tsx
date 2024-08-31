import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  SettingsIcon,
  GlobeIcon,
} from "lucide-react";
import { useTranslation } from "next-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";
import clsx from "clsx";

function SideNav({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}) {
  const { t } = useTranslation("common");
  const router = useRouter();

  const changeLanguage = (lang: string) => {
    router.push(router.pathname, router.asPath, { locale: lang });
  };

  return (
    <nav
      className={clsx(
        "min-h-screen bg-background border-r transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 overflow-hidden">
        {!isMobile && (
          <Button
            variant="ghost"
            className={clsx(
              "w-full justify-center mb-4 transition-all duration-300 ease-in-out",
              {
                "p-2": isCollapsed,
              }
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5 transition-transform duration-300 ease-in-out" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5 transition-transform duration-300 ease-in-out" />
            )}
          </Button>
        )}
        <ul className="space-y-4">
          <li>
            <Button
              variant="ghost"
              className={clsx(
                "w-full transition-all duration-300 ease-in-out",
                isCollapsed ? "px-2 justify-center" : "px-4 justify-start"
              )}
              onClick={() => router.push("/")}
            >
              <HomeIcon className="h-5 w-5 flex-shrink-0" />
              <span
                className={clsx(
                  "ml-3 text-lg transition-all duration-300 ease-in-out",
                  isCollapsed ? "hidden" : "inline-block"
                )}
              >
                {t("navigation.home")}
              </span>
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className={clsx(
                "w-full transition-all duration-300 ease-in-out",
                isCollapsed ? "px-2 justify-center" : "px-4 justify-start"
              )}
              onClick={() => router.push("/settings")}
            >
              <SettingsIcon className="h-5 w-5 flex-shrink-0" />
              <span
                className={clsx(
                  "ml-3 text-lg transition-all duration-300 ease-in-out",
                  isCollapsed ? "hidden" : "inline-block"
                )}
              >
                {t("navigation.settings")}
              </span>
            </Button>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={clsx(
                    "w-full transition-all duration-300 ease-in-out",
                    isCollapsed ? "px-2 justify-center" : "px-4 justify-start"
                  )}
                >
                  <GlobeIcon className="h-5 w-5 flex-shrink-0" />
                  <span
                    className={clsx(
                      "ml-3 text-lg transition-all duration-300 ease-in-out",
                      isCollapsed ? "hidden" : "inline-block"
                    )}
                  >
                    {t("navigation.language")}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {router.locales?.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                  >
                    {t(`language.${lang}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default SideNav;
