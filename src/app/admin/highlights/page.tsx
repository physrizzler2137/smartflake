'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { ResearchHighlight } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import HighlightsForm from './HighlightsForm';
import { useState } from 'react';
import { PlusCircle, Trash2, Edit, ExternalLink } from 'lucide-react';
import Image from "next/image";
import { PlaceHolderImages } from '@/lib/placeholder-images';
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

export default function HighlightsAdminPage() {
  const firestore = useFirestore();
  
  const highlightsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'research_highlights'), orderBy('order', 'asc'));
  }, [firestore]);

  const { data: highlights, isLoading } = useCollection<ResearchHighlight>(highlightsQuery);

  const [showForm, setShowForm] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<ResearchHighlight | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ResearchHighlight | null>(null);

  const handleEdit = (item: ResearchHighlight) => {
    setSelectedHighlight(item);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedHighlight(null);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    const docRef = doc(firestore, 'research_highlights', itemToDelete.id);
    deleteDocumentNonBlocking(docRef);
    setItemToDelete(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedHighlight(null);
  };

  if (showForm) {
    return <HighlightsForm highlight={selectedHighlight} onClose={handleFormClose} highlightsCount={highlights?.length || 0} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Research Highlights</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Highlight
        </Button>
      </div>

      {isLoading && <p>Loading highlights...</p>}

      {!isLoading && highlights && highlights.length === 0 && (
          <Card className="text-center p-8">
              <CardTitle>No Highlights Found</CardTitle>
              <CardDescription className="mt-2">
                  Click 'Add Highlight' to create the first one.
              </CardDescription>
          </Card>
      )}

      <div className="space-y-4 mt-4">
        {highlights?.map((item) => {
            let image: { imageUrl: string, description: string } | null | undefined = null;
            if (item.imageUrl) {
                image = { imageUrl: item.imageUrl, description: item.title };
            } else if (item.imageId) {
                image = PlaceHolderImages.find(p => p.id === item.imageId);
            }

            return (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-4">
                      {image?.imageUrl && (
                        <div className="relative w-32 h-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                           <Image src={image.imageUrl} alt={item.title} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription className="text-xs pt-2 font-mono text-primary">{item.category}</CardDescription>
                      </div>
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
                     {item.link && (
                         <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-4 flex items-center gap-1">
                            <ExternalLink className="w-4 h-4" />
                            <span>{item.link}</span>
                         </a>
                    )}
                </CardContent>
              </Card>
            )
        })}
      </div>
       <AlertDialog open={!!itemToDelete} onOpenChange={(isOpen) => !isOpen && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the highlight: "{itemToDelete?.title}".
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
