export type NewsItem = {
    id: string;
    title: string;
    date: string; // ISO string
    content: string;
    type: 'news' | 'event' | 'announcement';
    imageUrl?: string;
    externalLink?: string;
    location?: string;
    author?: string;
    imageId?: string; // To link to placeholder images
};

export type HistoryMilestone = {
    id:string;
    year: number;
    title: string;
    description: string;
    imageId?: string;
    imageUrl?: string;
};

export type TeamMember = {
    id: string;
    firstName: string;
    lastName: string;
    order?: number;
    role: string;
    bio: string;
    photoUrl: string;
    isActive: boolean;
    startDate: string; // ISO string
    endDate?: string; // ISO string
    externalLink?: string;
    imagePosition?: string;
    imageZoom?: number;
    photoUrlHover?: string;
    imagePositionHover?: string;
    imageZoomHover?: number;
};

export type GroupPhoto = {
    id: string;
    year: number;
    imageUrl?: string;
    imagePosition?: string;
};

export type ResearchHighlight = {
    id: string;
    title: string;
    description: string;
    category: string;
    link?: string;
    imageId?: string;
    imageUrl?: string;
    order?: number;
};
    
export type Project = {
    id: string;
    title: string;
    description: string;
    startDate: string; // ISO string
    endDate?: string; // ISO string
    status: 'Ongoing' | 'Completed' | 'Archived';
    imageUrl?: string;
    externalLink?: string;
    fundingSource?: string;
    fundingSourceUrl?: string;
    budget?: number;
    researchArea?: string;
};

export type Publication = {
    id: string;
    title: string;
    authors: string[];
    year: number;
    journal: string;
    abstract: string;
    doi?: string;
    externalLink?: string;
    journalLink?: string;
    impactFactor?: number;
    keywords?: string[];
};
