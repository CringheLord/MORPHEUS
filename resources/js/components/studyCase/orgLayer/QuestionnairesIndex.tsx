import { Link } from '@inertiajs/react';


import {
    ClipboardList,
    Copy,
    FilePlus2,
    Link2,
    Link2Off,
    MoreVertical,
    SquarePen,
    Users,
} from 'lucide-react';
import React from 'react';
import { useRef } from 'react';
import { show } from '@/actions/App/Http/Controllers/QuestionnairesController';

import { Button } from '@/components/ui/button';

import type { Questionnaire } from '@/types';




type Props = {
    questionnaires: Questionnaire[];
    gridView: boolean;
};

type QuestionnaireStatus = 'active' | 'draft' | 'closed';

type DynamicStatusProps = {
    status: 'active' | 'draft' | 'closed';
    variant?: 'card' | 'badge';
};

const normalizeStatus = (status: string): QuestionnaireStatus => {
    if (status === 'active' || status === 'draft' || status === 'closed') {
        return status;
    }

    return 'draft';
};

const DynamicStatus = ({ status, variant = 'card' }: DynamicStatusProps) => {
    const statusConfig = {
        active: {
            label: 'Active',
            badgeClass:
                'bg-primary/10 text-primary border-primary border-1 dark:border-secondary',
            dotClass: 'bg-primary',
        },
        draft: {
            label: 'Draft',
            badgeClass: 'bg-tertiary/10 text-tertiary border-border b-2',
            dotClass: 'bg-tertiary',
        },
        closed: {
            label: 'Closed',
            badgeClass:
                'bg-destructive/10 text-destructive dark:border-primary/10 border-1',
            dotClass: 'bg-destructive',
        },
    };

    const currentStatus = statusConfig[status];

    if (variant === 'badge') {
        return (
            <span
                className={`m-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${currentStatus.badgeClass}`}
            >
                <span
                    className={`h-1.5 w-1.5 rounded-full ${currentStatus.dotClass}`}
                />
                {currentStatus.label}
            </span>
        );
    }

    return (
        <div className="relative h-32 bg-cover bg-center">
            <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent"></div>
            <div className="absolute top-4 left-4">
                <span
                    className={`rounded-full px-2 py-1 text-[10px] font-black tracking-tighter uppercase ${currentStatus.badgeClass}`}
                >
                    {currentStatus.label}
                </span>
            </div>
        </div>
    );
};

