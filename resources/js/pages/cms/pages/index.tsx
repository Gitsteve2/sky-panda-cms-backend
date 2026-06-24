import { Head, Link, router } from '@inertiajs/react';
import { Eye, FilePlus, Layout, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Page {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    is_system: boolean;
    sections_count: number;
    updated_at: string;
}

export default function PagesIndex({ pages }: { pages: Page[] }) {
    const deletePage = (page: Page) => {
        if (page.is_system) return;
        if (!confirm(`Delete page "${page.title}"?`)) return;
        router.delete(`/cms/pages/${page.id}`);
    };

    return (
        <>
            <Head title="Pages" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Pages</h1>
                        <p className="text-muted-foreground text-sm mt-1">Manage all website pages and their sections.</p>
                    </div>
                    <Button asChild>
                        <Link href="/cms/pages/create">
                            <FilePlus className="h-4 w-4 mr-2" />
                            New Page
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {pages.map((page) => (
                                <div key={page.id} className="flex items-center gap-4 px-6 py-4">
                                    <Layout className="h-5 w-5 text-muted-foreground shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{page.title}</span>
                                            {page.is_system && <Badge variant="secondary" className="text-xs">System</Badge>}
                                            <Badge variant={page.is_published ? 'default' : 'secondary'} className="text-xs">
                                                {page.is_published ? 'Published' : 'Draft'}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            /{page.slug} · {page.sections_count} section{page.sections_count !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/cms/pages/${page.id}/sections`}>
                                                <Eye className="h-4 w-4 mr-1" />
                                                Sections
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/cms/pages/${page.id}/edit`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        {!page.is_system && (
                                            <Button variant="ghost" size="sm" onClick={() => deletePage(page)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
