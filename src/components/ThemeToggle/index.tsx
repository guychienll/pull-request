import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { useEffect } from "react";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, [setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

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
