import { Head, router } from '@inertiajs/react';
import { ListFilter } from 'lucide-react';
import { useRef } from 'react';

import EvaluationPatternShow from '@/components/evaluationPatterns/evaluationPatternShow';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

import type { EvaluationPattern, HumanFactor, uiTag } from '@/types';

type Filters = {
    human_factor_id: string;
    tag_slug: string;
    category: string;
};

type Props = {
    evaluation_patterns: EvaluationPattern[];
    heuristics_all: EvaluationPattern[];
    human_factors: HumanFactor[];
    tags: uiTag[];
    filters: Filters;
};

export default function EPIndex({ evaluation_patterns, human_factors, filters, tags }: Props) {
    const inventoryRef = useRef<HTMLDivElement>(null);

    const heuristicsAnimationKey = evaluation_patterns.map((ep) => ep.id).join('-');

    useGSAP(
        () => {
            const scroller = inventoryRef.current;

            if (!scroller) {
                return;
            }

            const rows = gsap.utils.toArray<HTMLElement>('.heuristic-row');

            gsap.set(rows, {
                autoAlpha: 0,
                y: 28,
                scale: 0.98,
            });

            rows.forEach((row) => {
                ScrollTrigger.create({
                    trigger: row,
                    scroller,
                    start: 'top 90%',
                    end: 'bottom 26%',

                    onEnter: () => {
                        gsap.to(row, {
                            autoAlpha: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.15,
                            ease: 'power2.out',
                            overwrite: true,
                        });
                    },

                    onLeave: () => {
                        gsap.to(row, {
                            autoAlpha: 0,
                            y: -24,
                            scale: 0.88,
                            duration: 0.1,
                            ease: 'power2.in',
                            overwrite: true,
                        });
                    },

                    onEnterBack: () => {
                        gsap.to(row, {
                            autoAlpha: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.1,
                            ease: 'power2.out',
                            overwrite: true,
                        });
                    },

                    onLeaveBack: () => {
                        gsap.to(row, {
                            autoAlpha: 0,
                            y: 28,
                            scale: 0.98,
                            duration: 0.25,
                            ease: 'power2.in',
                            overwrite: true,
                        });
                    },
                });
            });

            ScrollTrigger.refresh();
        },
        {
            scope: inventoryRef,
            dependencies: [heuristicsAnimationKey],
            revertOnUpdate: true,
        },
    );

    const updateFilter = (key: keyof Filters, value: string) => {
        const rows = inventoryRef.current?.querySelectorAll('.heuristic-row');

        const visit = () => {
            router.get(
                '/evaluation-patterns',
                {
                    ...filters,
                    [key]: value,
                },
                {
                    preserveScroll: true,
                    replace: true,
                },
            );
        };

        if (!rows || rows.length === 0) {
            visit();
            return;
        }

        gsap.to(rows, {
            opacity: 0,
            y: -10,
            scale: 0.98,
            duration: 0.18,
            stagger: 0.015,
            ease: 'power1.in',
            onComplete: visit,
        });
    };

    return (
        <>
            <Head title="Evaluation Patterns" />

            <div className="flex flex-col">
                <div className="dark:glass-tertiary m-2 mt-5 overflow-hidden rounded-xl bg-card">
                    <div className="border-outline-variant flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-foreground">
                                Evaluation Pattern Inventory
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Browse the MORPHEUS evaluation pattern catalog
                                and filter it by human factor or interface tag.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <div className="flex min-w-max flex-nowrap gap-4 pb-1">
                                <div className="relative shrink-0">
                                    <ListFilter className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                                    <select
                                        value={filters.category ?? 'all'}
                                        onChange={(e) =>
                                            updateFilter(
                                                'category',
                                                e.target.value,
                                            )
                                        }
                                        className="border-outline-variant min-w-[180px] appearance-none rounded-lg border bg-muted py-2 pr-8 pl-10 text-sm text-foreground focus:ring-1 focus:ring-ring"
                                    >
                                        <option value="all">
                                            All Categories
                                        </option>
                                        <option value="cognitive">
                                            Cognitive
                                        </option>
                                        <option value="behavioral">
                                            Behavioral
                                        </option>
                                        <option value="emotional">
                                            Emotional
                                        </option>
                                    </select>
                                </div>
                                <div className="relative shrink-0">
                                    <ListFilter className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                                    <select
                                        value={filters.human_factor_id ?? 'all'}
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
                                    <ListFilter className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                                    <select
                                        value={filters.tag_slug ?? 'all'}
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
                            </div>
                        </div>
                    </div>

                    <div
                        ref={inventoryRef}
                        className="no-scrollbar max-h-[72vh] overflow-y-auto p-4"
                    >
                        <div className="grid gap-3">
                            {evaluation_patterns.length > 0 ? (
                                evaluation_patterns.map((ep) => (
                                    <EvaluationPatternShow
                                        key={ep.id}
                                        evaluationPattern={ep}
                                    />
                                ))
                            ) : (
                                <div className="flex items-center justify-center">
                                    <p className="m-4 w-fit rounded-lg border-t-4 border-b-4 border-border p-6 text-center text-lg text-muted-foreground hover:cursor-default">
                                        No evaluation patterns found.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

EPIndex.layout = {
    breadcrumbs: [
        {
            title: 'Evaluation Patterns',
            href: '/EvaluationPattern',
        },
    ],
};
