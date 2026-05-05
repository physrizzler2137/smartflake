import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Newspaper, Milestone, Users, Sparkles, Lightbulb, BookMarked } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Manage News</CardTitle>
            <CardDescription>Create, edit, and delete news articles.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/news" className="flex items-center text-sm text-primary hover:underline">
              Go to News CMS <Newspaper className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage Highlights</CardTitle>
            <CardDescription>Create, edit, and feature research highlights.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/highlights" className="flex items-center text-sm text-primary hover:underline">
              Go to Highlights CMS <Sparkles className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Manage Projects</CardTitle>
            <CardDescription>Create, edit, and delete research projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/projects" className="flex items-center text-sm text-primary hover:underline">
              Go to Projects CMS <Lightbulb className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage Publications</CardTitle>
            <CardDescription>Create, edit, and delete publications.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/publications" className="flex items-center text-sm text-primary hover:underline">
              Go to Publications CMS <BookMarked className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage History</CardTitle>
            <CardDescription>Create, edit, and delete history milestones.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/history" className="flex items-center text-sm text-primary hover:underline">
              Go to History CMS <Milestone className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage Team</CardTitle>
            <CardDescription>Edit team members and group photos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/team" className="flex items-center text-sm text-primary hover:underline">
              Go to Team CMS <Users className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
