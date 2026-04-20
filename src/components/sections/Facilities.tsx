"use client";

import { useEffect, useState } from "react";
import { facilities } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Beaker, Wrench, Building } from "lucide-react";
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

  return (
    <section id="facilities" className="py-20 sm:py-32">
      <div className="container mx-auto px-6">
        <AnimatedTitle className="text-3xl sm:text-4xl font-bold font-headline bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent mb-12 text-center">
          <div className="flex items-center justify-center gap-3">
            <Building className="w-8 h-8 text-primary" />
            Facilities
          </div>
        </AnimatedTitle>
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8 items-start [perspective:1000px]">
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
                <Card className="group bg-card/50 overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-500 flex flex-col h-full [transform-style:preserve-3d] hover:[transform:rotateY(-10deg)_rotateX(3deg)_scale(1.05)]">
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
                        <AccordionItem value="equipment">
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
                                        <div className="aspect-square relative rounded-lg overflow-hidden bg-muted/20 group">
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
    </section>
  );
}
