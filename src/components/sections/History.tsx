'use client';

import { Milestone, X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedTitle } from "../layout/AnimatedTitle";
import { AnimatedWrapper } from "../layout/AnimatedWrapper";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { HistoryMilestone as HistoryMilestoneType } from '@/lib/types';
import { Skeleton } from "@/components/ui/skeleton";

export function History() {
  const firestore = useFirestore();
  const historyCollectionQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'history_milestones'), orderBy('year', 'asc'));
  }, [firestore]);

  const { data: historyData, isLoading } = useCollection<HistoryMilestoneType>(historyCollectionQuery);

  const history = useMemo(() => {
    if (!historyData) return [];
    return [
      ...historyData,
      { 
        id: 'present-day',
        year: new Date().getFullYear(), 
        title: "Present Day", 
        description: "Continuing to innovate and push the boundaries of soft robotics and intelligent materials." 
      }
    ]
  }, [historyData]);

  const imageMilestones = useMemo(() => history.filter(item => !!(item as any).imageId), [history]);

  const lineRef = useRef<HTMLDivElement>(null);
  const [isLineVisible, setIsLineVisible] = useState(false);
  const [magnifiedImageIndex, setMagnifiedImageIndex] = useState<number | null>(null);
  
  // State to hold calculated animation delays for each milestone
  const [animationDelays, setAnimationDelays] = useState<number[]>([]);

  useEffect(() => {
    // Calculate delays once history data is loaded
    if (history.length > 0 && animationDelays.length === 0) {
      const delays = history.map((item, index) => {
        // Base delay for sequential animation
        const baseDelay = index * 500; // 500ms stagger between items
        // Variable delay based on text length (e.g., 3ms per character)
        const textLengthDelay = (item.description || '').length * 3;
        return baseDelay + textLengthDelay;
      });
      setAnimationDelays(delays);
    }
  }, [history, animationDelays.length]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLineVisible(true);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const currentRef = lineRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);
  
  const showNextImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMagnifiedImageIndex((prevIndex) => {
      if (prevIndex === null) return null;
      return (prevIndex + 1) % imageMilestones.length;
    });
  }, [imageMilestones.length]);

  const showPrevImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMagnifiedImageIndex((prevIndex) => {
        if (prevIndex === null) return null;
        return (prevIndex - 1 + imageMilestones.length) % imageMilestones.length;
    });
  }, [imageMilestones.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (magnifiedImageIndex === null) return;
        if (event.key === 'ArrowRight') {
            showNextImage();
        } else if (event.key === 'ArrowLeft') {
            showPrevImage();
        } else if (event.key === 'Escape' || event.key === 'ArrowDown') {
            setMagnifiedImageIndex(null);
        }
    };

    if (magnifiedImageIndex !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [magnifiedImageIndex, showNextImage, showPrevImage]);

  const currentMilestone = magnifiedImageIndex !== null ? imageMilestones[magnifiedImageIndex] : null;
  const magnifiedImage = currentMilestone ? PlaceHolderImages.find(p => p.id === (currentMilestone as any).imageId) : null;

  return (
    <section id="history" className="py-20 sm:py-32 bg-secondary/10">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
              <AnimatedTitle className="text-3xl sm:text-4xl font-bold font-headline bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent">
                  <div className="flex items-center justify-center gap-3">
                      <Milestone className="w-8 h-8 text-primary" />
                      Our Journey
                  </div>
              </AnimatedTitle>
          </div>
          <div ref={lineRef} className="relative wrap overflow-hidden py-10 [perspective:1000px]">
            <div className={cn(
                "absolute border-opacity-20 border-primary border-2 left-1/2 -translate-x-1/2 origin-top",
                isLineVisible ? 'animate-draw-line' : 'h-0'
              )}
            ></div>
            {isLoading && (
              <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`mb-8 flex justify-between items-center w-full ${i % 2 === 0 ? 'flex-row-reverse left-timeline' : 'right-timeline'}`}>
                    <div className="order-1 w-5/12"></div>
                    <div className="z-20 flex items-center order-1 bg-transparent w-20 h-20 justify-center">
                      <Skeleton className="w-16 h-16 rounded-full" />
                    </div>
                    <div className="order-1 bg-card rounded-lg shadow-xl w-5/12 px-6 py-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!isLoading && history.map((item, index) => {
              const image = (item as any).imageId ? PlaceHolderImages.find(p => p.id === (item as any).imageId) : null;
              
              return (
                <div key={item.id} className={`mb-8 flex justify-between items-center w-full ${index % 2 === 0 ? 'flex-row-reverse left-timeline' : 'right-timeline'}`}>
                  <div className="order-1 w-5/12"></div>

                  <div className="z-20 flex items-center order-1 bg-transparent w-20 h-20 justify-center">
                    <div className="flex items-center justify-center bg-primary rounded-full w-16 h-16 shadow-xl ring-4 ring-background">
                      <h3 className="mx-auto font-bold text-lg text-primary-foreground">{item.year}</h3>
                    </div>
                  </div>
                  
                  <AnimatedWrapper
                    className={cn(
                      "order-1 w-5/12 [transform-style:preserve-3d]",
                      // Set origin to the INNER edge for a signpost effect
                      index % 2 === 0 ? 'origin-right' : 'origin-left'
                    )}
                    animation={index % 2 === 0 ? 'revolve-in-from-right' : 'revolve-in-from-left'}
                    delay={animationDelays[index] || 0}
                  >
                    <div className="bg-card rounded-lg shadow-xl w-full px-6 py-4">
                      <div className="flex items-start gap-4">
                        {image && (
                          <div 
                            className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mt-1 shadow-md cursor-pointer hover:animate-pop-then-wiggle"
                            onClick={() => {
                              const milestoneIndex = imageMilestones.findIndex(m => m.id === item.id);
                              if (milestoneIndex > -1) setMagnifiedImageIndex(milestoneIndex);
                            }}
                          >
                            <Image
                              src={image.imageUrl}
                              alt={image.description}
                              fill
                              className="object-cover"
                              data-ai-hint={image.imageHint}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-lg font-headline text-primary">{item.title}</h4>
                          <p className="text-sm leading-snug tracking-wide text-muted-foreground mt-2 text-justify">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </AnimatedWrapper>
                </div>
            )})}
          </div>
        </div>
      </div>
      
      {magnifiedImageIndex !== null && magnifiedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 sm:p-8 animate-fade-in-up"
          style={{ animationDuration: '0.3s' }}
          onClick={() => setMagnifiedImageIndex(null)}
        >
           <button
            onClick={(e) => {
              e.stopPropagation();
              setMagnifiedImageIndex(null);
            }}
            className="absolute top-6 right-6 bg-white/80 text-neutral-800 rounded-full p-3 shadow-lg transition-all hover:scale-110 hover:bg-white z-[110]"
            aria-label="Close magnified image"
          >
            <X className="w-7 h-7" />
          </button>
          
          <button
            onClick={showPrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] bg-white/80 text-neutral-800 rounded-full p-2 shadow-lg transition-all hover:scale-110 hover:bg-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Wrapper for Polaroid */}
          <div
            className="relative w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* The Polaroid frame */}
            <div className="bg-white p-4 pb-16 sm:p-6 sm:pb-20 rounded-lg shadow-2xl transform transition-transform duration-300 hover:rotate-0 -rotate-2">
              <div className="relative w-full aspect-square bg-neutral-200">
                <Image
                  src={magnifiedImage.imageUrl}
                  alt={magnifiedImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={magnifiedImage.imageHint}
                />
              </div>
              <p className="mt-6 text-center font-playfair-display italic text-lg text-neutral-700">{magnifiedImage.description}</p>
            </div>
          </div>
          
          <button
            onClick={showNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] bg-white/80 text-neutral-800 rounded-full p-2 shadow-lg transition-all hover:scale-110 hover:bg-white"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
}
