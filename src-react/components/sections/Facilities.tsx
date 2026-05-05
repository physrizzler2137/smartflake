"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { facilities } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Beaker, Wrench, Building, X, ChevronLeft, ChevronRight } from "lucide-react";
import { generateMegaProxyUrl } from "@/lib/mega-link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AnimatedTitle } from "../layout/AnimatedTitle";
import { AnimatedWrapper } from "../layout/AnimatedWrapper";

export function Facilities() {
  const [animationDelays, setAnimationDelays] = useState<number[]>([]);

  useEffect(() => {
    // Generate random delays for each facility card's wrench icon on mount
    const delays = facilities.map(() => Math.random() * 5); // Delays up to 5 seconds
    setAnimationDelays(delays);
  }, []);

  const allEquipment = useMemo(() => {
    return facilities.flatMap(f => (f.equipment || []) as any[]).map(item => {
      const eqPlaceholderImage = item.imageId ? PlaceHolderImages.find(p => p.id === item.imageId) : undefined;
      let imageUrl = '';
      let imageHint = '';

      if (item.directUrl) {
        imageUrl = item.directUrl;
      }
      else if (item.megaUrl) {
          imageUrl = generateMegaProxyUrl(item.megaUrl);
      } else if (eqPlaceholderImage) {
          imageUrl = eqPlaceholderImage.imageUrl;
          imageHint = eqPlaceholderImage.imageHint;
      }

      return { ...item, parsedImageUrl: imageUrl, parsedImageHint: imageHint };
    }).filter(item => item.parsedImageUrl !== '');
  }, []);

  const [magnifiedImageIndex, setMagnifiedImageIndex] = useState<number | null>(null);

  const showNextImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMagnifiedImageIndex((prevIndex) => {
      if (prevIndex === null) return null;
      return (prevIndex + 1) % allEquipment.length;
    });
  }, [allEquipment.length]);

  const showPrevImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMagnifiedImageIndex((prevIndex) => {
        if (prevIndex === null) return null;
        return (prevIndex - 1 + allEquipment.length) % allEquipment.length;
    });
  }, [allEquipment.length]);

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

  const currentEq = magnifiedImageIndex !== null ? allEquipment[magnifiedImageIndex] : null;

  return (
    <section id="facilities" className="py-20 sm:py-32">
      <div className="container mx-auto px-6">
        <AnimatedTitle className="text-3xl sm:text-4xl font-bold font-headline bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent mb-12 text-center">
          <div className="flex items-center justify-center gap-3">
            <Building className="w-8 h-8 text-primary" />
            Facilities
          </div>
        </AnimatedTitle>
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8 items-start">
          {facilities.map((facility, index) => {
            const image = PlaceHolderImages.find(p => p.id === facility.imageId);
            
            let darkImageUrl = (facility as any).darkImageUrl ?? '';
            if (darkImageUrl.startsWith('https://mega.nz')) {
              darkImageUrl = generateMegaProxyUrl(darkImageUrl);
            }
            
            let lightImageUrl = (facility as any).lightImageUrl ?? '';
            if (lightImageUrl.startsWith('https://mega.nz')) {
                lightImageUrl = generateMegaProxyUrl(lightImageUrl);
            }

            return (
              <AnimatedWrapper key={facility.name} delay={200 + index * 150}>
                <Card className="group bg-card/50 overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-500 flex flex-col h-full hover:scale-[1.02] hover:-translate-y-2 border-border/50">
                  <div className="aspect-[32/7] relative overflow-hidden">
                    {lightImageUrl && (
                      <Image
                        src={lightImageUrl}
                        alt={`${facility.name} (light)`}
                        fill
                        className="object-cover w-full h-full"
                        style={{ objectPosition: (facility as any).imagePosition || 'center' }}
                        data-ai-hint={image?.imageHint}
                      />
                    )}
                    {darkImageUrl && (
                      <Image
                        src={darkImageUrl}
                        alt={facility.name}
                        fill
                        className="object-cover w-full h-full transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                        style={{ objectPosition: (facility as any).imagePosition || 'center' }}
                        data-ai-hint={image?.imageHint}
                      />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-start gap-3">
                      <Beaker className="w-5 h-5 text-primary mt-1 shrink-0" />
                      <span>{facility.name}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-mono pt-2">
                      Lab Code: {facility.code}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <CardDescription className="flex-grow text-justify">{facility.description}</CardDescription>
                    {facility.equipment && facility.equipment.length > 0 && (
                      <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value={`equipment-${index}`}>
                          <AccordionTrigger>
                            <span className="flex items-center gap-2 text-sm font-semibold">
                              <Wrench 
                                className="w-4 h-4 animate-wiggle"
                                style={animationDelays[index] !== undefined ? { animationDelay: `${animationDelays[index]}s` } : {}}
                              />
                              Key Equipment
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="pt-4 px-2">
                            <Carousel
                              opts={{
                                align: "start",
                              }}
                              className="w-full"
                            >
                              <CarouselContent>
                                {facility.equipment.map((item: any) => {
                                  const eqPlaceholderImage = item.imageId ? PlaceHolderImages.find(p => p.id === item.imageId) : undefined;
                                  
                                  let imageUrl = '';
                                  let imageHint = '';

                                  if (item.directUrl) {
                                    imageUrl = item.directUrl;
                                  }
                                  else if (item.megaUrl) {
                                      imageUrl = generateMegaProxyUrl(item.megaUrl);
                                  } else if (eqPlaceholderImage) {
                                      imageUrl = eqPlaceholderImage.imageUrl;
                                      imageHint = eqPlaceholderImage.imageHint;
                                  }

                                  return (
                                    <CarouselItem key={item.name} className="sm:basis-1/2 md:basis-1/3">
                                      <div className="p-1">
                                        <div 
                                          className="aspect-square relative rounded-lg overflow-hidden bg-muted/20 group cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const eqIndex = allEquipment.findIndex(eq => eq.name === item.name && eq.parsedImageUrl === imageUrl);
                                            if (eqIndex > -1) setMagnifiedImageIndex(eqIndex);
                                          }}
                                        >
                                          {imageUrl && (
                                            <Image
                                              src={imageUrl}
                                              alt={item.name}
                                              fill
                                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                                              data-ai-hint={imageHint || undefined}
                                            />
                                          )}
                                        </div>
                                        <p
                                          className="text-xs text-center text-muted-foreground mt-2 leading-tight h-12"
                                          dangerouslySetInnerHTML={{ __html: item.name }}
                                        />
                                      </div>
                                    </CarouselItem>
                                  );
                                })}
                              </CarouselContent>
                              <CarouselPrevious className="ml-8" />
                              <CarouselNext className="mr-8"/>
                            </Carousel>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              </AnimatedWrapper>
            );
          })}
        </div>
      </div>

      {magnifiedImageIndex !== null && currentEq && (
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
                  src={currentEq.parsedImageUrl}
                  alt={currentEq.name}
                  fill
                  className="object-cover"
                  data-ai-hint={currentEq.parsedImageHint}
                />
              </div>
              <p className="mt-6 text-center font-playfair-display italic text-lg text-neutral-700" dangerouslySetInnerHTML={{ __html: currentEq.name }} />
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
