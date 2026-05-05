'use client';

import React, { useMemo } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Publication as PublicationType } from '@/lib/types';
import { BookMarked, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { AnimatedTitle } from '../layout/AnimatedTitle';
import { Skeleton } from '@/components/ui/skeleton';

export function Publications() {
  const firestore = useFirestore();
  
  const publicationsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'publications'), orderBy('year', 'desc'));
  }, [firestore]);

  const { data: publications, isLoading } = useCollection<PublicationType>(publicationsQuery);

  const publicationsByYear = useMemo(() => {
    if (!publications) return {};
    return publications.reduce((acc, pub) => {
      const year = pub.year.toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(pub);
      return acc;
    }, {} as Record<string, PublicationType[]>);
  }, [publications]);

  const sortedYears = Object.keys(publicationsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <section id="publications" className="py-20 sm:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <AnimatedTitle className="text-3xl sm:text-4xl font-bold font-headline bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent">
              <div className="flex items-center justify-center gap-3">
                <BookMarked className="w-8 h-8 text-primary" />
                Publications
              </div>
            </AnimatedTitle>
          </div>

          {isLoading && (
            <div className="space-y-8">
              <Skeleton className="h-8 w-1/4" />
              <div className="space-y-6">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          )}

          <div className="space-y-12">
            {sortedYears.map((year) => (
              <div key={year}>
                <h3 className="text-2xl font-bold font-headline mb-6 border-b border-border pb-3">{year}</h3>
                <ul className="space-y-6">
                  {publicationsByYear[year].map((pub) => (
                    <li key={pub.id} className="flex items-start gap-4">
                      <BookMarked className="w-5 h-5 text-primary mt-1 shrink-0"/>
                      <div>
                          <p className="font-semibold text-foreground">
                            {pub.externalLink ? (
                              <Link href={pub.externalLink} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 hover:text-primary transition-colors">
                                <span>{pub.title}</span>
                                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                            ) : (
                              pub.title
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {pub.authors.join(', ')}
                          </p>
                          <p className="text-sm text-primary/80 italic mt-1">
                            {pub.journalLink ? (
                              <Link href={pub.journalLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {pub.journal}
                              </Link>
                            ) : (
                              pub.journal
                            )}
                            {pub.doi && (
                              <span className="not-italic text-muted-foreground">
                                , doi: {pub.doi}
                              </span>
                            )}
                          </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
