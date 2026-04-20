import Link from "next/link";
import { LogoText } from "./LogoText";
import { Button } from "@/components/ui/button";
import { Type, Palette } from "lucide-react";

export function Footer({ onToggleFontSwitcher, onToggleThemeSwitcher }: { onToggleFontSwitcher: () => void, onToggleThemeSwitcher: () => void }) {
  return (
    <footer className="bg-card/50 border-t border-border/50">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center md:items-baseline text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} <LogoText />. All rights reserved.</p>
        <div className="flex items-baseline gap-4 mt-4 md:mt-0">
            <p>Smart Materials and Soft Robotics Laboratory</p>
            <Link href="/admin" className="hover:text-primary transition-colors">
                Admin
            </Link>
            <Button onClick={onToggleThemeSwitcher} variant="ghost" size="icon" aria-label="Toggle Theme Playground">
              <Palette className="w-5 h-5" />
            </Button>
            <Button onClick={onToggleFontSwitcher} variant="ghost" size="icon" aria-label="Toggle Font Playground">
              <Type className="w-5 h-5" />
            </Button>
        </div>
      </div>
    </footer>
  );
}
