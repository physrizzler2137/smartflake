'use client';

import { useFont } from "@/context/FontProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Palette, CheckCircle } from "lucide-react";

const themes = [
    { 
        id: 'dark', 
        name: 'Default Navy', 
        colors: {
            bg: 'hsl(215 60% 16%)',
            primary: 'hsl(60 68% 81%)',
            accent: 'hsl(345 50% 45%)',
            card: 'hsl(212 65% 15%)',
            foreground: 'hsl(210 40% 96%)'
        } 
    },
    { 
        id: 'theme-classic-rw', 
        name: 'Classic Red & White', 
        colors: {
            bg: 'hsl(0 0% 100%)',
            primary: 'hsl(0 72% 51%)',
            accent: 'hsl(0 0% 9%)',
            card: 'hsl(0 0% 96%)',
            foreground: 'hsl(0 0% 3.9%)'
        } 
    },
    { 
        id: 'theme-cyberpunk-2077', 
        name: 'Cyberpunk 2077', 
        colors: {
            bg: 'hsl(240 10% 4%)',
            primary: 'hsl(54 100% 50%)',
            accent: 'hsl(180 100% 50%)',
            card: 'hsl(240 15% 8%)',
            foreground: 'hsl(60 90% 95%)'
        } 
    },
    { 
        id: 'theme-cyberpunk-yellow-glitch', 
        name: 'Cyberpunk Yellow', 
        colors: {
            bg: 'hsl(54 100% 50%)',
            primary: 'hsl(315 90% 60%)',
            accent: 'hsl(315 90% 60%)',
            card: 'hsl(0 0% 100%)',
            foreground: 'hsl(190 90% 50%)'
        } 
    },
    { 
        id: 'theme-ocean', 
        name: 'Ocean', 
        colors: {
            bg: 'hsl(200 80% 10%)',
            primary: 'hsl(175 70% 60%)',
            accent: 'hsl(185 65% 50%)',
            card: 'hsl(200 70% 14%)',
            foreground: 'hsl(180 20% 95%)'
        } 
    },
    { 
        id: 'theme-forest', 
        name: 'Forest', 
        colors: {
            bg: 'hsl(120 40% 8%)',
            primary: 'hsl(80 60% 65%)',
            accent: 'hsl(40 60% 55%)',
            card: 'hsl(120 30% 12%)',
            foreground: 'hsl(90 25% 94%)'
        }
    },
    { 
        id: 'theme-sunset', 
        name: 'Sunset', 
        colors: {
            bg: 'hsl(260 50% 10%)',
            primary: 'hsl(25 90% 60%)',
            accent: 'hsl(340 80% 65%)',
            card: 'hsl(260 45% 15%)',
            foreground: 'hsl(300 20% 95%)'
        }
    },
    { 
        id: 'theme-amber', 
        name: 'Amber', 
        colors: {
            bg: 'hsl(25 20% 12%)',
            primary: 'hsl(35 90% 60%)',
            accent: 'hsl(20 80% 55%)',
            card: 'hsl(25 25% 15%)',
            foreground: 'hsl(35 30% 92%)'
        } 
    },
    { 
        id: 'theme-poppy', 
        name: 'Poppy Fields', 
        colors: {
            bg: 'hsl(100 12% 10%)',
            primary: 'hsl(5 80% 55%)',
            accent: 'hsl(120 50% 40%)',
            card: 'hsl(110 15% 14%)',
            foreground: 'hsl(90 15% 95%)'
        } 
    },
    { 
        id: 'theme-bialowieza', 
        name: 'Białowieża', 
        colors: {
            bg: 'hsl(190 15% 18%)',
            primary: 'hsl(160 40% 65%)',
            accent: 'hsl(110 25% 50%)',
            card: 'hsl(190 20% 22%)',
            foreground: 'hsl(180 10% 90%)'
        } 
    },
    { 
        id: 'theme-warsaw-neon', 
        name: 'Warsaw Neon', 
        colors: {
            bg: 'hsl(240 10% 4%)',
            primary: 'hsl(310 100% 70%)',
            accent: 'hsl(180 100% 50%)',
            card: 'hsl(240 15% 8%)',
            foreground: 'hsl(240 10% 95%)'
        } 
    },
    { 
        id: 'theme-kyoto-garden', 
        name: 'Kyoto Garden', 
        colors: {
            bg: 'hsl(140 30% 10%)',
            primary: 'hsl(340 70% 70%)',
            accent: 'hsl(210 10% 50%)',
            card: 'hsl(140 25% 15%)',
            foreground: 'hsl(40 10% 95%)'
        } 
    },
    { 
        id: 'theme-seoul-night', 
        name: 'Seoul Night', 
        colors: {
            bg: 'hsl(220 40% 5%)',
            primary: 'hsl(320 100% 65%)',
            accent: 'hsl(180 100% 50%)',
            card: 'hsl(220 35% 10%)',
            foreground: 'hsl(220 10% 95%)'
        } 
    },
    { 
        id: 'theme-hanok-village', 
        name: 'Hanok Village', 
        colors: {
            bg: 'hsl(30 20% 12%)',
            primary: 'hsl(160 30% 50%)',
            accent: 'hsl(20 50% 55%)',
            card: 'hsl(30 25% 18%)',
            foreground: 'hsl(40 40% 90%)'
        } 
    },
    { 
        id: 'theme-tokyo-night', 
        name: 'Tokyo Night', 
        colors: {
            bg: 'hsl(250 30% 8%)',
            primary: 'hsl(315 90% 65%)',
            accent: 'hsl(180 80% 50%)',
            card: 'hsl(250 30% 12%)',
            foreground: 'hsl(240 10% 95%)'
        } 
    },
    { 
        id: 'theme-osaka-downtown', 
        name: 'Osaka Downtown', 
        colors: {
            bg: 'hsl(30 5% 10%)',
            primary: 'hsl(25 95% 60%)',
            accent: 'hsl(45 100% 55%)',
            card: 'hsl(30 5% 15%)',
            foreground: 'hsl(30 20% 94%)'
        } 
    },
];

