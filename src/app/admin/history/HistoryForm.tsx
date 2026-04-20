'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HistoryMilestone } from '@/lib/types';
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

const milestoneSchema = z.object({
    year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 5),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    imageId: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
});

type MilestoneFormValues = z.infer<typeof milestoneSchema>;

interface HistoryFormProps {
    milestone?: HistoryMilestone | null;
    onClose: () => void;
}

export default function HistoryForm({ milestone, onClose }: HistoryFormProps) {
    const firestore = useFirestore();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<MilestoneFormValues>({
        resolver: zodResolver(milestoneSchema),
    });

    useEffect(() => {
        if (milestone) {
            reset(milestone);
        } else {
            reset({
                year: new Date().getFullYear(),
                title: '',
                description: '',
                imageId: '',
                imageUrl: '',
            });
        }
    }, [milestone, reset]);


    const historyCollectionRef = collection(firestore, 'history_milestones');

    const onSubmit = (data: MilestoneFormValues) => {
        if (milestone) {
            const docRef = doc(firestore, 'history_milestones', milestone.id);
            setDocumentNonBlocking(docRef, data, { merge: true });
        } else {
            addDocumentNonBlocking(historyCollectionRef, data);
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
                    <CardTitle>{milestone ? 'Edit Milestone' : 'Add Milestone'}</CardTitle>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" type="number" {...register('year')} />
                        {errors.year && <p className="text-destructive text-sm">{errors.year.message}</p>}
                    </div>
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
                        <Label htmlFor="imageId">Placeholder Image ID</Label>
                        <Input id="imageId" {...register('imageId')} placeholder="e.g., history-founded" />
                        <p className="text-xs text-muted-foreground">From src/lib/placeholder-images.json. Leave empty to use imageUrl.</p>
                        {errors.imageId && <p className="text-destructive text-sm">{errors.imageId.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input id="imageUrl" {...register('imageUrl')} placeholder="https://..." />
                        {errors.imageUrl && <p className="text-destructive text-sm">{errors.imageUrl.message}</p>}
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
