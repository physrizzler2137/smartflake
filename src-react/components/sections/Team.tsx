'use client';

import React, { useMemo } from "react";
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { TeamMember, HistoryMilestone } from '@/lib/types';
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, GraduationCap, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

function MemberCard({ member }: { member: TeamMember }) {
  const imageHint = 'profile picture';
  const isSpecialMember = member.firstName === 'Gözen' || member.firstName === 'Maja';

  return (
    <Card className="group text-center bg-card shadow-lg hover:shadow-primary/20 transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="items-center">
        <div className={cn(
          "relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary bg-muted",
          isSpecialMember && "group-hover:animate-washing-machine"
        )}>
            {member.photoUrl ? (
              <>
                <div
                    className={cn(
                        "absolute inset-0 w-full h-full bg-cover bg-no-repeat",
                        !isSpecialMember && "transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0"
                    )}
                    style={{
                        backgroundImage: `url(${member.photoUrl})`,
                        backgroundPosition: member.imagePosition || '50% 50%',
                        backgroundSize: `${(member.imageZoom || 1) * 100}%`,
                    }}
                />
                {member.photoUrlHover && !isSpecialMember && (
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-no-repeat transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
                        style={{
                            backgroundImage: `url(${member.photoUrlHover})`,
                            backgroundPosition: member.imagePositionHover || member.imagePosition || '50% 50%',
                            backgroundSize: `${(member.imageZoomHover || member.imageZoom || 1) * 100}%`,
                        }}
                    />
                )}
              </>
            ) : (
                 <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-muted-foreground" />
                </div>
            )}
          </div>
        <CardTitle className="font-headline pt-4 text-xl">
            <div className="flex items-center justify-center gap-2">
                <span>{member.firstName} {member.lastName}</span>
            </div>
        </CardTitle>
        <CardDescription>{member.role}</CardDescription>
      </CardHeader>
      {member.bio && (
        <CardContent className="flex-grow">
           <div 
            className="text-sm text-muted-foreground text-justify"
            dangerouslySetInnerHTML={{ __html: member.bio }}
          />
        </CardContent>
      )}
    </Card>
  );
}

function AlumniCard({ member }: { member: TeamMember }) {
  const seaCreatures = ['🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🦭'];
  
  const charCodeSum = (member.firstName + member.lastName).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const creature = seaCreatures[charCodeSum % seaCreatures.length];

  const svg = `<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="56px">${creature}</text></svg>`;
  
  const imageUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  const imageHint = 'sea creature avatar';

  return (
    <div className="group flex flex-col items-center text-center">
      <div className="relative w-24 h-24">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:animate-image-ripple">
          {member.photoUrl ? (
             <Image
                src={member.photoUrl}
                alt={`Avatar for ${member.firstName} ${member.lastName}`}
                width={96}
                height={96}
                className="object-cover"
             />
          ) : (
            <Image
                src={imageUrl}
                alt={`Avatar for ${member.firstName} ${member.lastName} showing a ${creature} emoji`}
                width={96}
                height={96}
                className="object-cover"
                data-ai-hint={imageHint}
            />
          )}
        </div>
      </div>
      <p className="font-semibold mt-2 text-sm">{member.firstName} {member.lastName}</p>
      <p className="text-xs text-muted-foreground">{member.role}</p>
    </div>
  );
}

function GroupPhotoCard({ photo }: { photo: { year: number; imageUrl?: string, imagePosition?: string } }) {
    const aspectClassName = photo.year === 2024 ? 'aspect-[3/4]' : 'aspect-[4/3]';

    return (
        <div>
            {photo.imageUrl ? (
                <div className={cn("relative rounded-lg overflow-hidden shadow-lg", aspectClassName)}>
                    <Image
                        src={photo.imageUrl}
                        alt={`Group photo from ${photo.year}`}
                        fill
                        className="object-cover"
                        style={{ objectPosition: photo.imagePosition || 'center' }}
                    />

                </div>
            ) : (
              <div className={cn("relative rounded-lg overflow-hidden shadow-lg bg-muted animate-pulse", aspectClassName)} />
            )}
            <h4 className="font-headline text-xl text-center mt-4">{photo.year}</h4>
        </div>
    );
}