export function ThemeSwitcher() {
    const { theme, setTheme } = useFont();

    return (
        <section id="theme-switcher" className="py-20 sm:py-32 bg-card/20">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-card/50 backdrop-blur-sm border-border/50 rounded-xl p-8 shadow-2xl">
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-center font-headline bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent flex items-center justify-center gap-3">
                                <Palette className="w-8 h-8 text-primary" />
                                Theme Playground
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {themes.map((t) => {
                                const isActive = theme === t.id;
                                return (
                                    <div key={t.id} className={cn("rounded-lg border-2 transition-all", isActive ? 'border-primary shadow-lg' : 'border-border/50')}>
                                        <div className="p-4 rounded-lg bg-card">
                                            <h3 className="font-headline text-lg mb-4 text-center">{t.name}</h3>
                                            <div className="flex justify-center space-x-2 mb-4">
                                                <div className="w-8 h-8 rounded-full border border-border/50" style={{ backgroundColor: t.colors.bg }} />
                                                <div className="w-8 h-8 rounded-full border border-border/50" style={{ backgroundColor: t.colors.primary }} />
                                                <div className="w-8 h-8 rounded-full border border-border/50" style={{ backgroundColor: t.colors.accent }} />
                                                <div className="w-8 h-8 rounded-full border border-border/50" style={{ backgroundColor: t.colors.card }} />
                                                <div className="w-8 h-8 rounded-full border border-border/50" style={{ backgroundColor: t.colors.foreground }} />
                                            </div>
                                            <Button 
                                                className="w-full"
                                                variant={isActive ? 'default' : 'outline'}
                                                onClick={() => setTheme(t.id)}
                                            >
                                                {isActive && <CheckCircle className="mr-2" />}
                                                {isActive ? 'Active' : 'Apply Theme'}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-center text-xs text-muted-foreground mt-10">Select a theme to apply it to the entire website.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

    

