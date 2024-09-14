import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { GlobeIcon, SettingsIcon, ShieldIcon } from "lucide-react";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const ThemeToggle = dynamic(() => import("../ThemeToggle"), { ssr: false });

function SideNav() {
  const { t } = useTranslation("common");
  const router = useRouter();

  const changeLanguage = (lang: string) => {
    router.push(router.pathname, router.asPath, { locale: lang });
  };

  return (
    <nav className="flex flex-row w-full h-[48px]">
      <div
        className="flex items-center gap-x-2 px-2 min-w-[160px]"
        onClick={() => router.push("/")}
      >
        <GitHubLogoIcon className="h-6 w-6" />
        <span className="text-lg font-bold">PR Platform</span>
      </div>
      <ul className="flex justify-start flex-row items-center w-full">
        <li>
          <Button
            className="flex gap-x-2 items-center"
            variant="ghost"
            onClick={() => router.push("/settings")}
          >
            <SettingsIcon className="h-5 w-5 flex-shrink-0" />
            <span className="md:inline-block hidden">
              {t("navigation.settings")}
            </span>
          </Button>
        </li>
        <li>
          <Button
            className="flex gap-x-2 items-center"
            variant="ghost"
            onClick={() => router.push("/privacy")}
          >
            <ShieldIcon className="h-5 w-5 flex-shrink-0" />
            <span className="md:inline-block hidden">
              {t("navigation.privacy")}
            </span>
          </Button>
        </li>
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex gap-x-2 items-center" variant="ghost">
                <GlobeIcon className="h-5 w-5 flex-shrink-0" />
                <span className="md:inline-block hidden">
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
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}

export default SideNav;
