'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo } from 'react';

const projectSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    status: z.enum(['Ongoing', 'Completed', 'Archived']),
    fundingSource: z.string().optional(),
    fundingSourceUrl: z.string().url().optional().or(z.literal('')),
    budget: z.coerce.number().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    externalLink: z.string().url().optional().or(z.literal('')),
    researchArea: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
    project?: Project | null;
    onClose: () => void;
}

export default function ProjectForm({ project, onClose }: ProjectFormProps) {
    const firestore = useFirestore();

    const defaultValues = useMemo(() => {
        if (project) {
            return {
                ...project,
                startDate: new Date(project.startDate).toISOString().substring(0, 10),
                endDate: project.endDate ? new Date(project.endDate).toISOString().substring(0, 10) : '',
            };
        }
        return {
            title: '',
            description: '',
            startDate: new Date().toISOString().substring(0, 10),
            endDate: '',
            status: 'Ongoing' as const,
            fundingSource: '',
            fundingSourceUrl: '',
            budget: undefined,
            imageUrl: '',
            externalLink: '',
            researchArea: '',
        };
    }, [project]);

    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues,
    });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);


    const projectsCollectionRef = collection(firestore, 'projects');

    const onSubmit = (data: ProjectFormValues) => {
        const dataToSave = {
            ...data,
            startDate: new Date(data.startDate).toISOString(),
            endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
            budget: typeof data.budget === 'number' && !isNaN(data.budget) ? data.budget : undefined,
        };

        if (project) {
            const docRef = doc(firestore, 'projects', project.id);
            setDocumentNonBlocking(docRef, dataToSave, { merge: true });
        } else {
            addDocumentNonBlocking(projectsCollectionRef, dataToSave);
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
                    <CardTitle>{project ? 'Edit Project' : 'Add Project'}</CardTitle>
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
                        <Textarea id="description" {...register('description')} />
                        {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input id="startDate" type="date" {...register('startDate')} />
                            {errors.startDate && <p className="text-destructive text-sm">{errors.startDate.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input id="endDate" type="date" {...register('endDate')} />
                            {errors.endDate && <p className="text-destructive text-sm">{errors.endDate.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Ongoing">Ongoing</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.status && <p className="text-destructive text-sm">{errors.status.message}</p>}
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fundingSource">Funding Source</Label>
                            <Input id="fundingSource" {...register('fundingSource')} />
                            {errors.fundingSource && <p className="text-destructive text-sm">{errors.fundingSource.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="budget">Budget (PLN)</Label>
                            <Input id="budget" type="number" {...register('budget')} />
                            {errors.budget && <p className="text-destructive text-sm">{errors.budget.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fundingSourceUrl">Funding Source URL</Label>
                        <Input id="fundingSourceUrl" {...register('fundingSourceUrl')} placeholder="https://..." />
                        {errors.fundingSourceUrl && <p className="text-destructive text-sm">{errors.fundingSourceUrl.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="researchArea">Research Area</Label>
                        <Input id="researchArea" {...register('researchArea')} placeholder="e.g., Soft Robotics, Wearable Electronics" />
                        {errors.researchArea && <p className="text-destructive text-sm">{errors.researchArea.message}</p>}
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
