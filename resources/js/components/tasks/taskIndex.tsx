import { Link, router } from '@inertiajs/react';
import {
    PersonStanding,
    ChevronRight,
    ChevronLeft,
    EllipsisVertical,
    Pencil,
    Trash2,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

import type { Task, Paginated, StudyCase } from '@/types';
import { cn } from '@/lib/utils';


type Props = {
    studyCase: StudyCase;
    tasks: Paginated<Task>;
    onEditTask: (task: Task) => void;
    onDeleteTask?: (task: Task) => void;
};

const TaskIndex = ({ tasks, onEditTask, onDeleteTask }: Props) => {
    const [openMenuTaskId, setOpenMenuTaskId] = useState<number | null>(null);

    const prevUrl = useMemo(() => {
        return (
            tasks.prev_page_url ??
            tasks.links.find((link) =>
                String(link.label).toLowerCase().includes('previous'),
            )?.url ??
            null
        );
    }, [tasks]);

    const getStressLevelClasses = (level: number) => {
        if (level <= 2) {
            return 'bg-muted text-card-foreground';
        }

        if (level <= 4) {
            return 'bg-yellow-100 text-yellow-700';
        }

        if (level <= 6) {
            return 'bg-orange-100 text-orange-700';
        }

        if (level <= 8) {
            return 'bg-red-100 text-red-700';
        }

        return 'bg-red-200 text-red-900 ring-1 ring-red-300';
    };
    const getCostOfErrorClasses = (cost: string) => {
        switch (cost) {
            case 'low':
                return 'bg-muted text-card-foreground';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700';
            case 'high':
                return 'bg-orange-100 text-orange-700';
            case 'critical':
                return 'bg-red-200 text-red-900 ring-1 ring-red-300';
            default:
                return 'bg-muted text-card-foreground';
        }
    };

    const nextUrl = useMemo(() => {
        return (
            tasks.next_page_url ??
            tasks.links.find((link) =>
                String(link.label).toLowerCase().includes('next'),
            )?.url ??
            null
        );
    }, [tasks]);

    return (
        <div className="border-outline-variant relative overflow-visible rounded-xl border bg-card shadow-sm">
            <div className="overflow-x-auto overflow-y-visible">
                <table className="glass-card glass-secondary w-full border-collapse text-left">
                    <thead className="border-outline-variant border-b bg-surface-container-low">
                        <tr>
                            <th className="text-outline px-6 py-4 text-[11px] font-black tracking-wider uppercase">
                                ID
                            </th>
                            <th className="text-outline px-6 py-4 text-[11px] font-black tracking-wider uppercase">
                                Task Name
                            </th>
                            <th className="text-outline flex items-center gap-2 px-10 py-4 text-[11px] font-black tracking-wider uppercase">
                                User Type
                                <ChevronRight className="size-4 overflow-hidden text-ellipsis whitespace-nowrap text-card-foreground-secondary" />
                                Role
                            </th>
                            <th className="text-outline px-6 py-4 text-[11px] font-black tracking-wider uppercase">
                                User Intent
                            </th>
                            <th className="text-outline px-6 py-4 text-[11px] font-black tracking-wider uppercase">
                                Stress Level
                            </th>
                            <th className="text-outline px-6 py-4 text-[11px] font-black tracking-wider uppercase">
                                Cost of Error
                            </th>
                            <th className="text-outline px-6 py-4 text-right text-[11px] font-black tracking-wider uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-outline-variant divide-y">
                        {tasks.data.map((task, index) => {
                            const shouldOpenUp = index >= tasks.data.length - 2;

                            return (
                                <tr
                                    key={task.id}
                                    onClick={() =>
                                        router.get(`/tasks/${task.id}/audits`)
                                    }
                                    className="group cursor-pointer transition-colors hover:bg-accent/20"
                                >
                                    <td className="px-6 py-4">
                                        <span className="rounded bg-blue-50 px-2 py-1 text-xs font-bold text-primary dark:bg-secondary/50">
                                            T-{task.id}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="block max-w-62.5 overflow-hidden text-sm font-bold text-ellipsis whitespace-nowrap">
                                            {task.task_name}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <PersonStanding className="text-card-foreground" />
                                            <span className="flex flex-row text-sm text-card-foreground">
                                                {task.user_type ===
                                                'standard_user'
                                                    ? 'Standard User'
                                                    : task.user_type ===
                                                        'novice_user'
                                                      ? 'Novice'
                                                      : 'Critical Operator'}
                                                <ChevronRight className="overflow-hidden text-ellipsis whitespace-nowrap text-card-foreground-secondary" />
                                                <span className="max-w-62.5 overflow-hidden text-sm text-ellipsis whitespace-nowrap text-card-foreground">
                                                    {task.user_role}
                                                </span>
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <p className="max-w-50 overflow-hidden text-xs text-ellipsis whitespace-nowrap text-card-foreground">
                                            {task.user_intent}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-3 py-2 text-[15px] font-bold ${getStressLevelClasses(task.stress_level)}`}
                                        >
                                            {task.stress_level}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-3 py-2 text-[15px] font-bold ${getCostOfErrorClasses(task.cost_of_error)}`}
                                        >
                                            {task.cost_of_error}
                                        </span>
                                    </td>

                                    <td className="relative px-6 py-4 text-right">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                setOpenMenuTaskId((current) =>
                                                    current === task.id
                                                        ? null
                                                        : task.id,
                                                );
                                            }}
                                            className="rounded-full text-primary transition-colors group-hover:text-secondary hover:cursor-crosshair"
                                        >
                                            <EllipsisVertical className="size-4" />
                                        </button>

                                        {openMenuTaskId === task.id && (
                                            <div
                                                className={`border-outline-variant absolute right-6 z-30 min-w-44 rounded-xl border bg-card p-2 shadow-xl ${
                                                    shouldOpenUp
                                                        ? 'bottom-10'
                                                        : 'top-10'
                                                }`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuTaskId(null);
                                                        onEditTask(task);
                                                    }}
                                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-card-foreground transition-colors hover:bg-surface-container-low"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Edit task
                                                </button>

                                                {onDeleteTask && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setOpenMenuTaskId(
                                                                null,
                                                            );
                                                            onDeleteTask(task);
                                                        }}
                                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-surface-container-low"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete task
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {tasks.total <= 3 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className={cn(
                                        tasks.total <= 2
                                            ? 'h-[15vh]'
                                            : 'h-[10vh]',
                                    )}
                                />
                            </tr>
                        )}
                        <tr className="h-15">
                            <td
                                colSpan={7}
                                className="relative overflow-hidden p-0"
                            >
                                <div className="glass-primary relative h-15 w-full">
                                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="border-outline-variant flex items-center justify-between border-t bg-surface-container-low px-6 py-4">
                <span className="text-outline text-xs font-medium">
                    Showing {tasks.from ?? 0}-{tasks.to ?? 0} of {tasks.total}{' '}
                    tasks
                </span>

                <div className="flex gap-2">
                    {prevUrl ? (
                        <Link
                            href={prevUrl}
                            preserveScroll
                            className="border-outline-variant rounded border p-1 transition-colors hover:bg-accent"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    ) : (
                        <button
                            type="button"
                            className="border-outline-variant rounded border p-1 transition-colors hover:bg-accent disabled:opacity-50"
                            disabled
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                    )}

                    {nextUrl ? (
                        <Link
                            href={nextUrl}
                            preserveScroll
                            className="border-outline-variant rounded border p-1 transition-colors hover:bg-accent"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    ) : (
                        <button
                            type="button"
                            className="border-outline-variant rounded border p-1 transition-colors hover:bg-accent disabled:opacity-50"
                            disabled
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskIndex;
