'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Project, Publication, TeamMember } from '@/lib/types';
import { BarChart } from "lucide-react";
import { AnimatedTitle } from "../layout/AnimatedTitle";
import { useState, useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import React from "react";
import { Skeleton } from '@/components/ui/skeleton';

const StatItem = ({ stat, index, isActive, isLoading }: { stat: { value: number | string, label: string, super?: string, decimals: number }, index: number, isActive: boolean, isLoading: boolean }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  
  const endValue = typeof stat.value === 'string' ? parseFloat(stat.value) : stat.value;
  const isNumeric = !isNaN(endValue);

  const stars = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const angle = Math.random() * 2 * Math.PI;
      const radius = 24 + Math.random() * 24;
      const x = 50 + (radius / 96) * 100 * Math.cos(angle);
      const y = 50 + (radius / 96) * 100 * Math.sin(angle);
      
      const animationClass = 'animate-bling-pop';
      const animationDuration = `${(Math.random() * 3 + 2).toFixed(2)}s`;
      const animationDelay = `${(Math.random() * 5).toFixed(2)}s`;
      const size = Math.random() * 1.5 + 1;

      return { id: i, x: `${x}%`, y: `${y}%`, animationClass, animationDuration, animationDelay, size };
    });
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (isNumeric) {
            let start = 0;
            const duration = 1500;
            let startTime: number | null = null;

            const step = (timestamp: number) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const currentVal = progress * endValue;

              if (stat.decimals > 0) {
                setCount(parseFloat(currentVal.toFixed(stat.decimals)));
              } else {
                setCount(Math.floor(currentVal));
              }

              if (progress < 1) {
                window.requestAnimationFrame(step);
              } else {
                setCount(endValue);
              }
            };
            window.requestAnimationFrame(step);
          }
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, endValue, isNumeric, stat.decimals, isLoading]);

  if (isLoading) {
    return (
       <div className="flex flex-col items-center">
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="h-4 w-20 mt-4" />
        </div>
    );
  }

  const displayValue = isNumeric ? count.toFixed(stat.decimals) : stat.value;

  return (
    <div ref={ref} className={cn(
        "relative flex flex-col items-center opacity-0 animate-fade-in-up",
      )} 
      style={{animationFillMode: 'forwards', animationDelay: `${200 + index * 100}ms`}}
    >
        <div className="relative w-24 h-24">
            <div className={cn(
                "relative flex items-center justify-center bg-gradient-to-br from-primary to-chart-4 shadow-lg w-full h-full rounded-full p-1 transition-all duration-1000"
            )}>
                <div className="w-full h-full rounded-full bg-gradient-to-br from-chart-4 to-primary flex items-center justify-center shadow-inner">
                    <p className="text-2xl font-bold text-primary-foreground font-headline">
                      {displayValue}
                      {stat.super}
                    </p>
                </div>
                
                {isActive && (
                  <>
                      {stars.map((star) => (
                          <span
                              key={star.id}
                              className={cn(
                                "absolute text-white pointer-events-none",
                                star.animationClass
                              )}
                              style={{
                                  top: star.y,
                                  left: star.x,
                                  transform: 'translate(-50%, -50%)',
                                  '--animation-duration': star.animationDuration,
                                  '--animation-delay': star.animationDelay,
                                  '--star-size': star.size,
                              } as React.CSSProperties}
                          >
                              ✦
                          </span>
                      ))}
                  </>
                )}
            </div>
        </div>
        <p className="mt-4 text-sm md:text-base text-foreground/80 uppercase tracking-widest text-center">
          {stat.label}
        </p>
    </div>
  );
};

export function Stats() {
  const firestore = useFirestore();
  
  const projectsQuery = useMemoFirebase(() => query(collection(firestore, 'projects')), [firestore]);
  const pubsQuery = useMemoFirebase(() => query(collection(firestore, 'publications')), [firestore]);
  const teamQuery = useMemoFirebase(() => query(collection(firestore, 'team_members')), [firestore]);

  const { data: projects, isLoading: isLoadingProjects } = useCollection<Project>(projectsQuery);
  const { data: publications, isLoading: isLoadingPubs } = useCollection<Publication>(pubsQuery);
  const { data: teamMembers, isLoading: isLoadingTeam } = useCollection<TeamMember>(teamQuery);

  const isLoading = isLoadingProjects || isLoadingPubs || isLoadingTeam;

  const totalProjects = projects?.length || 0;
  const totalPublications = publications?.length || 0;
  const totalFunding = projects?.reduce((acc, project) => acc + (project.budget || 0), 0) || 0;
  const totalImpactFactor = publications?.reduce((acc, pub) => acc + (pub.impactFactor || 0), 0) || 0;
  // Note: hIndex is not part of the TeamMember model, so we can't calculate it here.
  const totalHIndex = 42; // Placeholder

  const formatFunding = (num: number) => {
    if (num >= 1000000) {
      return { value: parseFloat((num / 1000000).toFixed(1)), super: 'M' };
    }
    if (num >= 1000) {
      return { value: Math.round(num / 1000), super: 'k' };
    }
    return { value: num, super: '' };
  };

  const fundingFormatted = formatFunding(totalFunding);

  const stats = [
    { value: totalProjects, label: 'Research Projects', super: '+', decimals: 0 },
    { value: totalPublications, label: 'Publications', super: '+', decimals: 0 },
    { value: parseFloat(totalImpactFactor.toFixed(1)), label: 'Impact Factor', decimals: 1 },
    { value: totalHIndex, label: 'Hirsch Index', decimals: 0 },
    { value: fundingFormatted.value, label: 'Total Funding', super: `${fundingFormatted.super}+`, decimals: 1 },
  ];

  const [activeCoinIndex, setActiveCoinIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCoinIndex(prevIndex => {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * stats.length);
        } while (nextIndex === prevIndex);
        return nextIndex;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [stats.length]);
  
  useEffect(() => {
    if (activeCoinIndex === null) {
      setActiveCoinIndex(Math.floor(Math.random() * stats.length));
    }
  }, [activeCoinIndex, stats.length]);

  return (
    <section id="stats" className="py-16 sm:py-20 border-y border-border/50 bg-gradient-to-r from-background via-secondary/10 to-background bg-[length:200%_auto] animate-background-pan">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <AnimatedTitle className="text-3xl sm:text-4xl font-bold font-headline bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent">
                  <div className="flex items-center justify-center gap-3">
                    <BarChart className="w-8 h-8 text-primary" />
                    SMaRT-Lab in numbers
                  </div>
                </AnimatedTitle>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
                {stats.map((stat, index) => (
                  <StatItem key={stat.label} stat={stat} index={index} isActive={index === activeCoinIndex} isLoading={isLoading} />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
