'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TeamMember } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { ArrowLeft, Users } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

const memberSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    role: z.string().min(1, 'Role is required'),
    bio: z.string().optional(),
    photoUrl: z.string().url().optional().or(z.literal('')),
    imagePosition: z.string().optional(),
    imageZoom: z.coerce.number().min(1).max(5).optional(),
    photoUrlHover: z.string().url().optional().or(z.literal('')),
    imagePositionHover: z.string().optional(),
    imageZoomHover: z.coerce.number().min(1).max(5).optional(),
    isActive: z.boolean().default(true),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    externalLink: z.string().url().optional().or(z.literal('')),
});

type MemberFormValues = z.infer<typeof memberSchema>;

interface TeamMemberFormProps {
    member?: TeamMember | null;
    onClose: () => void;
    membersCount: number;
}

export default function TeamMemberForm({ member, onClose, membersCount }: TeamMemberFormProps) {
    const firestore = useFirestore();
    const [editingMode, setEditingMode] = useState<'default' | 'hover'>('default');

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<MemberFormValues>({
        resolver: zodResolver(memberSchema),
    });
    
    useEffect(() => {
        if (member) {
            const memberDefaults = {
                firstName: member.firstName || '',
                lastName: member.lastName || '',
                role: member.role || '',
                bio: member.bio || '',
                photoUrl: member.photoUrl || '',
                imagePosition: member.imagePosition || '50% 50%',
                imageZoom: member.imageZoom || 1,
                photoUrlHover: member.photoUrlHover || '',
                imagePositionHover: member.imagePositionHover || '50% 50%',
                imageZoomHover: member.imageZoomHover || 1,
                isActive: member.isActive === false ? false : true,
                startDate: new Date(member.startDate).toISOString().substring(0, 10),
                endDate: member.endDate ? new Date(member.endDate).toISOString().substring(0, 10) : '',
                externalLink: member.externalLink || '',
            };
            reset(memberDefaults);
        } else {
             reset({
                isActive: true,
                startDate: new Date().toISOString().substring(0, 10),
                bio: '',
                photoUrl: '',
                photoUrlHover: '',
                imagePosition: '50% 50%',
                imageZoom: 1,
                imagePositionHover: '50% 50%',
                imageZoomHover: 1,
            });
        }
    }, [member, reset]);


    const photoUrl = watch('photoUrl');
    const photoUrlHover = watch('photoUrlHover');
    const isActive = watch('isActive');
    
    // State for default photo
    const [posX, setPosX] = useState(50);
    const [posY, setPosY] = useState(50);
    const [zoom, setZoom] = useState(1);
    
    // State for hover photo
    const [posXHover, setPosXHover] = useState(50);
    const [posYHover, setPosYHover] = useState(50);
    const [zoomHover, setZoomHover] = useState(1);
    
    useEffect(() => {
        if (member) {
            const [xStr, yStr] = (member.imagePosition || '50% 50%').split(' ');
            setPosX(parseFloat(xStr));
            setPosY(parseFloat(yStr));
            setZoom(member.imageZoom || 1);
            
            const [xStrHover, yStrHover] = (member.imagePositionHover || '50% 50%').split(' ');
            setPosXHover(parseFloat(xStrHover));
            setPosYHover(parseFloat(yStrHover));
            setZoomHover(member.imageZoomHover || 1);
        }
    }, [member]);

    useEffect(() => {
        setValue('imagePosition', `${posX}% ${posY}%`);
        setValue('imageZoom', zoom);
    }, [posX, posY, zoom, setValue]);

    useEffect(() => {
        setValue('imagePositionHover', `${posXHover}% ${posYHover}%`);
        setValue('imageZoomHover', zoomHover);
    }, [posXHover, posYHover, zoomHover, setValue]);

    const handlePosXChange = useCallback((value: number[]) => {
        if (editingMode === 'default') setPosX(value[0]);
        else setPosXHover(value[0]);
    }, [editingMode]);

    const handlePosYChange = useCallback((value: number[]) => {
        if (editingMode === 'default') setPosY(value[0]);
        else setPosYHover(value[0]);
    }, [editingMode]);

    const handleZoomChange = useCallback((value: number[]) => {
        if (editingMode === 'default') setZoom(value[0]);
        else setZoomHover(value[0]);
    }, [editingMode]);


    const teamCollectionRef = collection(firestore, 'team_members');

    const onSubmit = (data: MemberFormValues) => {
        const dataToSave = {
            ...data,
            bio: data.bio || '',
            startDate: new Date(data.startDate).toISOString(),
            endDate: data.endDate ? new Date(data.endDate).toISOString() : '',
            imagePosition: data.imagePosition || '50% 50%',
            imageZoom: data.imageZoom || 1,
            photoUrlHover: data.photoUrlHover || '',
            imagePositionHover: data.imagePositionHover || '50% 50%',
            imageZoomHover: data.imageZoomHover || 1,
        };

        if (member) {
            const docRef = doc(firestore, 'team_members', member.id);
            setDocumentNonBlocking(docRef, dataToSave, { merge: true });
        } else {
            const dataWithOrder = {
                ...dataToSave,
                order: membersCount,
            };
            addDocumentNonBlocking(teamCollectionRef, dataWithOrder);
        }
        onClose();
    };

    const currentPhotoUrl = editingMode === 'default' ? photoUrl : photoUrlHover;
    const currentPosX = editingMode === 'default' ? posX : posXHover;
    const currentPosY = editingMode === 'default' ? posY : posYHover;
    const currentZoom = editingMode === 'default' ? zoom : zoomHover;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <ArrowLeft />
                    </Button>
                    <CardTitle>{member ? 'Edit Team Member' : 'Add Team Member'}</CardTitle>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                     <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                        <div className="flex justify-between items-center">
                            <Label>Photo Preview &amp; Positioning</Label>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="edit-mode" className="text-sm font-medium">
                                  {editingMode === 'default' ? 'Default' : 'Hover'}
                                </Label>
                                <Switch
                                    id="edit-mode"
                                    checked={editingMode === 'hover'}
                                    onCheckedChange={(checked) => setEditingMode(checked ? 'hover' : 'default')}
                                />
                            </div>
                        </div>
                         <div className="flex flex-col sm:flex-row gap-6 items-center">
                            <div
                                className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary bg-muted flex-shrink-0"
                            >
                               {currentPhotoUrl ? (
                                     <div
                                        className="w-full h-full bg-cover bg-no-repeat"
                                        style={{
                                            backgroundImage: `url(${currentPhotoUrl})`,
                                            backgroundPosition: `${currentPosX}% ${currentPosY}%`,
                                            backgroundSize: `${currentZoom * 100}%`,
                                        }}
                                    />
                               ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Users className="w-16 h-16 text-muted-foreground" />
                                    </div>
                               )}
                            </div>
                            <div className="flex-grow w-full space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Zoom ({currentZoom.toFixed(1)}x)</Label>
                                    <Slider
                                        value={[currentZoom]}
                                        onValueChange={handleZoomChange}
                                        min={1} max={5} step={0.05}
                                    />
                                </div>
                                 <div className="space-y-2">
                                    <Label className="text-xs">Horizontal ({currentPosX.toFixed(0)}%)</Label>
                                    <Slider
                                        value={[currentPosX]}
                                        onValueChange={handlePosXChange}
                                        max={100} step={1}
                                    />
                                </div>
                                 <div className="space-y-2">
                                    <Label className="text-xs">Vertical ({currentPosY.toFixed(0)}%)</Label>
                                    <Slider
                                        value={[currentPosY]}
                                        onValueChange={handlePosYChange}
                                        max={100} step={1}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="photoUrl">Default Photo URL</Label>
                        <Input id="photoUrl" {...register('photoUrl')} placeholder="https://..." />
                        {errors.photoUrl && <p className="text-destructive text-sm">{errors.photoUrl.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="photoUrlHover">Hover Photo URL (Optional)</Label>
                        <Input id="photoUrlHover" {...register('photoUrlHover')} placeholder="https://..." />
                        {errors.photoUrlHover && <p className="text-destructive text-sm">{errors.photoUrlHover.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" {...register('firstName')} />
                            {errors.firstName && <p className="text-destructive text-sm">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" {...register('lastName')} />
                            {errors.lastName && <p className="text-destructive text-sm">{errors.lastName.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" {...register('role')} />
                        {errors.role && <p className="text-destructive text-sm">{errors.role.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Biography</Label>
                        <Textarea id="bio" {...register('bio')} rows={5} />
                        {errors.bio && <p className="text-destructive text-sm">{errors.bio.message}</p>}
                    </div>

                     <div className="space-y-2">
                        <Label htmlFor="externalLink">External Link (e.g., LinkedIn)</Label>
                        <Input id="externalLink" {...register('externalLink')} placeholder="https://..." />
                        {errors.externalLink && <p className="text-destructive text-sm">{errors.externalLink.message}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="isActive" checked={isActive} onCheckedChange={(checked) => setValue('isActive', checked)} />
                        <Label htmlFor="isActive">Active Member</Label>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input id="startDate" type="date" {...register('startDate')} />
                            {errors.startDate && <p className="text-destructive text-sm">{errors.startDate.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date (for alumni)</Label>
                            <Input id="endDate" type="date" {...register('endDate')} />
                            {errors.endDate && <p className="text-destructive text-sm">{errors.endDate.message}</p>}
                        </div>
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
