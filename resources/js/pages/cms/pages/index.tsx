import { Head, Link, router } from '@inertiajs/react';
import { Eye, FilePlus, FileText, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
                        <p className="text-muted-foreground mt-1">Manage all website pages and their content sections.</p>
                    </div>
                    <Button asChild>
                        <Link href="/cms/pages/create">
                            <FilePlus className="h-4 w-4 mr-2" />
                            New Page
                        </Link>
                    </Button>
                </div>

                {pages.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border py-20 text-center">
                        <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">No pages yet.</p>
                        <Button asChild className="mt-4" variant="outline">
                            <Link href="/cms/pages/create">Create your first page</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="rounded-xl border border-border overflow-hidden bg-card">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/40">
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Page</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Sections</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Updated</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {pages.map((page) => (
                                    <tr key={page.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <FileText className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">{page.title}</div>
                                                    <div className="text-xs text-muted-foreground">/{page.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <span className="text-sm text-muted-foreground">{page.sections_count} section{page.sections_count !== 1 ? 's' : ''}</span>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-sm text-muted-foreground">{new Date(page.updated_at).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {page.is_system && (
                                                    <Badge variant="secondary" className="text-xs">System</Badge>
                                                )}
                                                <Badge
                                                    className={`text-xs ${page.is_published ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}
                                                    variant="outline"
                                                >
                                                    {page.is_published ? 'Published' : 'Draft'}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/cms/pages/${page.id}/sections`}>
                                                        <Eye className="h-4 w-4" />
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
