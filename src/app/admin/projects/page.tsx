'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import ProjectForm from './ProjectForm';
import { useState } from 'react';
import { PlusCircle, Trash2, Edit, ExternalLink } from 'lucide-react';
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

export default function ProjectsAdminPage() {
  const firestore = useFirestore();
  
  const projectsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'projects'), orderBy('startDate', 'desc'));
  }, [firestore]);

  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Project | null>(null);

  const handleEdit = (item: Project) => {
    setSelectedProject(item);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedProject(null);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    const docRef = doc(firestore, 'projects', itemToDelete.id);
    deleteDocumentNonBlocking(docRef);
    setItemToDelete(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedProject(null);
  };

  if (showForm) {
    return <ProjectForm project={selectedProject} onClose={handleFormClose} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      {isLoading && <p>Loading projects...</p>}

      {!isLoading && projects && projects.length === 0 && (
          <Card className="text-center p-8">
              <CardTitle>No Projects Found</CardTitle>
              <CardDescription className="mt-2">
                  Click 'Add Project' to create the first one.
              </CardDescription>
          </Card>
      )}

      <div className="space-y-4 mt-4">
        {projects?.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle>{item.title}</CardTitle>
                        <div className="text-xs pt-2 flex items-center gap-x-4 text-muted-foreground">
                            <span className="font-mono text-primary">{item.status}</span>
                            <span>•</span>
                            <span>{format(new Date(item.startDate), 'MMM yyyy')} - {item.endDate ? format(new Date(item.endDate), 'MMM yyyy') : 'Present'}</span>
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
                     {(item.fundingSource || item.budget) && (
                        <div className="text-sm mt-4 space-y-1">
                            {item.fundingSource && <p><span className="font-semibold">Funder:</span> {item.fundingSource}</p>}
                            {item.budget && <p><span className="font-semibold">Budget:</span> {item.budget.toLocaleString('en-US')} PLN</p>}
                        </div>
                     )}
                     {item.externalLink && (
                         <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-4 flex items-center gap-1">
                            <ExternalLink className="w-4 h-4" />
                            <span>More Info</span>
                         </a>
                    )}
                </CardContent>
              </Card>
            )
        )}
      </div>
       <AlertDialog open={!!itemToDelete} onOpenChange={(isOpen) => !isOpen && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project: "{itemToDelete?.title}".
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
