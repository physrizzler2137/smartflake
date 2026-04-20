'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { HistoryMilestone } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import HistoryForm from './HistoryForm';
import { useState } from 'react';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
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

export default function HistoryAdminPage() {
  const firestore = useFirestore();
  
  const historyCollectionQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'history_milestones'), orderBy('year', 'desc'));
  }, [firestore]);

  const { data: milestones, isLoading } = useCollection<HistoryMilestone>(historyCollectionQuery);

  const [showForm, setShowForm] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<HistoryMilestone | null>(null);
  const [itemToDelete, setItemToDelete] = useState<HistoryMilestone | null>(null);

  const handleEdit = (item: HistoryMilestone) => {
    setSelectedMilestone(item);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedMilestone(null);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    const docRef = doc(firestore, 'history_milestones', itemToDelete.id);
    deleteDocumentNonBlocking(docRef);
    setItemToDelete(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedMilestone(null);
  };

  if (showForm) {
    return <HistoryForm milestone={selectedMilestone} onClose={handleFormClose} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage History Milestones</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Milestone
        </Button>
      </div>

      {isLoading && <p>Loading milestones...</p>}

      <div className="space-y-4">
        {milestones?.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                    <CardTitle>{item.year} - {item.title}</CardTitle>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => setItemToDelete(item)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
       <AlertDialog open={!!itemToDelete} onOpenChange={(isOpen) => !isOpen && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the milestone: "{itemToDelete?.title}".
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
