'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useMemoFirebase, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { TeamMember, HistoryMilestone } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeamMemberForm from './TeamMemberForm';
import GroupPhotoForm from './GroupPhotoForm';
import { useState, useEffect, useRef, useMemo } from 'react';
import { PlusCircle, Trash2, Edit, Users, Camera, Search } from 'lucide-react';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';

interface TeamMembersListProps {
  onEdit: (member: TeamMember) => void;
}

function TeamMembersList({ onEdit }: TeamMembersListProps) {
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');

  const membersQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'team_members'), orderBy('order', 'asc'));
  }, [firestore]);

  const { data: members, isLoading } = useCollection<TeamMember>(membersQuery);

  const [localMembers, setLocalMembers] = useState<TeamMember[] | null>(null);
  const dragItem = useRef<string | null>(null);
  const dragOverItem = useRef<string | null>(null);

  useEffect(() => {
    if (members) {
      setLocalMembers([...members]);
    }
  }, [members]);

  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  const handleDelete = () => {
    if (!memberToDelete) return;
    const docRef = doc(firestore, 'team_members', memberToDelete.id);
    deleteDocumentNonBlocking(docRef);
    setMemberToDelete(null);
  };

  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null || !localMembers) return;
    if (dragItem.current === dragOverItem.current) return;
    
    const _localMembers = [...localMembers];
    const dragItemIndex = _localMembers.findIndex(m => m.id === dragItem.current);
    const dragOverItemIndex = _localMembers.findIndex(m => m.id === dragOverItem.current);

    if (dragItemIndex === -1 || dragOverItemIndex === -1) return;
    
    const draggedItemContent = _localMembers.splice(dragItemIndex, 1)[0];
    _localMembers.splice(dragOverItemIndex, 0, draggedItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;

    setLocalMembers(_localMembers);

    _localMembers.forEach((member, index) => {
        const docRef = doc(firestore, 'team_members', member.id);
        updateDocumentNonBlocking(docRef, { order: index });
    });
  };

  const filteredMembers = useMemo(() => {
    if (!localMembers) return [];
    if (!searchTerm) return localMembers;
    return localMembers.filter(member => {
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        const role = member.role.toLowerCase();
        const term = searchTerm.toLowerCase();
        return fullName.includes(term) || role.includes(term);
    });
  }, [localMembers, searchTerm]);

  return (
    <div>
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search by name or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
        </div>
        {isLoading && <p>Loading members...</p>}
        <div className="space-y-2">
            {filteredMembers.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => (dragItem.current = item.id)}
                onDragEnter={() => (dragOverItem.current = item.id)}
                onDragEnd={handleDragSort}
                onDragOver={(e) => e.preventDefault()}
                className="cursor-grab"
              >
                <Card className={!item.isActive ? 'bg-muted/50' : ''}>
                    <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-muted border border-border/50">
                                {item.photoUrl ? (
                                    <div
                                        className="w-full h-full bg-cover bg-no-repeat"
                                        style={{
                                            backgroundImage: `url(${item.photoUrl})`,
                                            backgroundPosition: item.imagePosition || '50% 50%',
                                            backgroundSize: `${(item.imageZoom || 1) * 100}%`,
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Users className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <CardTitle>{item.firstName} {item.lastName}</CardTitle>
                                <p className="text-muted-foreground">{item.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className={`text-sm font-semibold ${item.isActive ? 'text-green-500' : 'text-red-500'}`}>
                                {item.isActive ? 'Active' : 'Alumni'}
                            </p>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="icon" onClick={() => onEdit(item)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => setMemberToDelete(item)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    </CardHeader>
                </Card>
              </div>
            ))}
        </div>
        <AlertDialog open={!!memberToDelete} onOpenChange={(isOpen) => !isOpen && setMemberToDelete(null)}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the team member: "{memberToDelete?.firstName} {memberToDelete?.lastName}".
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}

interface GroupPhotosListProps {
    onEdit: (photo: HistoryMilestone) => void;
}

function GroupPhotosList({ onEdit }: GroupPhotosListProps) {
    const firestore = useFirestore();

    const photosQuery = useMemoFirebase(() => {
        return query(collection(firestore, 'history_milestones'), orderBy('year', 'desc'));
    }, [firestore]);

    const { data, isLoading } = useCollection<HistoryMilestone>(photosQuery);

    const groupPhotos = data?.filter(item => {
        try {
            const desc = JSON.parse(item.description);
            return desc.isGroupPhoto === true;
        } catch {
            return false;
        }
    }) || [];

  const [photoToDelete, setPhotoToDelete] = useState<HistoryMilestone | null>(null);

  const handleDelete = () => {
    if (!photoToDelete) return;
    const docRef = doc(firestore, 'history_milestones', photoToDelete.id);
    deleteDocumentNonBlocking(docRef);
    setPhotoToDelete(null);
  };

  return (
     <div>
        {isLoading && <p>Loading photos...</p>}
        <div className="space-y-2">
            {groupPhotos?.map((item) => (
            <Card key={item.id}>
                <CardHeader>
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="relative w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                                {item.imageUrl ? (
                                    <Image src={item.imageUrl} alt={`Group photo from ${item.year}`} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                        <Camera className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <CardTitle>Group Photo {item.year}</CardTitle>
                        </div>
                        <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => onEdit(item)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => setPhotoToDelete(item)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            ))}
        </div>
        <AlertDialog open={!!photoToDelete} onOpenChange={(isOpen) => !isOpen && setPhotoToDelete(null)}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the group photo from {photoToDelete?.year}.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


export default function TeamAdminPage() {
  const [activeTab, setActiveTab] = useState('members');
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<HistoryMilestone | null>(null);

  const firestore = useFirestore();
  const membersQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'team_members'), orderBy('order', 'asc'));
  }, [firestore]);
  const { data: members } = useCollection<TeamMember>(membersQuery);

  const handleAddNewMember = () => {
    setSelectedMember(null);
    setShowMemberForm(true);
  };
  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowMemberForm(true);
  };
  const handleMemberFormClose = () => {
    setShowMemberForm(false);
    setSelectedMember(null);
  };

  const handleAddNewPhoto = () => {
    setSelectedPhoto(null);
    setShowPhotoForm(true);
  };
  const handleEditPhoto = (photo: HistoryMilestone) => {
    setSelectedPhoto(photo);
    setShowPhotoForm(true);
  };
  const handlePhotoFormClose = () => {
    setShowPhotoForm(false);
    setSelectedPhoto(null);
  };

  if (showMemberForm) {
    return <TeamMemberForm member={selectedMember} onClose={handleMemberFormClose} membersCount={members?.length || 0} />;
  }
  if (showPhotoForm) {
    return <GroupPhotoForm photo={selectedPhoto} onClose={handlePhotoFormClose} />;
  }

  return (
    <div>
      <div className="flex justify-between items-baseline mb-8">
        <h1 className="text-3xl font-bold">Manage Team</h1>
        {activeTab === 'members' ? (
          <Button onClick={handleAddNewMember}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Member
          </Button>
        ) : (
          <Button onClick={handleAddNewPhoto}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Group Photo
          </Button>
        )}
      </div>

      <Tabs defaultValue="members" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-10">
            <TabsList className="bg-popover shadow-inner border border-black/20">
              <TabsTrigger value="members"><Users className="mr-2 h-4 w-4" />Members</TabsTrigger>
              <TabsTrigger value="photos"><Camera className="mr-2 h-4 w-4" />Group Photos</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="members">
          <TeamMembersList onEdit={handleEditMember} />
        </TabsContent>
        <TabsContent value="photos">
          <GroupPhotosList onEdit={handleEditPhoto} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
