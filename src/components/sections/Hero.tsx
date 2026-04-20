"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { LogoText } from "../layout/LogoText";
import { generateMegaProxyUrl } from "@/lib/mega-link";

export function Hero() {
  const videoUrl = generateMegaProxyUrl("https://mega.nz/file/LsgHTZQL#FXhdMehXPv5f8awTX99qgWrTPuNsGLqZMYWLXKbL4sg");
  
  return (
    <section id="home" className="relative min-h-screen flex flex-col text-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* This container will hold the main content and grow to fill available space, pushing the button down */}
      <div className="relative z-10 px-4 w-full flex flex-col items-center justify-center flex-grow pt-24">
        <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-wider text-balance text-primary">
          <LogoText animated={true} />
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-foreground text-balance">
          Smart Materials and Soft Robotics Laboratory
        </p>
      </div>
      
      {/* Button container, which will be at the bottom of the flex column */}
      <div className="relative z-20 pb-32"> {/* pb-32 is 8rem */}
        <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity">
            <Link href="#news">
                Explore our research
                <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
            </Link>
        </Button>
      </div>
    </section>
  );
}
