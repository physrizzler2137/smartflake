'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ResearchHighlight } from '@/lib/types';
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

const highlightSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    link: z.string().url().optional().or(z.literal('')),
    imageId: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
});

type HighlightFormValues = z.infer<typeof highlightSchema>;

interface HighlightsFormProps {
    highlight?: ResearchHighlight | null;
    onClose: () => void;
    highlightsCount: number;
}

export default function HighlightsForm({ highlight, onClose, highlightsCount }: HighlightsFormProps) {
    const firestore = useFirestore();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<HighlightFormValues>({
        resolver: zodResolver(highlightSchema),
    });

    useEffect(() => {
        if (highlight) {
            reset(highlight);
        } else {
            reset({
                title: '',
                description: '',
                category: '',
                link: '',
                imageId: '',
                imageUrl: '',
            });
        }
    }, [highlight, reset]);

    const highlightsCollectionRef = collection(firestore, 'research_highlights');

    const onSubmit = (data: HighlightFormValues) => {
        if (highlight) {
            const docRef = doc(firestore, 'research_highlights', highlight.id);
            setDocumentNonBlocking(docRef, data, { merge: true });
        } else {
             const dataWithOrder = {
                ...data,
                order: highlightsCount,
            };
            addDocumentNonBlocking(highlightsCollectionRef, dataWithOrder);
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
                    <CardTitle>{highlight ? 'Edit Highlight' : 'Add Highlight'}</CardTitle>
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
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register('description')} rows={5} />
                        {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" {...register('category')} placeholder="e.g., Publication Highlight" />
                        {errors.category && <p className="text-destructive text-sm">{errors.category.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="imageId">Placeholder Image ID</Label>
                        <Input id="imageId" {...register('imageId')} placeholder="e.g., project-robot-taste" />
                        <p className="text-xs text-muted-foreground">From src/lib/placeholder-images.json.</p>
                        {errors.imageId && <p className="text-destructive text-sm">{errors.imageId.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input id="imageUrl" {...register('imageUrl')} placeholder="https://..." />
                        <p className="text-xs text-muted-foreground">Overrides placeholder image if both are provided.</p>
                        {errors.imageUrl && <p className="text-destructive text-sm">{errors.imageUrl.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="link">Link</Label>
                        <Input id="link" {...register('link')} placeholder="https://..." />
                        {errors.link && <p className="text-destructive text-sm">{errors.link.message}</p>}
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
