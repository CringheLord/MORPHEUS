import { Head } from '@inertiajs/react';
import  ScCard  from '@/components/studyCase/sc-card';

import type { StudyCase, Paginated} from '@/types';

type Props = {
    StudyCases: Paginated<StudyCase>;
};

export default function Index( { StudyCases }: Props) {
    const cases = StudyCases?.data ?? [];
    return (
        <>
            <Head title="Study Cases" />
            <div className="bg-surface-container-low mb-8 flex flex-col items-center justify-between gap-4 rounded-xl p-4 lg:flex-row">
                <div className="relative w-full lg:w-96">
                    <span className="material-symbols-outlined text-outline absolute top-1/2 left-3 -translate-y-1/2">
                        search
                    </span>
                    <input
                        className="border-outline-variant w-full rounded-lg border bg-white py-2 pr-4 pl-10 outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                        placeholder="Search case by title or tag..."
                        type="text"
                    />
                </div>
                <div className="flex w-full items-center gap-3 overflow-x-auto pb-2 lg:w-auto lg:pb-0">
                    <span className="text-on-surface-variant text-sm font-bold whitespace-nowrap">
                        Filter by:
                    </span>
                    <select className="border-outline-variant rounded-lg border bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary">
                        <option>All Statuses</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Draft</option>
                    </select>
                    <select className="border-outline-variant rounded-lg border bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary">
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {cases.map((item, index) => (
                    <ScCard key={item.id ?? index} StudyCase={item} />
                ))}

                {/*Blank Card*/}
                <div className="border-outline-variant bg-surface-container-lowest hover:bg-surface-container group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors">
                    <div className="bg-primary-fixed mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110">
                        <span className="material-symbols-outlined text-3xl text-primary">
                            add
                        </span>
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
