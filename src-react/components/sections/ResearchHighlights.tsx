'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ResearchHighlight as ResearchHighlightType } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ExternalLink, Sparkles, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

export function ResearchHighlights() {
  const firestore = useFirestore();
  const highlightsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'research_highlights'), orderBy('order', 'asc'));
  }, [firestore]);

  const { data: researchHighlights, isLoading } = useCollection<ResearchHighlightType>(highlightsQuery);

  const itemsPerPage = 3;
  const totalPages = researchHighlights ? Math.ceil(researchHighlights.length / itemsPerPage) : 0;
  const autoplayInterval = 8000;

  const [page, setPage] = useState(1);
  const [animationClass, setAnimationClass] = useState("");
  const [isPaginating, setIsPaginating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [openItem, setOpenItem] = useState<string | undefined>();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startIndex = (page - 1) * itemsPerPage;
  const currentHighlights = researchHighlights ? researchHighlights.slice(startIndex, startIndex + itemsPerPage) : [];

  const handlePageChange = (newPage: number) => {
    if (isPaginating || totalPages <= 1) return;

    let targetPage = newPage;
    if (targetPage > totalPages) targetPage = 1;
    if (targetPage < 1) targetPage = totalPages;
    
    if (targetPage === page) return;

    setIsPaginating(true);
    
    const isForward = (targetPage > page && !(page === 1 && targetPage === totalPages)) || (page === totalPages && targetPage === 1);
    const direction = isForward ? "left" : "right";
    
    setAnimationClass(direction === 'left' ? 'animate-fly-out-to-left' : 'animate-fly-out-to-right');

    setTimeout(() => {
      setPage(targetPage);
      setAnimationClass(direction === 'left' ? 'animate-fly-in-from-right' : 'animate-fly-in-from-left');
      
      setTimeout(() => {
        setAnimationClass('');
        setIsPaginating(false);
      }, 500);
    }, 300);
  };
  
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (!isHovering && !isPaginating && !openItem && totalPages > 1) {
      timerRef.current = setInterval(() => {
        handlePageChange(page + 1);
      }, autoplayInterval);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [page, isPaginating, isHovering, openItem, totalPages]);


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      );
    }

    if (!researchHighlights || researchHighlights.length === 0) {
      return (
        <div className="text-center bg-card/50 p-8 rounded-lg">
          <p className="text-muted-foreground">No research highlights have been published yet.</p>
        </div>
      );
    }
    
    return (
      <>
        <div className={cn("relative", animationClass)}>
          <Accordion type="single" collapsible className="w-full space-y-4" onValueChange={setOpenItem} value={openItem}>
            {currentHighlights.map((item) => {
              let image: { imageUrl: string, description: string, imageHint?: string } | null | undefined = null;
              if (item.imageUrl) {
                  image = { imageUrl: item.imageUrl, description: item.title };
              } else if (item.imageId) {
                  image = PlaceHolderImages.find((p) => p.id === item.imageId);
              }

              return (
                <AccordionItem value={`item-${item.id}`} key={item.id} className="group bg-card border-none rounded-lg shadow-lg hover:shadow-primary/20 transition-shadow duration-300 overflow-hidden">
                  <div className="relative">
                    {image?.imageUrl && (
                      <div
                        onClick={() => setOpenItem(openItem === `item-${item.id}` ? '' : `item-${item.id}`)}
                        className={cn(
                          "absolute z-20 rounded-md overflow-hidden transition-all duration-700 ease-in-out group-data-[state=closed]:cursor-pointer group-data-[state=closed]:hover:animate-pop-then-wiggle",
                          // When closed, it's a thumbnail on the top-left
                          "group-data-[state=closed]:top-6 group-data-[state=closed]:left-6 group-data-[state=closed]:w-28 group-data-[state=closed]:aspect-[16/9] group-data-[state=closed]:shadow-lg",
                          // When open, it's a full-width banner at the top
                          "group-data-[state=open]:top-[7.5rem] group-data-[state=open]:left-6 group-data-[state=open]:w-[calc(100%-3rem)] group-data-[state=open]:aspect-video"
                        )}
                      >
                        <Image
                          src={image.imageUrl}
                          alt={image.description || item.title}
                          fill
                          className="object-cover"
                          data-ai-hint={image.imageHint}
                        />
                      </div>
                    )}
              
                    <AccordionPrimitive.Header className="relative flex z-10">
                        <AccordionPrimitive.Trigger className={cn(
                            "group/trigger text-left hover:no-underline w-full transition-all duration-700 ease-in-out py-6 pr-6",
                            // Adjust padding to make space for the thumbnail
                            "group-data-[state=closed]:pl-40",
                            // When open, padding is normal
                            "group-data-[state=open]:pl-6"
                        )}>
                            <div className="flex flex-row items-center w-full min-h-[3.9375rem]">
                                <div className="flex-1">
                                    <h3 className="font-headline text-lg sm:text-xl text-foreground transition-colors group-hover/trigger:text-primary group-data-[state=open]:text-primary" dangerouslySetInnerHTML={{ __html: item.title }} />
                                    <p className="text-sm font-mono text-muted-foreground mt-2">{item.category}</p>
                                </div>
                                <div className="pl-4">
                                    <ChevronUp className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=closed]:rotate-180" />
                                </div>
                            </div>
                        </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>
                  </div>
                  
                  <AccordionContent>
                      <div className="px-6 pb-6 pt-0">
                         {/* This div creates space for the animated image banner */}
                         <div className="pt-[calc(56.25%_+_1.5rem)]">
                            <div className="opacity-0 group-data-[state=open]:opacity-100 group-data-[state=open]:animate-fade-in-up group-data-[state=open]:[animation-delay:400ms]" style={{animationDuration: '1s', animationFillMode: 'forwards'}}>
                                <div className="border-t border-border/50 pt-4">
                                    <div 
                                        className="text-sm text-foreground/90 text-justify"
                                        dangerouslySetInnerHTML={{ __html: item.description }}
                                    />
                                     {item.link && (
                                        <div className="mt-6">
                                            <Button asChild size="sm">
                                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                                                Read More <ExternalLink className="ml-2 h-4 w-4" />
                                            </a>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                         </div>
                      </div>
                  </AccordionContent>
              </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(page - 1)}
              disabled={isPaginating}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <Button
                key={index}
                variant={page === index + 1 ? "default" : "outline"}
                size="icon"
                onClick={() => handlePageChange(index + 1)}
                disabled={isPaginating}
                className="rounded-full"
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(page + 1)}
              disabled={isPaginating}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </>
    );
  }


  return (
    <section 
      id="highlights" 
      className="py-20 sm:py-32 overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold font-headline bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent mb-12 text-center flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            Research Highlights
        </h2>
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </section>
  );
}
