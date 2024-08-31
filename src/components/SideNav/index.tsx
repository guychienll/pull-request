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
      className={`min-h-screen bg-background border-r transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 overflow-hidden">
        <Button
          variant="ghost"
          className={`w-full justify-center mb-4 transition-all duration-300 ease-in-out ${
            isCollapsed ? "p-2" : ""
          }`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5 transition-transform duration-300 ease-in-out" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5 transition-transform duration-300 ease-in-out" />
          )}
        </Button>
        <ul className="space-y-4">
          <li>
            <Button
              variant="ghost"
              className={`w-full justify-start transition-all duration-300 ease-in-out ${
                isCollapsed ? "px-2" : "px-4"
              }`}
              onClick={() => router.push("/")}
            >
              <HomeIcon className="h-5 w-5 flex-shrink-0" />
              <span
                className={`ml-3 text-lg transition-all duration-300 ease-in-out ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                {t("navigation.home")}
              </span>
            </Button>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-start transition-all duration-300 ease-in-out ${
                    isCollapsed ? "px-2" : "px-4"
                  }`}
                >
                  <GlobeIcon className="h-5 w-5 flex-shrink-0" />
                  <span
                    className={`ml-3 text-lg transition-all duration-300 ease-in-out ${
                      isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    }`}
                  >
                    {t("navigation.language")}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => changeLanguage("zh-TW")}>
                  {t("language.zh-TW")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("en")}>
                  {t("language.en")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default SideNav;