const MemberSkeleton = () => (
    <Card className="text-center bg-card h-full flex flex-col">
        <CardHeader className="items-center">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-6 w-3/4 mt-4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="flex-grow">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-5/6 mt-2" />
        </CardContent>
    </Card>
);

const GroupPhotoSkeleton = () => (
    <div>
        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
        <Skeleton className="h-6 w-1/4 mt-4 mx-auto" />
    </div>
)

export function Team() {
    const firestore = useFirestore();

    const membersQuery = useMemoFirebase(() => {
        return query(collection(firestore, 'team_members'), orderBy('order', 'asc'));
    }, [firestore]);
    const { data: members, isLoading: isLoadingMembers } = useCollection<TeamMember>(membersQuery);

    const groupPhotosQuery = useMemoFirebase(() => {
        return query(collection(firestore, 'history_milestones'), orderBy('year', 'desc'));
    }, [firestore]);
    const { data: milestones, isLoading: isLoadingPhotos } = useCollection<HistoryMilestone>(groupPhotosQuery);

    const activeMembers = useMemo(() => members?.filter(m => m.isActive) || [], [members]);
    
    const alumniByYear = useMemo(() => {
        const alumni = members?.filter(m => !m.isActive) || [];
        return alumni.reduce((acc, member) => {
            const year = member.endDate ? new Date(member.endDate).getFullYear() : 'Unknown';
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(member);
            return acc;
        }, {} as Record<string, TeamMember[]>);
    }, [members]);

    const alumniYears = useMemo(() => Object.keys(alumniByYear).sort((a,b) => Number(b) - Number(a)), [alumniByYear]);

    const groupPhotos = useMemo(() => {
       return milestones?.map(item => {
            try {
                const desc = JSON.parse(item.description);
                if (desc.isGroupPhoto) {
                    return {
                        id: item.id,
                        year: item.year,
                        imageUrl: item.imageUrl,
                        imagePosition: desc.imagePosition,
                    }
                }
            } catch {}
            return null;
        }).filter(Boolean) as ({id: string, year: number, imageUrl?:string, imagePosition?: string})[] | undefined;
    }, [milestones]);


  return (
    <section id="team" className="py-20 sm:py-32 bg-card/20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold font-headline bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent mb-12 flex items-center justify-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          Meet the Team
        </h2>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="active" className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="bg-popover shadow-inner border border-black/20">
                <TabsTrigger value="active">
                  <Users className="w-4 h-4 mr-2" />
                  Active Members
                </TabsTrigger>
                <TabsTrigger value="alumni">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Alumni
                </TabsTrigger>
                <TabsTrigger value="groups">
                  <Camera className="w-4 h-4 mr-2" />
                  Group Photos
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="active">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {isLoadingMembers ? (
                    Array.from({length: 4}).map((_, i) => <MemberSkeleton key={i}/>)
                ) : (
                    activeMembers.map((member) => (
                        <MemberCard key={member.id} member={member} />
                    ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="alumni">
              <div className="space-y-12">
                 {isLoadingMembers ? (
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-center">
                        {Array.from({length: 6}).map((_, i) => (
                             <div key={i} className="flex flex-col items-center space-y-2">
                                <Skeleton className="w-24 h-24 rounded-full"/>
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        ))}
                     </div>
                 ) : (
                    alumniYears.map((year) => (
                    <div key={year}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-center">
                        {alumniByYear[year].map((member) => (
                            <AlumniCard key={member.id} member={member} />
                        ))}
                        </div>
                        <h3 className="text-2xl font-bold font-headline mt-6 border-t border-border pt-3 text-center">{year}</h3>
                    </div>
                    ))
                 )}
              </div>
            </TabsContent>

            <TabsContent value="groups">
               <div className="grid md:grid-cols-1 gap-8">
                  {isLoadingPhotos ? (
                      <GroupPhotoSkeleton />
                  ) : (
                    groupPhotos?.map((photo) => (
                        <GroupPhotoCard key={photo.id} photo={photo} />
                    ))
                  )}
               </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
