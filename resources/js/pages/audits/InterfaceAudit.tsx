import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

import {
    Bot,
    Bolt,
    ChevronsLeft,
    Info,
    X,
    SquareArrowOutUpRight,
} from 'lucide-react';

import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import {  useState, useRef } from 'react';

import React from 'react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;


import AgentChat from '@/components/audits/Agent/AgentChat';
import AuditActionMenu from '@/components/audits/AuditActionMenu';
import ConfigureAuditDialog from '@/components/audits/ConfigureAuditDialog';
import EvaluationPatternDetailDialog from '@/components/evaluationPatterns/evaluationPatternDetail';
import { Button } from '@/components/ui/button';
import { useAuditProgress } from '@/hooks/use-audit-progress';


import type {
    StudyCase,
    Task,
    EvaluationPattern,
    Finding,
    Message, HumanFactor,
} from '@/types';


type Props = {
    evaluationPattern: EvaluationPattern [];
    studyCase: StudyCase;
    humanFactors: HumanFactor[];
    task: Task;
    findings: Finding [];
    messages: Message[];
};







const InterfaceAudit = ({ studyCase, task, humanFactors, evaluationPattern, messages }: Props) => {

    const findings = task.findings;

    const [isConfigureAuditOpen, setIsConfigureAuditOpen] = useState(false);

    const [selectedEvaluationPattern, setSelectedEvaluationPattern] = useState<EvaluationPattern | null>(null);

    const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

    const findingRefs = useRef<Record<number, HTMLDivElement | null>>({});

    const [openEP, setOpenEP] = useState<EvaluationPattern | null>(null);

    const scrollTo = (finding: Finding) => {

        if (finding === selectedFinding) {
            return;
        }

        setSelectedFinding(finding);

        if (selectedEvaluationPattern !== null) {
            setSelectedEvaluationPattern(null);
        }

        findingRefs.current[finding.id]?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    }

    const deleteTask = (taskId: number) => {
        console.log('Delete audit task:', task.id)
        router.delete(`/tasks/${taskId}`, {
            preserveScroll: true,
            preserveState: true,
        });


    }

    const resetAudit = (taskId: number) => {
        router.put(`/tasks/${taskId}/reset`, {
            preserveScroll: true,
            preserveState: true,
        })

    }

    const exportTask = (taskId: number) => {

        console.log('Export audit report:', task.id);
        window.open(`/tasks/${taskId}/report`);
    }



    const auditProgress = useAuditProgress({
        taskId: task.id,
        initialProgress: {
            status: task.audit_status ?? 'idle',
            current: task.audit_current ?? 0,
            total: task.audit_total ?? 0,
            message: task.audit_message ?? null,
            error: task.audit_error ?? null,
            findings_count: findings.length,
        },
    });

/*
    const isAuditRunning = auditProgress.status === 'running';

    const progressPercentage =
        auditProgress.total > 0
            ? Math.round((auditProgress.current / auditProgress.total) * 100)
            : 0;
*/

    return (
        <div className="bg-background text-foreground">
            <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-card px-6 text-sm shadow-sm">
                <div className="group relative flex items-center gap-4 pl-24">
                    <Button
                        asChild
                        variant="ghost"
                        className="absolute left-0 h-auto p-0 text-secondary hover:bg-transparent hover:text-secondary"
                    >
                        <Link
                            href={`/study-cases/${studyCase.id}`}
                            aria-label="Back to study case"
                            className="flex items-center gap-1"
                        >
                            <ChevronsLeft className="size-8 opacity-30 transition-all duration-200 group-hover:scale-120" />
                            <ChevronsLeft className="size-9 opacity-60 transition-all duration-200 group-hover:scale-120" />
                            <ChevronsLeft className="size-10 transition-all duration-200 group-hover:scale-120" />
                        </Link>
                    </Button>
                </div>

                <div className="items-center justify-center text-center">
                    <span className="text-2xl font-black tracking-tight text-primary">
                        Morpheus
                    </span>
                    <span className="mx-1 font-light text-muted-foreground">
                        /
                    </span>
                    <span className="font-bold tracking-tight text-foreground">
                        Workspace
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <AuditActionMenu
                        onExport={() => exportTask(task.id)}
                        onDelete={() => deleteTask(task.id)}
                        onReset={() => resetAudit(task.id)}
                    />
                </div>
            </header>

            <div className="mt-16 flex h-[calc(100vh-4rem)] min-h-0 overflow-hidden">
                <aside className="flex w-90 flex-col justify-between space-y-4 border-r border-border bg-card text-card-foreground">
                    <div className="flex max-h-3/4 flex-col space-y-3">
                        <div className="h-full">
                            <label className="block p-6 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                Findings Index
                            </label>
                            <div className="flex max-h-full overflow-y-auto">
                                <div className="h-fit w-full">
                                    {findings?.map((finding) => (
                                        <div
                                            key={finding.id}
                                            ref={(element) => {
                                                findingRefs.current[
                                                    finding.id
                                                ] = element;
                                            }}
                                            className={`group m-2 cursor-pointer rounded-xl border p-4 transition-all ${
                                                selectedFinding?.id ===
                                                finding.id
                                                    ? 'border-primary bg-primary/10 opacity-100 dark:border-secondary dark:bg-secondary/10'
                                                    : 'border-border opacity-60 hover:border-primary hover:bg-muted/50 hover:opacity-100 dark:hover:border-secondary'
                                            }`}
                                            onClick={() => scrollTo(finding)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span
                                                    className={`mt-0.5 rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground ${
                                                        selectedFinding?.id ===
                                                        finding.id
                                                            ? 'bg-primary text-primary-foreground dark:bg-secondary dark:text-secondary-foreground'
                                                            : ''
                                                    }`}
                                                >
                                                    F
                                                    {finding.id
                                                        .toString()
                                                        .padStart(2, '0')}
                                                </span>

                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate text-sm font-bold text-foreground">
                                                        {finding.title}
                                                    </h4>

                                                    <p className="mt-1 truncate text-xs text-muted-foreground">
                                                        {finding.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-15 border-t border-border bg-card p-6">
                        <Button
                            type="button"
                            onClick={() => setIsConfigureAuditOpen(true)}
                            className="w-full cursor-pointer gap-2 rounded-xl py-6 font-bold shadow-lg shadow-primary/20 hover:opacity-90"
                        >
                            <Bolt className="size-5" />
                            <span>Configure and Start Audit</span>
                        </Button>
                    </div>
                </aside>

                <main className="flex grow flex-col items-center overflow-y-scroll bg-muted p-8">
                    <div className="w-full max-w-5xl space-y-8 rounded-xl p-4">
                        {findings?.map((finding) => (
                            <div
                                key={finding.id}
                                ref={(element) => {
                                    findingRefs.current[finding.id] = element;
                                }}
                                className={`scroll-mt-24 rounded-xl border bg-card p-6 shadow-xl backdrop-blur-md transition-all ${
                                    selectedFinding?.id === finding.id
                                        ? 'border-primary bg-primary/5 ring-2 ring-primary/70 dark:border-secondary dark:bg-primary dark:ring-secondary/20'
                                        : 'border-border bg-card'
                                }`}
                                onClick={() => scrollTo(finding)}
                            >
                                <div className="mb-5 flex items-start justify-between gap-6">
                                    <div className="min-w-0">
                                        <span
                                            className={`text-xs font-bold text-muted-foreground ${selectedFinding?.id === finding.id ? 'text-card-foreground dark:text-primary-foreground/80' : ``}`}
                                        >
                                            Finding F
                                            {finding.id
                                                .toString()
                                                .padStart(2, '0')}
                                        </span>

                                        <h2
                                            className={`mt-1 text-xl font-bold ${
                                                selectedFinding?.id ===
                                                finding.id
                                                    ? 'text-primary dark:text-primary-foreground'
                                                    : 'text-foreground'
                                            }`}
                                        >
                                            {finding.title ||
                                                'Untitled finding'}
                                        </h2>

                                        {finding.evaluation_patterns &&
                                            finding.evaluation_patterns.length >
                                                0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {finding.evaluation_patterns.map(
                                                        (pattern) => (
                                                            <div
                                                                key={pattern.id}
                                                                className="group relative inline-flex"
                                                                title={
                                                                    finding.internal_reasoning
                                                                }
                                                            >
                                                                <div
                                                                    onClick={() => {
                                                                        setSelectedFinding(
                                                                            finding,
                                                                        );
                                                                        setSelectedEvaluationPattern(
                                                                            pattern,
                                                                        );
                                                                    }}
                                                                    className={`flex cursor-default flex-row items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors ${
                                                                        selectedEvaluationPattern?.id ===
                                                                        pattern.id
                                                                            ? 'border-primary bg-primary text-primary-foreground ring-4 ring-secondary/50'
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    <SquareArrowOutUpRight
                                                                        className={`mr-2 size-5 cursor-pointer transition-colors hover:text-secondary ${
                                                                            selectedEvaluationPattern?.id ===
                                                                            pattern.id
                                                                                ? 'text-primary-foreground dark:text-secondary'
                                                                                : 'text-card-foreground'
                                                                        }`}
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            setOpenEP(
                                                                                pattern,
                                                                            );
                                                                        }}
                                                                    />
                                                                    <Info
                                                                        className={`size-4 transition-colors ${
                                                                            selectedEvaluationPattern?.id ===
                                                                            pattern.id
                                                                                ? 'text-primary-foreground dark:text-secondary'
                                                                                : 'text-card-foreground'
                                                                        }`}
                                                                    />
                                                                    {'EP'}
                                                                    {pattern.id
                                                                        .toString()
                                                                        .padStart(
                                                                            2,
                                                                            '0',
                                                                        )}{' '}
                                                                    -{' '}
                                                                    {
                                                                        pattern.title
                                                                    }
                                                                </div>

                                                                {pattern.pivot
                                                                    ?.description && (
                                                                    <div className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 hidden w-72 -translate-x-1/2 rounded-lg border border-border bg-card p-3 text-xs leading-relaxed text-card-foreground shadow-xl group-hover:block">
                                                                        {
                                                                            pattern
                                                                                .pivot
                                                                                .description
                                                                        }
                                                                    </div>
                                                                )}
                                                                <EvaluationPatternDetailDialog
                                                                    evaluationPattern={
                                                                        pattern
                                                                    }
                                                                    open={
                                                                        openEP !==
                                                                            null &&
                                                                        openEP.id ===
                                                                            pattern.id
                                                                    }
                                                                    onOpenChange={(
                                                                        open,
                                                                    ) => {
                                                                        if (
                                                                            !open
                                                                        ) {
                                                                            setOpenEP(
                                                                                null,
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                    </div>

                                    {finding.severity === 'high' ? (
                                        <span className="shrink-0 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-card-foreground capitalize shadow-xl dark:text-destructive-foreground">
                                            {finding.severity || 'unknown'}
                                        </span>
                                    ) : finding.severity === 'medium' ? (
                                        <span className="shrink-0 rounded-full bg-alert px-3 py-1 text-xs font-bold text-alert-foreground capitalize shadow-xl">
                                            {finding.severity || 'unknown'}
                                        </span>
                                    ) : (
                                        <span className="bg-color-chart-2 text-color-chart-2/10 shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize shadow-xl">
                                            {finding.severity || 'unknown'}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-row gap-4">
                                    {finding.description && (
                                        <div className="rounded-lg bg-primary p-4">
                                            <h3 className="mb-1 text-sm font-bold text-primary-foreground">
                                                Description
                                            </h3>

                                            <p className="text-sm leading-relaxed text-primary-foreground">
                                                {finding.description}
                                            </p>
                                        </div>
                                    )}

                                    {finding.pragmatic_explanation && (
                                        <div className="rounded-lg bg-muted p-4">
                                            <h3 className="mb-1 text-sm font-bold text-foreground">
                                                Explanation
                                            </h3>

                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                {finding.pragmatic_explanation}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/*finding.pivot?.description && (
                                    <div className="mt-4 rounded-lg border border-border bg-background p-4">
                                        <h3 className="mb-1 text-sm font-bold text-foreground">
                                            Evaluation pattern explanation
                                        </h3>

                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {finding.pivot.description}
                                        </p>
                                    </div>
                                )*/}

                                {finding.attack_scenario && (
                                    <div className="mt-4 rounded-lg border border-border bg-background p-4">
                                        <h3 className="mb-1 text-sm font-bold text-foreground">
                                            Attack Scenario
                                        </h3>

                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {finding.attack_scenario}
                                        </p>
                                    </div>
                                )}

                                {finding.impact && (
                                    <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/70 p-4 dark:bg-destructive">
                                        <h3 className="mb-1 text-sm font-bold dark:text-foreground">
                                            Impact
                                        </h3>

                                        <p className="text-sm leading-relaxed text-shadow-accent dark:text-muted-foreground">
                                            {finding.impact}
                                        </p>
                                    </div>
                                )}

                                {finding.executive_question && (
                                    <div className="mt-4 rounded-lg bg-muted p-4">
                                        <h3 className="mb-1 text-sm font-bold text-foreground">
                                            Executive Question
                                        </h3>

                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {finding.executive_question}
                                        </p>
                                    </div>
                                )}

                                {finding.mitigations?.length > 0 && (
                                    <div className="mt-4 rounded-lg border border-chart-2/20 bg-chart-2 p-4 dark:border-chart-2/20 dark:bg-chart-2">
                                        <h3 className="mb-3 text-sm font-bold text-foreground">
                                            Mitigations
                                        </h3>

                                        <div className="space-y-3">
                                            {finding.mitigations.map(
                                                (mitigation) => (
                                                    <div
                                                        key={mitigation.id}
                                                        className="rounded-lg border border-border bg-card/70 p-4"
                                                    >
                                                        <h4 className="text-sm font-bold text-foreground">
                                                            {mitigation.title}
                                                        </h4>

                                                        {mitigation.description && (
                                                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                                                {
                                                                    mitigation.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {/*{isAuditRunning ? (
                            <ProgressStatusCard
                                status={auditProgress.status}
                                current={auditProgress.current}
                                total={auditProgress.total}
                                message={
                                    auditProgress.message ??
                                    'Analysing evaluation patterns...'
                                }
                                error={auditProgress.error}
                                size="lg"
                                loadingVariant={
                                    auditProgress.total > 0 ? 'both' : 'dots'
                                }
                            />
                        ) : findings.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-border bg-card-high p-8 text-center">
                                <h3 className="font-display text-lg font-black tracking-tight text-secondary uppercase">
                                    No findings yet
                                </h3>

                                <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                                    The interface audit has not started yet, or
                                    no issues have been detected. Upload the
                                    required screenshots and start the audit to
                                    generate security and human-factor findings
                                    for this task.
                                </p>
                            </div>
                        ) : null}*/}
                    </div>
                </main>

                <aside className="flex h-full min-h-0 w-120 shrink-0 flex-col border-l border-border bg-card text-card-foreground">
                    <div className="shrink-0 border-b border-border">
                        <div className="border-b-2 border-primary py-3 text-center text-sm font-bold text-primary">
                            Copilot
                        </div>
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col gap-2 p-2">
                        {selectedFinding === null ? (
                            <div className="shrink-0 rounded-xl border border-dashed border-border bg-card-high/60 p-4 text-center">
                                <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-secondary">
                                    <Bot className="size-5" />
                                </div>

                                <h4 className="text-sm font-bold text-foreground">
                                    No context selected
                                </h4>

                                <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
                                    Select a finding and, optionally, an
                                    evaluation pattern to provide contextual
                                    information to the MORPHEUS Copilot.
                                </p>
                            </div>
                        ) : (
                            <div className="shrink-0 rounded-xl border border-primary/20 ring-2 ring-primary/10">
                                <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-3 ring-2 ring-primary/10">
                                    <div className="flex items-start gap-2">
                                        <span className="shrink-0 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                                            F
                                            {selectedFinding.id
                                                .toString()
                                                .padStart(2, '0')}
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <h4 className="truncate text-sm font-bold text-foreground">
                                                {selectedFinding.title}
                                            </h4>

                                            <p className="mt-1 max-h-12 overflow-y-auto text-xs leading-relaxed text-muted-foreground">
                                                {selectedFinding.description}
                                            </p>
                                        </div>

                                        <Button
                                            className="size-6 shrink-0"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => {
                                                setSelectedFinding(null);
                                                setSelectedEvaluationPattern(
                                                    null,
                                                );
                                            }}
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    </div>

                                    {selectedEvaluationPattern !== null && (
                                        <div className="mt-2 rounded-lg border border-border bg-card-high px-3 py-2">
                                            <div className="flex items-start gap-2">
                                                <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                                                    EP
                                                    {selectedEvaluationPattern.id
                                                        .toString()
                                                        .padStart(2, '0')}
                                                </span>

                                                <div className="min-w-0 flex-1">
                                                    <h5 className="truncate text-xs font-bold text-foreground">
                                                        {
                                                            selectedEvaluationPattern.title
                                                        }
                                                    </h5>

                                                    <p className="mt-1 max-h-10 overflow-y-auto text-xs leading-relaxed text-muted-foreground">
                                                        {
                                                            selectedEvaluationPattern
                                                                .pivot
                                                                ?.description
                                                        }
                                                    </p>
                                                </div>

                                                <Button
                                                    className="size-6 shrink-0"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        setSelectedEvaluationPattern(
                                                            null,
                                                        )
                                                    }
                                                >
                                                    <X className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex min-h-0 flex-1 flex-col justify-end">
                            <AgentChat
                                task={task}
                                messages={messages}
                                className="max-h-full"
                                selectedFinding={selectedFinding}
                                selectedEP={selectedEvaluationPattern}
                            />
                        </div>
                    </div>
                </aside>
            </div>

            <ConfigureAuditDialog
                open={isConfigureAuditOpen}
                onClose={() => setIsConfigureAuditOpen(false)}
                task={task}
                evaluationPatterns={evaluationPattern}
                humanFactors={humanFactors}
            />
        </div>
    );
};

export default InterfaceAudit;
