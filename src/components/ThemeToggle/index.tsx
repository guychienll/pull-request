import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    setMounted(true);
  }, [setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  if (!mounted) return null;

  return (
    <Button
      className="flex items-center justify-start visible"
      variant="ghost"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <SunIcon className="h-5 w-5 flex-shrink-0" />
      ) : (
        <MoonIcon className="h-5 w-5 flex-shrink-0" />
      )}
    </Button>
  );
}

export default ThemeToggle;
