import { Head, Link, router } from '@inertiajs/react';
import { Search, SquarePlus, FolderPlus, ChevronsLeft } from 'lucide-react';
import React from 'react';
import { route } from 'ziggy-js';
import ScCard from '@/components/studyCase/sc-card';
import { Button } from '@/components/ui/button';

import studyCases from '@/routes/study-cases';

import type { StudyCase, Paginated} from '@/types';


type Props = {
    StudyCases: Paginated<StudyCase>;
    AvgSC: number | null;
    totalSC: number | null;
};

export default function Index( { StudyCases, totalSC, AvgSC }: Props) {
    const avgRisk = Number(AvgSC ?? 0).toFixed(2);
    const cases = StudyCases?.data ?? [];
    //const activeAnalysis = StudyCases

    return (
        <>
            <Head title="Study Cases" />
            <div className="flex flex-row-reverse">
                <div className="mt-10 mr-6 ml-2 flex flex-col justify-center gap-4">
                    <div className="mb-10 flex flex-col justify-between gap-4 md:flex-col md:items-center">
                        <div className="">
                            <h1 className="text-on-surface mb-2 pr-5 pb-2 pl-5 text-4xl font-extrabold tracking-tight">
                                Study Cases
                            </h1>
                            <p className="max-w-2xl pr-5 pl-5 text-card-foreground">
                                Audit and manage human factor analysis for
                                digital interfaces. Track cognitive load, trust
                                heuristics, and decision-making friction.
                            </p>
                        </div>
                    </div>
                    <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col justify-between rounded-xl border border-muted bg-card p-6 shadow-sm md:col-span-1">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="material-symbols-outlined bg-primary-fixed rounded-lg p-2 text-primary">
                                    folder_open
                                </span>
                                <span className="bg-primary-fixed rounded px-2 py-1 text-xs font-bold text-primary">
                                    +12%
                                </span>
                            </div>
                            <div>
                                <span className="text-on-surface-variant text-sm font-medium">
                                    Total Cases
                                </span>
                                <p className="mt-1 text-3xl font-black">
                                    {totalSC}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between rounded-xl border border-primary bg-card p-6 shadow-sm md:col-span-1">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="material-symbols-outlined bg-secondary-fixed rounded-lg p-2 text-secondary">
                                    insights
                                </span>
                                <span className="bg-secondary-fixed rounded px-2 py-1 text-xs font-bold text-secondary">
                                    Active
                                </span>
                            </div>
                            <div>
                                <span className="text-on-surface-variant text-sm font-medium">
                                    Active Analyses
                                </span>
                                <p className="mt-1 text-3xl font-black">32</p>
                            </div>
                        </div>
                        <div className="border-surface-variant flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm md:col-span-1">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="material-symbols-outlined bg-tertiary-fixed rounded-lg p-2 text-tertiary">
                                    task_alt
                                </span>
                                <span className="bg-tertiary-fixed rounded px-2 py-1 text-xs font-bold text-tertiary">
                                    Weekly
                                </span>
                            </div>
                            <div>
                                <span className="text-on-surface-variant text-sm font-medium">
                                    Completed Audits
                                </span>
                                <p className="mt-1 text-3xl font-black">
                                    1,024
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between rounded-xl border border-secondary bg-card p-6 text-card-foreground shadow-lg md:col-span-1">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="material-symbols-outlined rounded-lg bg-white/20 p-2">
                                    warning
                                </span>
                                <span className="rounded bg-white/20 px-2 py-1 text-xs font-bold">
                                    Optimal
                                </span>
                            </div>
                            <div>
                                <span className="text-primary-fixed text-sm font-medium opacity-80">
                                    Avg. Risk Factor
                                </span>
                                <p className="mt-1 text-3xl font-black">
                                    {avgRisk}
                                </p>
                            </div>
                        </div>
                        <div className="group relative mt-15 flex flex-row content-center items-center justify-center gap-1 rounded-xl border-t border-r border-b border-secondary p-5 hover:ring-5 hover:ring-secondary/10 md:col-span-2">
                            <div className="absolute left-0 flex items-center gap-1 text-secondary">
                                <ChevronsLeft className="size-8 opacity-30 transition-all duration-200 group-hover:scale-120" />
                                <ChevronsLeft className="size-9 opacity-60 transition-all duration-200 group-hover:scale-120" />
                                <ChevronsLeft className="size-10 transition-all duration-200 group-hover:scale-120" />
                            </div>

                            {StudyCases.links.map((link, index) => (
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
                <div className="mr-10 flex max-w-6xl flex-col items-center">
                    <div className="flex flex-row items-center justify-between gap-4">
                        <div className="mt-2 flex flex-col items-center justify-between gap-4 rounded-xl bg-card-high p-4 lg:flex-row">
                            <div className="relative w-full lg:w-96">
                                <Search className="text-on-surface-variant absolute top-1/2 left-3 -translate-y-1/2" />
                                <input
                                    className="border-outline-variant w-full rounded-lg border bg-input py-2 pr-4 pl-10 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                                    placeholder="Search case by title or tag..."
                                    type="text"
                                />
                            </div>
                            <div className="flex w-full items-center gap-3 overflow-x-auto pb-2 lg:w-auto lg:pb-0">
                                <span className="text-on-surface-variant text-sm font-bold whitespace-nowrap">
                                    Filter by:
                                </span>
                                <select className="border-outline-variant rounded-lg border bg-input px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary">
                                    <option>All Statuses</option>
                                    <option>In Progress</option>
                                    <option>Completed</option>
                                    <option>Draft</option>
                                </select>
                                <select className="border-outline-variant rounded-lg border bg-input px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary">
                                    <option>All Human Factors</option>
                                    <option>Cognitive Load</option>
                                    <option>Trust &amp; Reliability</option>
                                    <option>Action Perception</option>
                                </select>
                                <button className="border-outline-variant hover:bg-surface-variant flex items-center justify-center rounded-lg border bg-white p-2 transition-colors">
                                    <span className="material-symbols-outlined text-outline">
                                        tune
                                    </span>
                                </button>
                            </div>
                        </div>
                        <Button
                            variant="secondary"
                            className="gap-2 px-6 py-6 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105"
                            onClick={() =>
                                router.post('/study-cases')
                            }
                        >
                            <FolderPlus className="size-6" />
                            Create New Study Case
                        </Button>
                    </div>
                    <div className="mt-4 mr-6 ml-20 grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
                        {cases.map((item, index) => (
                            <ScCard key={item.id ?? index} StudyCase={item} />
                        ))}

                        {/*Blank Card*/}
                        <div className="border-outline-variant group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-card-high p-8 transition-colors hover:bg-card-highest">
                            <div className="bg-primary-fixed mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110">
                                <SquarePlus className="size-10 text-card-foreground" />
                            </div>
                            <h3 className="text-on-surface font-bold">
                                Start New Analysis
                            </h3>
                            <p className="text-on-surface-variant mt-2 text-center text-xs">
                                Begin a new study case with our guided heuristic
                                framework.
                            </p>
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
            title: 'Study Cases',
            href: '/StudyCases',
        },
    ],
};
