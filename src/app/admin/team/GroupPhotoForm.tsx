'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HistoryMilestone } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

const groupPhotoSchema = z.object({
    year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 5),
    imageUrl: z.string().url().optional().or(z.literal('')),
});

type GroupPhotoFormValues = z.infer<typeof groupPhotoSchema>;

interface GroupPhotoFormProps {
    photo?: HistoryMilestone | null;
    onClose: () => void;
}

// This form manages HistoryMilestone entities that represent group photos.
// A special description format is used to identify them.
export default function GroupPhotoForm({ photo, onClose }: GroupPhotoFormProps) {
    const firestore = useFirestore();
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm<GroupPhotoFormValues>({
        resolver: zodResolver(groupPhotoSchema),
    });

    useEffect(() => {
        if (photo) {
            reset({
                year: photo.year,
                imageUrl: photo.imageUrl || '',
            });
        } else {
            reset({
                year: new Date().getFullYear(),
                imageUrl: '',
            });
        }
    }, [photo, reset]);

    const historyCollectionRef = collection(firestore, 'history_milestones');

    const onSubmit = (data: GroupPhotoFormValues) => {
        const milestoneData = {
            year: data.year,
            title: `Group Photo ${data.year}`,
            description: JSON.stringify({ isGroupPhoto: true, imagePosition: 'center' }),
            imageUrl: data.imageUrl,
            imageId: '', // Not used for group photos managed this way
        };

        if (photo) {
            const docRef = doc(firestore, 'history_milestones', photo.id);
            setDocumentNonBlocking(docRef, milestoneData, { merge: true });
        } else {
            addDocumentNonBlocking(historyCollectionRef, milestoneData);
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
                    <CardTitle>{photo ? 'Edit Group Photo' : 'Add Group Photo'}</CardTitle>
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
