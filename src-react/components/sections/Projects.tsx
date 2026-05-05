'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Project } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Calendar, Landmark, Banknote, ExternalLink } from "lucide-react";
import { AnimatedTitle } from "../layout/AnimatedTitle";
import { AnimatedWrapper } from "../layout/AnimatedWrapper";
import Link from "next/link";
import { Skeleton } from '@/components/ui/skeleton';

const ProjectSkeleton = () => (
    <Card className="flex flex-col bg-card shadow-lg h-full">
        <CardHeader>
            <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
                <Skeleton className="w-4 h-4 mt-1 rounded-full" />
                <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex items-center gap-3">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex items-center gap-3">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="h-4 w-1/3" />
            </div>
        </CardContent>
    </Card>
)

export function Projects() {
  const firestore = useFirestore();

  const projectsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'projects'), orderBy('startDate', 'desc'));
  }, [firestore]);

  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  return (
    <section id="projects" className="py-20 sm:py-32 bg-secondary/10">
      <div className="container mx-auto px-6">
        <AnimatedTitle className="text-3xl sm:text-4xl font-bold font-headline bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent mb-12 text-center">
          <div className="flex items-center justify-center gap-3">
            <Lightbulb className="w-8 h-8 text-primary" />
            Projects
          </div>
        </AnimatedTitle>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            {isLoading && (
              <>
                <ProjectSkeleton />
                <ProjectSkeleton />
                <ProjectSkeleton />
                <ProjectSkeleton />
              </>
            )}
            {projects?.map((project, index) => (
              <AnimatedWrapper key={project.id} delay={100 + index * 100}>
                <Card className="flex flex-col bg-card shadow-lg hover:shadow-primary/20 transition-shadow duration-300 h-full">
                  <CardHeader>
                    <CardTitle className="font-headline text-lg">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-muted-foreground flex-grow">
                    {project.fundingSource && (
                        <div className="flex items-start gap-3">
                        <Landmark className="w-4 h-4 text-primary mt-1 shrink-0" />
                        <p className="flex-1">
                            <span className="font-semibold text-foreground/90">Funding provided by: </span>
                            {project.fundingSourceUrl ? (
                                <Link href={project.fundingSourceUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                                <span>{project.fundingSource}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ) : (
                                <span>{project.fundingSource}</span>
                            )}
                        </p>
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-primary" />
                      <p>
                          <span className="font-semibold text-foreground/90">Duration: </span>
                          {new Date(project.startDate).getFullYear()} - {project.endDate ? new Date(project.endDate).getFullYear() : 'Ongoing'}
                      </p>
                    </div>
                    {project.budget > 0 && (
                        <div className="flex items-center gap-3">
                        <Banknote className="w-4 h-4 text-primary" />
                        <p>
                            <span className="font-semibold text-foreground/90">Budget: </span>
                            {project.budget.toLocaleString('en-US')} PLN
                        </p>
                        </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
