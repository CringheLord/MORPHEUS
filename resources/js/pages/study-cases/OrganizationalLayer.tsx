import { Link } from '@inertiajs/react';

import { FilePlus, Grid2x2, List } from 'lucide-react';
import { useRef, useState } from 'react';
import { store } from '@/actions/App/Http/Controllers/QuestionnairesController';


import QuestionnairesIndex from '@/components/studyCase/orgLayer/QuestionnairesIndex';
import { Button } from '@/components/ui/button';
import { Flip, ScrollTrigger, useGSAP } from '@/lib/gsap';


import type { Questionnaire, StudyCase } from '@/types';

type Props = {
    questionnaires: Questionnaire[];
    studyCase: StudyCase;
};

const OrganizationalLayer = ({ questionnaires, studyCase }: Props) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);

    const [gridView, setGridView] = useState(true);
    const [isViewTransitioning, setIsViewTransitioning] = useState(false);

    const flipTargetsSelector =
        '.questionnaire-flip-item, .questionnaire-list-header';

    const toggleGridView = (targetView: 'grid' | 'list') => {
        const wantsGridView = targetView === 'grid';

        if (wantsGridView === gridView) {
            return;
        }

        const root = rootRef.current;

        if (root) {
            flipStateRef.current = Flip.getState(
                root.querySelectorAll('.questionnaire-flip-item'),
                {
                    props: 'opacity',
                },
            );
        }

        setGridView(wantsGridView);
    };

    useGSAP(
        () => {
            if (!flipStateRef.current) {
                return;
            }

            Flip.from(flipStateRef.current, {
                targets: '.questionnaire-flip-item',
                duration: 0.5,
                ease: 'power2.inOut',
                absolute: true,
                scale: true,
                stagger: 0.025,
                prune: true,
                onComplete: () => {
                    flipStateRef.current = null;
                    ScrollTrigger.refresh();
                },
            });
        },
        {
            scope: rootRef,
            dependencies: [gridView],
        },
    );

    return (
        <div ref={rootRef} className="m-2 p-2">
            <section className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div className="space-y-2">
                    <h1 className="text-on-background text-4xl font-extrabold tracking-tight">
                        Organizational Layer
                    </h1>

                    <p className="text-on-surface-variant font-body max-w-2xl">
                        Create and manage anonymous questionnaires for
                        organizational human-factor analysis. Gain deep insights
                        into your team's operational psychology.
                    </p>
                </div>

                <div className="mb-6 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div
                            className={
                                gridView ? 'border-b-3 border-primary' : ''
                            }
                        >
                            <button
                                type="button"
                                className="text-outline rounded-lg p-2 hover:bg-surface-container disabled:opacity-50"
                                disabled={gridView}
                                onClick={() => toggleGridView('grid')}
                            >
                                <Grid2x2 />
                            </button>
                        </div>

                        <div
                            className={
                                !gridView ? 'border-b-3 border-primary' : ''
                            }
                        >
                            <button
                                type="button"
                                className="text-outline rounded-lg p-2 hover:bg-surface-container disabled:opacity-50"
                                disabled={!gridView}
                                onClick={() => toggleGridView('list')}
                            >
                                <List />
                            </button>
                        </div>
                    </div>
                </div>

                <Button asChild size="lg">
                    <Link
                        method="post"
                        href={`/study-cases/${studyCase.id}/questionnaires/store`}
                        preserveScroll
                    >
                        <FilePlus className="size-6" />
                        Create Questionnaire
                    </Link>
                </Button>
            </section>

            <QuestionnairesIndex
                questionnaires={questionnaires}
                gridView={gridView}
            />
        </div>
    );
};

export default OrganizationalLayer;
