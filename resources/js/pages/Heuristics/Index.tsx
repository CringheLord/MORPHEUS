import { Head, Link, router } from '@inertiajs/react';
import { ListFilter, CirclePlus } from 'lucide-react';
import React from 'react';
import HeuristicShow from '@/components/heuristics/heuristicShow';
import HeuristicsStats from '@/components/heuristics/heuristicsStats';
import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import HumanFactorTable from '@/pages/HumanFactors/humanFactorTable';

import { heuristics } from '@/routes';
import type { Heuristic, Paginated, HumanFactor, uiTag } from '@/types';




type Filters = {
    human_factor_id: string;
    tag_slug: string;
};

type Props = {
    heuristics: Paginated<Heuristic>;
    heuristics_all: Heuristic[];
    human_factors: HumanFactor[];
    tags: uiTag[];
    filters: Filters;
};

export default function Index ({ heuristics, heuristics_all, human_factors, filters, tags }: Props){
    const updateFilter =  (key: keyof Filters, value: string) => {
        router.get(
            '/heuristics',
            {
                ...filters,
                [key]: value,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        )
    }

    return (
        <>
            <Head title="Heuristics" />

            <div className="flex flex-col">
                <div className="m-8 mt-4 mb-2 flex flex-row justify-center gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="ml-12 flex flex-col">
                        <p></p>
                        <HeuristicsStats heuristics={heuristics_all} />
                    </div>
                    <div>
                        <div className="glass-card glass-primary overflow-hidden rounded-lg border border-primary bg-card shadow-sm">
                            <div className="border-outline-variant flex items-center justify-between border-b bg-surface-container-low p-6">
                                <div>
                                    <h3 className="font-headline text-on-background text-lg font-bold tracking-widest uppercase">
                                        Human Factors Indexing
                                    </h3>
                                    <p className="mt-1 text-xs tracking-tight text-card-foreground-secondary uppercase">
                                        Structured Architectural Components
                                        Audit Trail
                                    </p>
                                </div>
                                <div>
                                    <Input />
                                </div>
                            </div>
                            <div className="max-h-57 overflow-y-auto">
                                <table className="w-full border-collapse bg-muted text-left">
                                    <thead className="sticky top-0 z-10 bg-muted">
                                        <tr className="border-outline-variant border-b">
                                            <th className="py-4 pr-2 pl-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Identification Code
                                            </th>
                                            <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Core Attribute Name
                                            </th>
                                            <th className="px-8 py-4 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Category
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-outline-variant divide-y">
                                        {human_factors.map(
                                            (hf: {
                                                id: any;
                                                h_id?: string;
                                                title?: string;
                                                description?: string;
                                            }) => (
                                                <HumanFactorTable
                                                    key={hf.id}
                                                    humanFactor={hf}
                                                />
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="glass-card glass-secondary dark:glass-tertiary m-2 overflow-hidden rounded-xl border border-secondary bg-card">
                    <div className="border-outline-variant flex flex-col justify-between border-b p-6 md:flex-row md:items-center">
                        <h2 className="text-lg font-bold text-foreground">
                            Heuristic Inventory
                        </h2>

                        {/* scrollable filter bar */}
                        <div className="overflow-x-auto">
                            <div className="flex min-w-max flex-nowrap gap-4 pb-1">
                                <div className="relative shrink-0">
                                    <ListFilter className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />

                                    <select
                                        value={filters.human_factor_id}
                                        onChange={(e) =>
                                            updateFilter(
                                                'human_factor_id',
                                                e.target.value,
                                            )
                                        }
                                        className="border-outline-variant min-w-[180px] appearance-none rounded-lg border bg-muted py-2 pr-8 pl-10 text-sm text-foreground focus:ring-1 focus:ring-ring"
                                    >
                                        <option value="all">All Factors</option>
                                        {human_factors.map((hf) => (
                                            <option
                                                key={hf.id}
                                                value={String(hf.id)}
                                            >
                                                {hf.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="relative shrink-0">
                                    <ListFilter className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />

                                    <select
                                        value={filters.tag_slug}
                                        onChange={(e) =>
                                            updateFilter(
                                                'tag_slug',
                                                e.target.value,
                                            )
                                        }
                                        className="border-outline-variant min-w-[220px] appearance-none rounded-lg border bg-muted py-2 pr-8 pl-10 text-sm text-foreground focus:ring-1 focus:ring-ring"
                                    >
                                        <option value="all">All Tags</option>
                                        {tags.map((tag) => (
                                            <option
                                                key={tag.id}
                                                value={tag.slug}
                                            >
                                                {tag.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:opacity-90">
                                    <CirclePlus className="mr-2 inline size-5" />
                                    New Analysis
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-muted text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="py-4 pl-6">Title</th>
                                    <th className="py-4">Tags</th>
                                    <th className="px-6 py-4">Human Factor</th>
                                    <th className="px-6 py-4">
                                        Incidence Rate
                                    </th>
                                    <th className="px-6 py-4 pl-20 text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-outline-variant divide-y">
                                {heuristics.data.map((h) => (
                                    <HeuristicShow key={h.id} heuristic={h} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-outline-variant flex items-center justify-between border-t bg-muted p-4">
                        <p className="text-xs font-medium text-muted-foreground">
                            Showing {heuristics.from ?? 0}-{heuristics.to ?? 0}{' '}
                            of {heuristics.total} heuristics
                        </p>

                        <div className="flex gap-1">
                            {heuristics.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url ?? '#'}
                                    preserveScroll
                                    className={`rounded border px-3 py-1.5 text-sm ${
                                        link.active
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-outline-variant bg-background text-foreground'
                                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
Index.layout = {
    breadcrumbs: [
        {
            title:
                'Heuristics',
            href: '/heuristics',
        },
    ],
};

