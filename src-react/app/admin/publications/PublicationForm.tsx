'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Publication } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

const publicationSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    authors: z.string().min(1, 'Authors are required (comma-separated)'),
    year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 5),
    journal: z.string().min(1, 'Journal/Conference is required'),
    journalLink: z.string().url().optional().or(z.literal('')),
    abstract: z.string().min(1, 'Abstract is required'),
    doi: z.string().optional(),
    externalLink: z.string().url().optional().or(z.literal('')),
    impactFactor: z.coerce.number().optional(),
    keywords: z.string().optional(),
});

type PublicationFormValues = z.infer<typeof publicationSchema>;

interface PublicationFormProps {
    publication?: Publication | null;
    onClose: () => void;
}

export default function PublicationForm({ publication, onClose }: PublicationFormProps) {
    const firestore = useFirestore();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<PublicationFormValues>({
        resolver: zodResolver(publicationSchema),
    });

    useEffect(() => {
        if (publication) {
            reset({
                ...publication,
                authors: publication.authors.join(', '),
                keywords: publication.keywords?.join(', '),
            });
        } else {
            reset({
                title: '',
                authors: '',
                year: new Date().getFullYear(),
                journal: '',
                journalLink: '',
                abstract: '',
                doi: '',
                externalLink: '',
                impactFactor: undefined,
                keywords: '',
            });
        }
    }, [publication, reset]);


    const publicationsCollectionRef = collection(firestore, 'publications');

    const onSubmit = (data: PublicationFormValues) => {
        const dataToSave = {
            ...data,
            authors: data.authors.split(',').map(a => a.trim()).filter(a => a),
            keywords: data.keywords?.split(',').map(k => k.trim()).filter(k => k) || [],
            impactFactor: data.impactFactor || undefined,
        };

        if (publication) {
            const docRef = doc(firestore, 'publications', publication.id);
            setDocumentNonBlocking(docRef, dataToSave, { merge: true });
        } else {
            addDocumentNonBlocking(publicationsCollectionRef, dataToSave);
        }
        onClose();
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <ArrowLeft />
                    </Button>
                    <CardTitle>{publication ? 'Edit Publication' : 'Add Publication'}</CardTitle>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register('title')} />
                        {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="authors">Authors</Label>
                        <Input id="authors" {...register('authors')} placeholder="P. Bartkowski, L. Pawliszak, ..." />
                        <p className="text-xs text-muted-foreground">Comma-separated list of authors.</p>
                        {errors.authors && <p className="text-destructive text-sm">{errors.authors.message as string}</p>}
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Input id="year" type="number" {...register('year')} />
                            {errors.year && <p className="text-destructive text-sm">{errors.year.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="impactFactor">Impact Factor</Label>
                            <Input id="impactFactor" type="number" step="0.01" {...register('impactFactor')} />
                            {errors.impactFactor && <p className="text-destructive text-sm">{errors.impactFactor.message}</p>}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="journal">Journal / Conference</Label>
                        <Input id="journal" {...register('journal')} />
                        {errors.journal && <p className="text-destructive text-sm">{errors.journal.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="journalLink">Journal Link</Label>
                        <Input id="journalLink" {...register('journalLink')} placeholder="https://..." />
                        {errors.journalLink && <p className="text-destructive text-sm">{errors.journalLink.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="abstract">Abstract</Label>
                        <Textarea id="abstract" rows={6} {...register('abstract')} />
                        {errors.abstract && <p className="text-destructive text-sm">{errors.abstract.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="doi">DOI</Label>
                        <Input id="doi" {...register('doi')} placeholder="10.1089/soro.2024.0098" />
                        {errors.doi && <p className="text-destructive text-sm">{errors.doi.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="externalLink">External Link (DOI Link)</Label>
                        <Input id="externalLink" {...register('externalLink')} placeholder="https://doi.org/..." />
                        {errors.externalLink && <p className="text-destructive text-sm">{errors.externalLink.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="keywords">Keywords</Label>
                        <Input id="keywords" {...register('keywords')} placeholder="Soft Robotics, Wearable Electronics, ..." />
                         <p className="text-xs text-muted-foreground">Comma-separated list of keywords.</p>
                        {errors.keywords && <p className="text-destructive text-sm">{errors.keywords.message}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
