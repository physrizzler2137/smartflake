'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Publication } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import PublicationForm from './PublicationForm';
import { useState } from 'react';
import { PlusCircle, Trash2, Edit, ExternalLink } from 'lucide-react';
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

export default function PublicationsAdminPage() {
  const firestore = useFirestore();
  
  const publicationsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'publications'), orderBy('year', 'desc'));
  }, [firestore]);

  const { data: publications, isLoading } = useCollection<Publication>(publicationsQuery);

  const [showForm, setShowForm] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Publication | null>(null);

  const handleEdit = (item: Publication) => {
    setSelectedPublication(item);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedPublication(null);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    const docRef = doc(firestore, 'publications', itemToDelete.id);
    deleteDocumentNonBlocking(docRef);
    setItemToDelete(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedPublication(null);
  };

  if (showForm) {
    return <PublicationForm publication={selectedPublication} onClose={handleFormClose} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Publications</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Publication
        </Button>
      </div>

      {isLoading && <p>Loading publications...</p>}

      {!isLoading && publications && publications.length === 0 && (
          <Card className="text-center p-8">
              <CardTitle>No Publications Found</CardTitle>
              <CardDescription className="mt-2">
                  Click 'Add Publication' to create the first one.
              </CardDescription>
          </Card>
      )}

      <div className="space-y-4 mt-4">
        {publications?.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription className="text-xs pt-2">
                            {item.year} • {item.journal}
                        </CardDescription>
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
                    <p className="text-sm italic text-muted-foreground">{item.authors.join(', ')}</p>
                    <p className="text-muted-foreground mt-4">{item.abstract}</p>
                </CardContent>
                 <CardFooter>
                     {item.externalLink && (
                         <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                            <ExternalLink className="w-4 h-4" />
                            <span>{item.doi ? `doi: ${item.doi}` : 'Read More'}</span>
                         </a>
                    )}
                 </CardFooter>
              </Card>
            )
        )}
      </div>
       <AlertDialog open={!!itemToDelete} onOpenChange={(isOpen) => !isOpen && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the publication: "{itemToDelete?.title}".
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
