"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Eye, AlignLeft } from "lucide-react";
import { Logo } from "../Logo";
import { LogoText } from "./LogoText";
import { useFont } from "@/context/FontProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isHighContrast, setIsHighContrast, setFontSize } = useFont();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border/50" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 h-20">
        {/* Desktop Header */}
        <div className="hidden xl:flex items-center justify-center h-full">
            <div className="flex items-baseline gap-6">
              <Link href="#home" className="flex items-baseline gap-2">
                <div className="animate-logo-in">
                  <Logo className="text-xl" />
                </div>
                <span className="text-xl font-bold font-headline whitespace-nowrap"><LogoText animated={false} /></span>
              </Link>
              <nav className="flex items-baseline gap-2">
                {navLinks.map((link) => (
                  <Button key={link.name} asChild variant="ghost" className="font-headline text-lg hover:bg-primary hover:text-primary-foreground">
                    <Link href={link.href}>{link.name}</Link>
                  </Button>
                ))}
              </nav>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setIsHighContrast(!isHighContrast)}
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle high contrast mode"
                >
                  <Eye className="w-5 h-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Change font size"
                    >
                      <AlignLeft className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setFontSize('text-size-default')}>Default Size</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setFontSize('text-size-large')}>Large</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setFontSize('text-size-larger')}>Larger</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setFontSize('text-size-huge')}>Huge</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setFontSize('text-size-humongous')}>Humongous</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
        </div>

        {/* Mobile Header */}
        <div className="xl:hidden grid grid-cols-3 items-center h-full">
          <div className="flex justify-start">
            <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          <Link href="#home" className="flex items-baseline gap-2 justify-center">
            <div className="animate-logo-in">
              <Logo className="text-xl" />
            </div>
            <span className="text-xl font-bold font-headline whitespace-nowrap"><LogoText animated={false} /></span>
          </Link>
          
          <div className="flex items-center gap-2 justify-end">
            <Button
              onClick={() => setIsHighContrast(!isHighContrast)}
              variant="ghost"
              size="icon"
              aria-label="Toggle high contrast mode"
            >
              <Eye className="w-6 h-6" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Change font size"
                >
                  <AlignLeft className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setFontSize('text-size-default')}>Default Size</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setFontSize('text-size-large')}>Large</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setFontSize('text-size-larger')}>Larger</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setFontSize('text-size-huge')}>Huge</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setFontSize('text-size-humongous')}>Humongous</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="xl:hidden bg-background/95 backdrop-blur-lg pb-4">
          <nav className="px-8 flex flex-col items-start gap-2">
            {navLinks.map((link) => (
              <Button
                key={link.name}
                asChild
                variant="ghost"
                className="w-full justify-start font-headline text-base hover:bg-primary hover:text-primary-foreground"
                onClick={() => setIsOpen(false)}
              >
                <Link href={link.href}>{link.name}</Link>
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
