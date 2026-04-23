import { useForm, Form } from '@inertiajs/react';
import {
    ArrowLeftFromLine,
    BrainCog,
    Bug,
    Clock4,
    FolderOpen,
    FolderOutput,
    Layers,
    MonitorSmartphone,
    Network,
    PencilLine,
    Save,
    Share,
    UserCheck,
    UserRoundPen,
} from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import type { StudyCase } from '@/types';
type Props = {
    studyCase: StudyCase;
};



const RiskColor = ({ studyCase }: StudyCase) => {
    if (studyCase.risk_level === 'low') {
        return (
            <span className="text-xsm rounded bg-emerald-300/10 px-1.5 py-0.5 font-bold tracking-wider text-emerald-700 uppercase">
                Low
            </span>
        );
    } else if (studyCase.risk_level === 'medium') {
        return (
            <span className="text-xsm rounded bg-alert/10 px-1.5 py-0.5 font-bold tracking-wider text-alert uppercase">
                Medium
            </span>
        );
    } else if (studyCase.risk_level === 'high') {
        return (
            <span className="text-xsm rounded bg-destructive/20 px-1.5 py-0.5 font-bold tracking-wider text-destructive uppercase">
                High
            </span>
        );
    }
};

const Edit = ({ studyCase }: Props) => {
    console.log(studyCase);

    return (
        <form method="POST" action="/study-cases">
            <header className="bg-surface sticky top-0 z-50 shadow-sm">
                {/* Main Header Area */}
                <div className="border-surface-variant flex flex-col items-start justify-between gap-4 border-b px-6 py-4 md:flex-row md:items-center">
                    {/* Left Side: Breadcrumbs & Title */}
                    <div className="flex flex-col gap-3">
                        <nav aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-2 text-primary">
                                <li>
                                    <a
                                        className="group flex items-center gap-1 transition-colors hover:text-secondary"
                                        href="/study-cases"
                                    >
                                        <ArrowLeftFromLine className="size-6 text-primary transition-colors transition-transform group-hover:-translate-x-1 group-hover:text-secondary" />
                                        Return{' '}
                                        <span className="transition-transform group-hover:uppercase">
                                            without
                                        </span>{' '}
                                        saving
                                    </a>
                                </li>
                            </ol>
                        </nav>
                        <div className="flex items-center gap-3">
                            <h1 className="font-headline text-on-surface text-2xl font-bold tracking-tight">
                                {'SC'}
                                {studyCase.id}
                                {': '}
                                {studyCase.title}
                            </h1>
                            <span className="font-label text-tertiary-container border-tertiary-container/20 inline-flex items-center rounded-full border bg-card-high px-2.5 py-0.5 text-xs font-medium">
                                <span className="bg-tertiary-container mr-1.5 rounded-full"></span>
                                In Progress
                            </span>
                        </div>
                    </div>
                    {/* Right Side: Actions */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant={'outline'}
                            className="text-md transition-colors duration-300"
                        >
                            <Share className="size-6" />
                            Share
                        </Button>
                        <Button
                            variant={'outline'}
                            className="text-md transition-colors duration-300"
                        >
                            <FolderOutput className="size-6" />
                            Export Report
                        </Button>
                        <Button
                            type={'submit'}
                            className="gap-2 rounded bg-primary p-5 text-lg font-medium shadow-sm shadow-secondary transition-transform duration-300 hover:scale-103 hover:bg-secondary hover:text-secondary-foreground hover:shadow-secondary"
                        >
                            <Save className="size-7" />
                            Save
                        </Button>
                    </div>
                </div>
                <div className="border-secondary font-label text-on-surface-variant flex flex-wrap items-center gap-x-6 gap-y-2 border-b bg-surface-container-low px-6 py-6 text-xs">
                    <div className="flex items-center gap-1.5">
                        <FolderOpen className="size-4 text-primary" />
                        <span className="opacity-70">Study Case:</span>
                        <span className="text-on-surface font-medium">
                            Payment Confirmation Flow
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MonitorSmartphone className="size-4 text-primary" />
                        <span className="opacity-70">System:</span>
                        <span className="text-on-surface font-medium">
                            Mobile banking app
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Bug className="size-4 text-primary" />
                        <span className="opacity-70">Risk level:</span>
                        <RiskColor studyCase={studyCase} />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock4 className="size-4 text-primary" />
                        <span className="opacity-70">Status:</span>
                        <span className="text-on-surface font-medium">
                            In progress
                        </span>
                    </div>
                    <div className="ml-auto flex flex-row items-center gap-3">
                        <div className="flex flex-row items-center gap-3">
                            <div className="ml-auto flex items-center gap-1.5">
                                <UserCheck className="size-4 text-primary" />
                                <span className="text-on-surface font-medium">
                                    Assigned to
                                </span>
                                <span className="mx-1 opacity-40">|</span>
                                <span className="text-on-surface font-medium">
                                    {studyCase.assignedUser?.name ?? 'No user'}
                                </span>
                            </div>
                            <div className="mx-3 h-5 w-1 border-2 border-secondary bg-secondary shadow-2xl shadow-primary"></div>
                            <div className="ml-auto flex items-center gap-1.5">
                                <UserRoundPen className="size-4 text-primary" />
                                <span className="text-on-surface font-medium">
                                    {studyCase.last_user?.name ?? 'No user'}
                                </span>
                                <span className="mx-1 opacity-40">|</span>
                                <span className="opacity-70">
                                    Last updated:{' '}
                                    {studyCase.updated_at
                                        ? new Date(
                                              studyCase.updated_at,
                                          ).toLocaleString()
                                        : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Tab Navigation */}
                <div className="border-surface-variant bg-surface-container-lowest border-b px-6">
                    <nav
                        aria-label="Tabs"
                        className="-mb-px flex space-x-8 overflow-x-auto"
                    >
                        {/* Active Tab */}
                        <button
                            aria-current="page"
                            className="font-label group relative flex items-center gap-2 border-b-2 border-primary px-1 py-4 text-sm font-medium whitespace-nowrap text-primary transition-colors hover:text-secondary"
                        >
                            <Layers className="size-7 text-primary transition-colors group-hover:text-secondary" />
                            Interface Layer
                            <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-100 transform bg-primary transition-transform duration-300"></span>
                        </button>
                        {/* Inactive Tabs */}
                        <button className="font-label group relative flex items-center gap-2 px-1 py-4 text-sm font-medium whitespace-nowrap text-primary transition-colors hover:text-secondary">
                            <BrainCog className="size-7 text-primary transition-colors group-hover:text-secondary" />
                            Cognitive Layer
                            <span className="bg-outline-variant absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transform transition-transform duration-300 group-hover:scale-x-100"></span>
                        </button>
                        <button className="group font-label group relative flex items-center gap-2 px-1 py-4 text-sm font-medium whitespace-nowrap text-primary transition-colors hover:text-secondary">
                            <Network className="size-7 text-primary transition-colors group-hover:text-secondary" />
                            Organizational Layer
                            <span className="bg-outline-variant absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transform transition-transform duration-300 group-hover:scale-x-100"></span>
                        </button>
                    </nav>
                </div>
            </header>
        </form>
    );
};
export default Edit;