const QuestionnairesIndex = ({ questionnaires, gridView }: Props) => {
    console.log(questionnaires);

    const gridScrollRef = useRef<HTMLDivElement>(null);

    const handleGridWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        const scroller = gridScrollRef.current;

        if (!scroller) {
            return;
        }

        const isMostlyVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX);

        if (!isMostlyVerticalScroll) {
            return;
        }

        const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;

        if (maxScrollLeft <= 0) {
            return;
        }

        const nextScrollLeft = scroller.scrollLeft + e.deltaY;

        const canScrollRight =
            e.deltaY > 0 && scroller.scrollLeft < maxScrollLeft;

        const canScrollLeft = e.deltaY < 0 && scroller.scrollLeft > 0;

        if (!canScrollRight && !canScrollLeft) {
            return;
        }

        e.preventDefault();

        scroller.scrollLeft = Math.max(
            0,
            Math.min(nextScrollLeft, maxScrollLeft),
        );
    };

    return (
        <div>
            <section>
                {questionnaires.length > 0 ? (
                    gridView ? (
                        <div
                            ref={gridScrollRef}
                            onWheel={handleGridWheel}
                            className="no-scrollbar overflow-x-auto pb-4"
                        >
                            <div className="flex w-max gap-8 pr-4">
                                {questionnaires.map((questionnaire) => {
                                    const safeStatus = normalizeStatus(
                                        questionnaire.status,
                                    );

                                    const submissionsCount =
                                        questionnaire.submissions_count ?? 0;

                                    return (
                                        <div
                                            key={questionnaire.id}
                                            data-flip-id={`questionnaire-${questionnaire.id}`}
                                            className="questionnaire-flip-item questionnaire-grid-item border-outline-variant/30 group flex h-100 w-[340px] shrink-0 flex-col overflow-hidden rounded-2xl border bg-card-high dark:bg-card shadow-md transition-all hover:shadow-xl sm:w-[380px]"
                                        >
                                            <DynamicStatus
                                                status={safeStatus}
                                                variant="card"
                                            />

                                            <div className="flex flex-1 flex-col p-6">
                                                <h3 className="mb-2 pt-2 text-lg font-bold text-foreground">
                                                    {questionnaire.title}
                                                </h3>

                                                <p className="text-outline mb-4 line-clamp-2 text-sm">
                                                    {questionnaire.description}
                                                </p>

                                                <div className="mb-6 grid grid-cols-2 gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <ClipboardList className="h-4 w-4 text-primary" />

                                                        <span className="text-xs font-semibold text-foreground">
                                                            {
                                                                questionnaire.questions_count
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-primary" />

                                                        <span className="text-xs font-semibold text-foreground">
                                                            {submissionsCount}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-auto space-y-4">
                                                    {questionnaire.link ? (
                                                        <div className="group/link flex cursor-pointer items-center justify-between rounded-xl bg-surface-container-low p-3 hover:bg-primary/10">
                                                            <span className="text-outline mr-4 truncate font-mono text-[10px]">
                                                                {
                                                                    questionnaire.link
                                                                }
                                                            </span>

                                                            <Copy className="h-4 w-4 text-primary transition-transform group-hover/link:scale-110" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-between rounded-xl bg-surface-container-low/50 p-3 opacity-50">
                                                            <span className="text-outline mr-4 truncate font-mono text-[10px] italic">
                                                                No link
                                                                generated yet
                                                            </span>

                                                            <Link2Off className="text-outline/40 h-4 w-4" />
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-2 pt-2">
                                                        {questionnaire.status ===
                                                            'active' ||
                                                        questionnaire.status ===
                                                            'closed' ? (
                                                            <Button
                                                                size="lg"
                                                                className="w-full"
                                                            >
                                                                Results
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="secondary"
                                                                className="w-full"
                                                            >
                                                                Resume Editing
                                                            </Button>
                                                        )}

                                                        <button className="text-outline border-outline-variant/30 rounded-lg border p-2 transition-colors hover:bg-surface-container">
                                                            <MoreVertical className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-outline-variant/10 text-outline flex justify-between border-t px-6 py-3 text-[10px] font-medium">
                                                <span>
                                                    Created:{' '}
                                                    {questionnaire.created_at}
                                                </span>

                                                <span>
                                                    By:{' '}
                                                    {
                                                        questionnaire.created_by_id
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="border-outline-variant overflow-hidden rounded-xl border bg-card shadow-sm">
                            <div className="overflow-x-auto">
                                <div className="w-full border-collapse text-left">
                                    <div
                                        data-flip-id="questionnaires-list-header"
                                        className="questionnaire-list-header"
                                    >
                                        <div className="border-outline-variant flex w-full min-w-[1150px] items-center border-b bg-surface-container-low">
                                            <div className="text-outline min-w-0 flex-1 px-6 py-4 text-xs font-bold tracking-wider uppercase">
                                                Title &amp; Description
                                            </div>

                                            <div className="text-outline w-40 shrink-0 px-6 py-4 text-xs font-bold tracking-wider uppercase">
                                                Status
                                            </div>

                                            <div className="text-outline w-15 shrink-0 px-6 py-4 text-center text-xs font-bold tracking-wider uppercase">
                                                Questions
                                            </div>

                                            <div className="text-outline w-70 shrink-0 px-6 py-4 text-center text-xs font-bold tracking-wider uppercase">
                                                Submissions
                                            </div>

                                            <div className="text-outline w-40 shrink-0 px-6 py-4 text-xs font-bold tracking-wider uppercase">
                                                Created Date
                                            </div>

                                            <div className="text-outline mr-27 w-56 shrink-0 px-6 py-4 text-right text-xs font-bold tracking-wider uppercase">
                                                Actions
                                            </div>
                                        </div>
                                    </div>

                                    <div className="divide-outline-variant/50 flex max-h-[45vh] min-w-[70vw] flex-col divide-y overflow-y-scroll">
                                        {questionnaires.map((questionnaire) => {
                                            const safeStatus = normalizeStatus(
                                                questionnaire.status,
                                            );

                                            const submissionsCount =
                                                questionnaire.submissions_count ??
                                                0;

                                            return (
                                                <div
                                                    key={questionnaire.id}
                                                    data-flip-id={`questionnaire-${questionnaire.id}`}
                                                    className="questionnaire-flip-item questionnaire-list-item group flex w-full min-w-full items-center p-1 transition-colors hover:bg-primary/5"
                                                >
                                                    <div className="min-w-0 flex-1 px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-surface-container">
                                                                <ClipboardList className="h-5 w-5 text-primary" />
                                                            </div>

                                                            <div>
                                                                <div className="font-bold text-foreground transition-colors group-hover:text-primary">
                                                                    {
                                                                        questionnaire.title
                                                                    }
                                                                </div>

                                                                <div className="text-outline max-w-xs truncate text-sm">
                                                                    {
                                                                        questionnaire.description
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mx-20 px-6 py-4">
                                                        <DynamicStatus
                                                            status={safeStatus}
                                                            variant="badge"
                                                        />
                                                    </div>

                                                    <div className="px-6 py-4 text-center font-medium">
                                                        {
                                                            questionnaire.questions_count
                                                        }
                                                    </div>

                                                    <div className="mx-20 px-6 py-4 text-center">
                                                        {submissionsCount ===
                                                        0 ? (
                                                            <span className="text-outline/50 text-sm italic">
                                                                --
                                                            </span>
                                                        ) : (
                                                            <div className="flex flex-col items-center">
                                                                <span className="font-bold">
                                                                    {
                                                                        submissionsCount
                                                                    }
                                                                </span>

                                                                <div className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-surface-container">
                                                                    <div className="h-full bg-primary" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="text-outline px-6 py-4 text-sm">
                                                        {
                                                            questionnaire.created_at
                                                        }
                                                    </div>

                                                    <div className="mx-5 px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                className="border-secondary"
                                                                title="Share Link"
                                                            >
                                                                <Link2 className="h-5 w-5" />
                                                            </Button>

                                                            <Link
                                                                method="get"
                                                                href={show({
                                                                    studyCase:
                                                                        questionnaire.study_case_id,
                                                                    questionnaire:
                                                                        questionnaire.id,
                                                                })}
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    className="text-outline rounded-lg p-2 transition-all hover:bg-primary/10 hover:text-primary"
                                                                    title="Edit"
                                                                >
                                                                    <SquarePen className="h-5 w-5" />
                                                                </Button>
                                                            </Link>

                                                            <button className="border-outline-variant text-outline ml-2 cursor-not-allowed rounded-full border px-3 py-1 text-[10px] font-bold tracking-tighter uppercase">
                                                                Results Soon
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="border-outline-variant/40 group mt-12 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-surface-container-low/30 p-8 text-center transition-all hover:border-primary/40">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container transition-transform group-hover:scale-110">
                            <FilePlus2 className="text-outline h-8 w-8" />
                        </div>

                        <h3 className="text-lg font-bold text-foreground">
                            Start a new analysis phase
                        </h3>

                        <p className="text-outline mt-1 max-w-sm text-sm">
                            Create a custom questionnaire using our
                            scientifically-validated templates.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};
export default QuestionnairesIndex;
