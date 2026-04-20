'use client';

import {
  collection,
  getDocs,
  query,
  limit,
  Firestore,
} from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { seedNews, seedHistory, seedHighlights, seedProjects, seedPublications, team as seedTeamData } from '@/lib/seed-data';
import { generateMegaProxyUrl } from '@/lib/mega-link';
import { TeamMember, HistoryMilestone } from '@/lib/types';


const SEED_KEYS = {
    news: 'firebase_studio_newsSeeded_v1',
    history: 'firebase_studio_historyMilestones_v1',
    highlights: 'firebase_studio_highlightsSeeded_v1',
    teamMembers: 'firebase_studio_teamMembersSeeded_v3',
    projects: 'firebase_studio_projectsSeeded_v1',
    publications: 'firebase_studio_publicationsSeeded_v1',
};

async function isCollectionEmpty(firestore: Firestore, collectionName: string): Promise<boolean> {
    try {
        const collectionRef = collection(firestore, collectionName);
        const q = query(collectionRef, limit(1));
        const snapshot = await getDocs(q);
        return snapshot.empty;
    } catch (error) {
        console.error(`Error checking if collection ${collectionName} is empty:`, error);
        // Assume not empty on error to prevent accidental re-seeding
        return false;
    }
}

async function seedCollection(
    firestore: Firestore,
    collectionName: string,
    seedKey: string,
    seedingFunction: () => void
) {
    if (typeof window === 'undefined') return;

    const hasBeenSeeded = localStorage.getItem(seedKey);
    if (hasBeenSeeded) {
        return;
    }

    console.log(`Checking if ${collectionName} needs seeding...`);
    if (await isCollectionEmpty(firestore, collectionName)) {
        console.log(`Seeding ${collectionName}...`);
        seedingFunction();
    }
    
    // Set the key regardless of whether we seeded or not,
    // to prevent checking the database on every page load.
    localStorage.setItem(seedKey, 'true');
}


export async function seedDatabase(firestore: Firestore) {
    
    // Seed News
    seedCollection(firestore, 'news_items', SEED_KEYS.news, () => {
        const newsCollectionRef = collection(firestore, 'news_items');
        seedNews.forEach(item => addDocumentNonBlocking(newsCollectionRef, item));
    });

    // Seed History & Group Photos
    seedCollection(firestore, 'history_milestones', SEED_KEYS.history, () => {
        const historyCollectionRef = collection(firestore, 'history_milestones');
        seedHistory.forEach(item => addDocumentNonBlocking(historyCollectionRef, item));
        seedTeamData.groupPhotos.forEach(photo => {
             const newPhoto: Omit<HistoryMilestone, 'id'> = {
                year: photo.year,
                title: `Group Photo ${photo.year}`,
                description: JSON.stringify({ isGroupPhoto: true, imagePosition: 'center' }),
                imageUrl: photo.megaUrl ? generateMegaProxyUrl(photo.megaUrl) : '',
            };
            addDocumentNonBlocking(historyCollectionRef, newPhoto);
        });
    });

    // Seed Highlights
    seedCollection(firestore, 'research_highlights', SEED_KEYS.highlights, () => {
        const highlightsCollectionRef = collection(firestore, 'research_highlights');
        seedHighlights.forEach(item => addDocumentNonBlocking(highlightsCollectionRef, item));
    });

     // Seed Projects
    seedCollection(firestore, 'projects', SEED_KEYS.projects, () => {
        const projectsCollectionRef = collection(firestore, 'projects');
        seedProjects.forEach(item => addDocumentNonBlocking(projectsCollectionRef, item));
    });

    // Seed Publications
    seedCollection(firestore, 'publications', SEED_KEYS.publications, () => {
        const pubsCollectionRef = collection(firestore, 'publications');
        seedPublications.forEach(item => addDocumentNonBlocking(pubsCollectionRef, item));
    });

    // Seed Team Members
    seedCollection(firestore, 'team_members', SEED_KEYS.teamMembers, () => {
        const membersCollectionRef = collection(firestore, 'team_members');

        seedTeamData.active.forEach((member, index) => {
            const nameParts = member.name.split(' ');
            const firstName = nameParts.shift() || '';
            const lastName = nameParts.join(' ');
            
            const newMember: Omit<TeamMember, 'id'> = {
                firstName,
                lastName,
                order: index,
                role: member.role,
                bio: member.bio || '',
                photoUrl: member.megaUrl ? generateMegaProxyUrl(member.megaUrl) : '',
                photoUrlHover: (member as any).megaUrlHover ? generateMegaProxyUrl((member as any).megaUrlHover) : '',
                isActive: true,
                startDate: new Date('2020-01-01').toISOString(),
                imagePosition: (member as any).imagePosition || '50% 50%',
                imageZoom: 1,
                imagePositionHover: (member as any).imagePosition || '50% 50%',
                imageZoomHover: 1,
            };
            addDocumentNonBlocking(membersCollectionRef, newMember);
        });

        let alumniOrderIndex = seedTeamData.active.length;
        Object.entries(seedTeamData.alumni).forEach(([year, alumniList]) => {
            alumniList.forEach(member => {
                const nameParts = member.name.split(' ');
                const firstName = nameParts.shift() || '';
                const lastName = nameParts.join(' ');
                
                 const newMember: Omit<TeamMember, 'id'> = {
                    firstName,
                    lastName,
                    order: alumniOrderIndex++,
                    role: member.role,
                    bio: '',
                    photoUrl: '',
                    isActive: false,
                    startDate: new Date(parseInt(year) - 1, 0, 1).toISOString(),
                    endDate: new Date(parseInt(year), 11, 31).toISOString(),
                    imagePosition: (member as any).imagePosition || '50% 50%',
                    imageZoom: 1,
                };
                addDocumentNonBlocking(membersCollectionRef, newMember);
            });
        });
    });
}
