'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NewsItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect } from 'react';

const newsSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    date: z.string().min(1, 'Date is required'),
    content: z.string().min(1, 'Content is required'),
    type: z.enum(['news', 'event', 'announcement']),
    author: z.string().optional(),
    location: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    externalLink: z.string().url().optional().or(z.literal('')),
    imageId: z.string().optional(),
});

type NewsFormValues = z.infer<typeof newsSchema>;

interface NewsFormProps {
    newsItem?: NewsItem | null;
    onClose: () => void;
}

export default function NewsForm({ newsItem, onClose }: NewsFormProps) {
    const firestore = useFirestore();
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<NewsFormValues>({
        resolver: zodResolver(newsSchema),
    });

    useEffect(() => {
        if (newsItem) {
            reset({
                ...newsItem,
                date: new Date(newsItem.date).toISOString().substring(0, 10),
            });
        } else {
            reset({
                title: '',
                date: new Date().toISOString().substring(0, 10),
                content: '',
                type: 'news',
                author: '',
                location: '',
                imageUrl: '',
                externalLink: '',
                imageId: '',
            });
        }
    }, [newsItem, reset]);


    const newsCollectionRef = collection(firestore, 'news_items');

    const onSubmit = (data: NewsFormValues) => {
        const dataToSave = {
            ...data,
            date: new Date(data.date).toISOString(),
        };

        if (newsItem) {
            const docRef = doc(firestore, 'news_items', newsItem.id);
            setDocumentNonBlocking(docRef, dataToSave, { merge: true });
        } else {
            addDocumentNonBlocking(newsCollectionRef, dataToSave);
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
                    <CardTitle>{newsItem ? 'Edit News Item' : 'Add News Item'}</CardTitle>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register('title')} />
                        {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" {...register('date')} />
                            {errors.date && <p className="text-destructive text-sm">{errors.date.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                             <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="news">News</SelectItem>
                                            <SelectItem value="event">Event</SelectItem>
                                            <SelectItem value="announcement">Announcement</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.type && <p className="text-destructive text-sm">{errors.type.message}</p>}
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="author">Author</Label>
                            <Input id="author" {...register('author')} />
                            {errors.author && <p className="text-destructive text-sm">{errors.author.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" {...register('location')} />
                            {errors.location && <p className="text-destructive text-sm">{errors.location.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Content (HTML allowed)</Label>
                        <Textarea id="content" {...register('content')} rows={10} />
                        {errors.content && <p className="text-destructive text-sm">{errors.content.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="imageId">Placeholder Image ID</Label>
                        <Input id="imageId" {...register('imageId')} placeholder="e.g., absurd-news-1" />
                        <p className="text-xs text-muted-foreground">From src/lib/placeholder-images.json. Leave empty to use imageUrl.</p>
                        {errors.imageId && <p className="text-destructive text-sm">{errors.imageId.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input id="imageUrl" {...register('imageUrl')} placeholder="https://..." />
                        {errors.imageUrl && <p className="text-destructive text-sm">{errors.imageUrl.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="externalLink">External Link</Label>
                        <Input id="externalLink" {...register('externalLink')} placeholder="https://..." />
                        {errors.externalLink && <p className="text-destructive text-sm">{errors.externalLink.message}</p>}
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
