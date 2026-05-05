"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { LogoText } from "../layout/LogoText";

export function Hero() {
  return (
    <section id="home" className="relative w-full min-h-[100svh] lg:min-h-0 lg:aspect-[4/3] flex flex-col text-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-90">
        <iframe
          src="https://www.youtube.com/embed/iqKSzllmZ8A?autoplay=1&mute=1&loop=1&playlist=iqKSzllmZ8A&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="absolute h-[150%] aspect-video max-w-none"
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
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
