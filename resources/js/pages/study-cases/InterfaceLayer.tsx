import {
    PencilRuler,
    FileUp,
    Link2,
    BookText,
    GitPullRequestCreateArrow,
} from 'lucide-react';
import React, { useState } from 'react';

import CreateTaskModal from '@/components/tasks/CreateTask';
import TaskIndex from '@/components/tasks/taskIndex';

import { Button } from '@/components/ui/button';


import type { StudyCase, Task, Paginated } from '@/types';


type Props = {
    studyCase: StudyCase;
    tasks: Paginated<Task>;
}

const InterfaceLayer = ({ studyCase, tasks }: Props) => {
    const [createTaskOpen, setCreateTaskOpen] = useState(false);

    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const handleCreateTask = () => {
        setSelectedTask(null);
        setTaskModalOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setTaskModalOpen(true);
    };

    const handleCloseTaskModal = () => {
        setTaskModalOpen(false);
        setSelectedTask(null);
    };

    return (
        <div className="space-y-8 p-10">
            <div className="flex flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="font-display text-on-surface text-3xl font-black tracking-tight">
                        Task Index
                    </h1>
                    <p className="text-on-surface-variant text-sm">
                        Manage and prioritize interface-level interaction nodes
                        for systematic analysis.
                    </p>
                </div>

                <Button size="lg" onClick={handleCreateTask}>
                    <GitPullRequestCreateArrow className="size-6" />
                    Add New Task
                </Button>
            </div>

            {tasks.data.length > 0 ? (
                <TaskIndex studyCase={studyCase} tasks={tasks} onEditTask={handleEditTask} />
            ) : (
                <div className="flex flex-row">
                    <div className="flex w-full grow flex-col gap-6 md:w-2/3 lg:w-3/4">
                        {/*
                            <div className="mb-4 flex flex-col gap-2">
                                <h1 className="font-headline text-on-surface text-3xl font-bold">
                                    Interface Layer Analysis
                                </h1>
                                <p className="text-on-surface-variant max-w-2xl text-sm">
                                    Evaluate visual hierarchy, consistency,
                                    typography, and interactive element
                                    affordances. Begin by providing data sources
                                    for the audit.
                                </p>
                            </div>
                        */}

                        <div className="bg-surface-container-lowest border-outline-variant flex min-h-100 grow flex-col items-center justify-center rounded-xl border p-12 text-center shadow-sm">
                            <div className="mb-6 rounded-full bg-surface-container-low p-6">
                                <PencilRuler className="size-12 text-secondary" />
                            </div>
                            <h2 className="font-headline text-on-surface mb-2 text-2xl font-bold">
                                No UI Findings Yet
                            </h2>
                            <p className="text-on-surface-variant mb-8 max-w-md">
                                The Interface Layer canvas is empty. Start an
                                audit to identify visual design and interaction
                                violations across your product.
                            </p>

                            <div className="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
                                <button className="border-outline-variant hover:bg-surface-bright group flex h-full flex-col items-center rounded-lg border p-6 text-left transition-all hover:border-primary">
                                    <FileUp className="mb-4 size-7 text-secondary transition-colors group-hover:text-primary" />
                                    <h3 className="font-headline text-on-surface mb-2 font-semibold">
                                        Import Screenshots
                                    </h3>
                                    <p className="text-on-surface-variant text-center text-xs">
                                        Upload key screen flows for static
                                        visual analysis.
                                    </p>
                                </button>

                                <button className="border-outline-variant hover:bg-surface-bright group flex h-full flex-col items-center rounded-lg border p-6 text-left transition-all hover:border-primary">
                                    <Link2 className="mb-4 size-7 text-secondary transition-colors group-hover:text-primary" />
                                    <h3 className="font-headline text-on-surface mb-2 font-semibold">
                                        Connect URL
                                    </h3>
                                    <p className="text-on-surface-variant text-center text-xs">
                                        Provide a live URL for automated
                                        heuristic scanning.
                                    </p>
                                </button>

                                <button className="border-outline-variant hover:bg-surface-bright group flex h-full flex-col items-center rounded-lg border p-6 text-left transition-all hover:border-primary">
                                    <BookText className="mb-4 size-7 text-secondary transition-colors group-hover:text-primary" />
                                    <h3 className="font-headline text-on-surface mb-2 font-semibold">
                                        Browse Library
                                    </h3>
                                    <p className="text-on-surface-variant text-center text-xs">
                                        Explore common interface violations and
                                        patterns.
                                    </p>
                                </button>
                            </div>

                            <div className="mt-8">
                                <Button size="lg" onClick={handleCreateTask}>
                                    Create First Task
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <CreateTaskModal
                open={taskModalOpen}
                onClose={handleCloseTaskModal}
                studyCaseId={studyCase.id}
                task={selectedTask}
            />
        </div>
    );
};
export default InterfaceLayer;
