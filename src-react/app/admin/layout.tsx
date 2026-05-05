'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { Home, Newspaper, LogOut, Milestone, Users, Sparkles, Lightbulb, BookMarked } from 'lucide-react';

function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const auth = useAuth();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }
    
    const handleSignOut = async () => {
        await auth.signOut();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-muted/40">
            <div className="flex">
                <aside className="w-64 bg-background p-4 border-r flex flex-col h-screen">
                    <nav className="flex flex-col space-y-2">
                        <h2 className="text-lg font-bold font-headline mb-4">CMS</h2>
                        <Button variant="ghost" className="justify-start" asChild>
                            <Link href="/admin"><Home className="mr-2 h-4 w-4" />Dashboard</Link>
                        </Button>
                        <Button variant="ghost" className="justify-start" asChild>
                            <Link href="/admin/news"><Newspaper className="mr-2 h-4 w-4" />News</Link>
                        </Button>
                        <Button variant="ghost" className="justify-start" asChild>
                            <Link href="/admin/highlights"><Sparkles className="mr-2 h-4 w-4" />Highlights</Link>
                        </Button>
                         <Button variant="ghost" className="justify-start" asChild>
                            <Link href="/admin/projects"><Lightbulb className="mr-2 h-4 w-4" />Projects</Link>
                        </Button>
                         <Button variant="ghost" className="justify-start" asChild>
                            <Link href="/admin/publications"><BookMarked className="mr-2 h-4 w-4" />Publications</Link>
                        </Button>
                        <Button variant="ghost" className="justify-start" asChild>
                            <Link href="/admin/history"><Milestone className="mr-2 h-4 w-4" />History</Link>
                        </Button>
                        <Button variant="ghost" className="justify-start" asChild>
                            <Link href="/admin/team"><Users className="mr-2 h-4 w-4" />Team</Link>
                        </Button>
                    </nav>
                    <div className="mt-auto pt-4 border-t">
                         <Button variant="ghost" className="justify-start w-full" asChild>
                            <Link href="/"><Home className="mr-2 h-4 w-4" />Back to Site</Link>
                        </Button>
                        <Button variant="ghost" className="justify-start w-full" onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />Sign Out
                        </Button>
                    </div>
                </aside>
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
