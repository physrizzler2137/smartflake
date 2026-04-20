"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { History } from "@/components/sections/History";
import { Facilities } from "@/components/sections/Facilities";
import { Projects } from "@/components/sections/Projects";
import { Team } from "@/components/sections/Team";
import { Publications } from "@/components/sections/Publications";
import { Contact } from "@/components/sections/Contact";
import { Mission } from "@/components/sections/Mission";
import { FontSwitcher } from "@/components/sections/FontSwitcher";
import { News } from "@/components/sections/News";
import { ResearchHighlights } from "@/components/sections/ResearchHighlights";
import { ThemeSwitcher } from "@/components/sections/ThemeSwitcher";

export default function Home() {
  const inactivityTimer = useRef<NodeJS.Timeout>();
  const [isFontSwitcherVisible, setIsFontSwitcherVisible] = useState(false);
  const [isThemeSwitcherVisible, setIsThemeSwitcherVisible] = useState(false);

  const resetTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' });
    }, 3 * 60 * 1000); // 3 minutes
  };
  
  useEffect(() => {
    const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'scroll', 'touchstart'];
    
    const reset = () => resetTimer();

    activityEvents.forEach(event => {
      window.addEventListener(event, reset);
    });

    resetTimer(); // Initialize timer on component mount

    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      activityEvents.forEach(event => {
        window.removeEventListener(event, reset);
      });
    };
  }, []);

  const toggleFontSwitcher = () => {
    setIsThemeSwitcherVisible(false);
    setIsFontSwitcherVisible(prev => !prev);
  }
  
  const toggleThemeSwitcher = () => {
    setIsFontSwitcherVisible(false);
    setIsThemeSwitcherVisible(prev => !prev);
  }

  return (
    <div className="relative">
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Hero />
          <News />
          <Mission />
          <History />
          <Facilities />
          <Team />
          <ResearchHighlights />
          <Projects />
          <Publications />
          <Stats />
          <Contact />
          {isFontSwitcherVisible && <FontSwitcher />}
          {isThemeSwitcherVisible && <ThemeSwitcher />}
        </main>
        <Footer onToggleFontSwitcher={toggleFontSwitcher} onToggleThemeSwitcher={toggleThemeSwitcher} />
      </div>
    </div>
  );
}
