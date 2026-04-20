"use client";

import { useFont } from "@/context/FontProvider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { LogoText } from "../layout/LogoText";
import { Palette } from "lucide-react";

const organicFonts = [
    { name: 'Merriweather', className: 'font-merriweather' },
    { name: 'Lora', className: 'font-lora' },
    { name: 'Playfair Display', className: 'font-playfair-display' },
    { name: 'EB Garamond', className: 'font-eb-garamond' },
    { name: 'Cormorant Garamond', className: 'font-cormorant-garamond' },
    { name: 'Libre Baskerville', className: 'font-libre-baskerville' },
    { name: 'Arvo', className: 'font-arvo' },
    { name: 'PT Serif', className: 'font-pt-serif' },
    { name: 'Cardo', className: 'font-cardo' },
    { name: 'Old Standard TT', className: 'font-old-standard-tt' },
    { name: 'Raleway', className: 'font-raleway' },
    { name: 'Lato', className: 'font-lato' },
    { name: 'Noto Serif', className: 'font-noto-serif' },
    { name: 'Source Serif Pro', className: 'font-source-serif-pro' },
    { name: 'Roboto Slab', className: 'font-roboto-slab' },
  ];

  const technicalFonts = [
    { name: 'Orbitron', className: 'font-orbitron' },
    { name: 'Electrolize', className: 'font-electrolize' },
    { name: 'Audiowide', className: 'font-audiowide' },
    { name: 'Chakra Petch', className: 'font-chakra-petch' },
    { name: 'Share Tech Mono', className: 'font-share-tech-mono' },
    { name: 'Roboto Mono', className: 'font-roboto-mono' },
    { name: 'Nova Square', className: 'font-nova-square' },
    { name: 'Bungee', className: 'font-bungee' },
    { name: 'Cutive Mono', className: 'font-cutive-mono' },
    { name: 'Fira Mono', className: 'font-fira-mono' },
    { name: 'Gruppo', className: 'font-gruppo' },
    { name: 'Syncopate', className: 'font-syncopate' },
    { name: 'VT323', className: 'font-vt323' },
    { name: 'Tomorrow', className: 'font-tomorrow' },
    { name: 'Russo One', className: 'font-russo-one' },
  ];

  const robotoFonts = [
    { name: 'Roboto', className: 'font-roboto' },
    { name: 'Roboto Condensed', className: 'font-roboto-condensed' },
    { name: 'Roboto Serif', className: 'font-roboto-serif' },
    { name: 'Roboto Slab', className: 'font-roboto-slab' },
    { name: 'Roboto Mono', className: 'font-roboto-mono' },
  ];

const slabFonts = [
    { name: 'Roboto Slab', className: 'font-roboto-slab' },
    { name: 'Arvo', className: 'font-arvo' },
    { name: 'Zilla Slab', className: 'font-zilla-slab' },
    { name: 'Rokkitt', className: 'font-rokkitt' },
    { name: 'Josefin Slab', className: 'font-josefin-slab' },
    { name: 'Patua One', className: 'font-patua-one' },
    { name: 'Crete Round', className: 'font-crete-round' },
];

export function FontSwitcher() {
    const { setHeadlineFontClass, setBodyFontClass, headlineFontClass, bodyFontClass } = useFont();

    const renderFont = (font: { name: string, className: string }) => (
        <div key={font.name} className={cn("text-center border rounded-lg transition-all", font.className, headlineFontClass === font.className || bodyFontClass === font.className ? 'border-primary' : 'border-transparent')}>
          <div className={cn('p-4 rounded-lg', headlineFontClass === font.className && bodyFontClass === font.className ? 'bg-primary/20' : headlineFontClass === font.className ? 'bg-primary/10' : bodyFontClass === font.className ? 'bg-accent/10' : 'bg-transparent' )}>
            <h3 className="text-2xl mb-4 text-primary">{font.name}</h3>
            <p className="text-3xl font-bold mb-3">
              <LogoText />
            </p>
            <p className="text-foreground/80 text-base">A soft, yet intelligent, robotic material.</p>
            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2">
              <Button size="sm" variant={headlineFontClass === font.className ? 'default' : 'outline'} onClick={() => setHeadlineFontClass(font.className)}>
                Set Headline
              </Button>
              <Button size="sm" variant={bodyFontClass === font.className ? 'default' : 'outline'} onClick={() => setBodyFontClass(font.className)}>
                Set Body
              </Button>
            </div>
          </div>
        </div>
      );

  return (
    <section id="font-switcher" className="py-20 sm:py-32 bg-card/20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border-border/50 rounded-xl p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-center font-headline bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent flex items-center justify-center gap-3">
                <Palette className="w-8 h-8 text-primary" />
                Font Playground
            </h2>
          </div>
          <Tabs defaultValue="organic">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-popover shadow-inner border border-black/20">
                  <TabsTrigger value="organic">Organic & Classic</TabsTrigger>
                  <TabsTrigger value="technical">Technical & Modern</TabsTrigger>
                  <TabsTrigger value="slab">Slab Serifs</TabsTrigger>
                  <TabsTrigger value="roboto">Roboto Variants</TabsTrigger>
              </TabsList>
              <TabsContent value="organic">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {organicFonts.map(renderFont)}
                  </div>
              </TabsContent>
              <TabsContent value="technical">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {technicalFonts.map(renderFont)}
                  </div>
              </TabsContent>
              <TabsContent value="slab">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {slabFonts.map(renderFont)}
                  </div>
              </TabsContent>
              <TabsContent value="roboto">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {robotoFonts.map(renderFont)}
                  </div>
              </TabsContent>
          </Tabs>
          <p className="text-center text-xs text-muted-foreground mt-10">Select a font to apply it to the page's headlines or body text.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
