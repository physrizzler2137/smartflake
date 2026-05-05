'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { NewsItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import NewsForm from './NewsForm';
import { useState } from 'react';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
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

export default function NewsAdminPage() {
  const firestore = useFirestore();
  
  const newsCollectionQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'news_items'), orderBy('date', 'desc'));
  }, [firestore]);

  const { data: newsItems, isLoading } = useCollection<NewsItem>(newsCollectionQuery);

  const [showForm, setShowForm] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<NewsItem | null>(null);

  const handleEdit = (item: NewsItem) => {
    setSelectedNews(item);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedNews(null);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    const docRef = doc(firestore, 'news_items', itemToDelete.id);
    deleteDocumentNonBlocking(docRef);
    setItemToDelete(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedNews(null);
  };

  if (showForm) {
    return <NewsForm newsItem={selectedNews} onClose={handleFormClose} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage News</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add News Item
        </Button>
      </div>

      {isLoading && <p>Loading news...</p>}

      <div className="space-y-4">
        {newsItems?.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                    <CardTitle>{item.title}</CardTitle>
                    <div className="text-sm text-muted-foreground mt-1 flex items-center gap-x-4">
                        <span>{format(new Date(item.date), 'PPP')}</span>
                        {item.location && (
                            <>
                                <span>•</span>
                                <span>{item.location}</span>
                            </>
                        )}
                        {item.author && (
                            <>
                                <span>•</span>
                                <span>By {item.author}</span>
                            </>
                        )}
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
              <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: item.content }} />
            </CardContent>
          </Card>
        ))}
      </div>
      <AlertDialog open={!!itemToDelete} onOpenChange={(isOpen) => !isOpen && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the news item: "{itemToDelete?.title}".
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
