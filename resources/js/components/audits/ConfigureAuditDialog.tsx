import { router } from '@inertiajs/react';
import { Bolt, Check, CopyPlus, ImagePlus, Loader2, X } from 'lucide-react';

import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';


import { useRef, useState, useEffect } from 'react';
import React from 'react';

import { route } from 'ziggy-js';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import type { Artifact, EvaluationPattern, Task } from '@/types';


pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

type Props = {
    open: boolean;
    onClose: () => void;
    task: Task;
    evaluationPatterns: EvaluationPattern[];
};

export default function ConfigureAuditDialog({
    open,
    onClose,
    task,
    evaluationPatterns,
}: Props) {
    const [activeTab, setActiveTab] = useState<
        'screenshots' | 'evaluation_patterns' | 'setup'
    >('screenshots');

    const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
    const [artifactToDelete, setArtifactToDelete] = useState<number | null>(null);
    const [deleteWarningMessage, setDeleteWarningMessage] = useState<string | null>(null);

    const [isUploadingPDF, setIsUploadingPDF] = useState(false);

    const [aiProvider, setAiProvider] = useState<string>('openai');
    const [aiModel, setAiModel] = useState<string>('gpt-4o-mini');

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [flippedArtifactId, setFlippedArtifactId] = useState<number | null>(null);
    const [artifactPageUrlDrafts, setArtifactPageUrlDrafts] = useState<Record<number, string>>({});

    const [selectedEvaluationPatternIds, setSelectedEvaluationPatternIds] = useState<number[]>([]);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const getArtifactPageUrl = (artifact: Artifact) => {
        return artifactPageUrlDrafts[artifact.id] ?? artifact.page_url ?? '';
    }

    const saveArtifactPageUrl = (artifactId: number) => {
        router.patch(`/tasks/${task.id}/artifacts/${artifactId}/page-url`, {
            page_url: artifactPageUrlDrafts[artifactId] ?? '',
        },
        {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setArtifactPageUrlDrafts((current) => {
                    const next = { ...current };
                    delete next[artifactId];

                    return next;
                });
            },
        });
    }


    const deleteArtifact = (artifactId: number) => {

        setArtifactToDelete(artifactId);

        router.delete(`/tasks/${task.id}/artifacts/${artifactId}`, {
            preserveScroll: true,
            preserveState: true,

            onError: (errors) => {
                setDeleteWarningMessage(errors.artifact);
                setDeleteWarningOpen(true);
            },

            onSuccess: () => {
                setDeleteWarningMessage(null);
                setDeleteWarningMessage(null);
            }
        });
    };

    const forceDeleteArtifact = () => {
        if (!artifactToDelete) {
            return;
        }

        router.delete(`/tasks/${task.id}/artifacts/${artifactToDelete}`, {
            data: {
                force: true,
            },
            preserveScroll: true,
            preserveState: true,

            onSuccess: () => {
                setDeleteWarningOpen(false);
                setArtifactToDelete(null);
                setDeleteWarningMessage(null);
            },
        });
    };

    const convertPDFtoImage = async (file: File): Promise<File[]> => {
        const arrayBuffer = await file.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({
            data: arrayBuffer,
        }).promise;

        const images: File[] = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);

            const viewport = page.getViewport({ scale: 2.0 });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (!context) {
                throw new Error('Failed to create canvas context');
            }

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvas,
                canvasContext: context,
                viewport,
            }).promise;

            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(
                    (result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(
                                new Error(
                                    'Unable to convert PDF page to image.',
                                ),
                            );
                        }
                    },
                    'image/jpeg',
                    1.0,
                );
            });

            images.push(
                new File([blob], `step_${pageNum}_${Date.now()}.jpg`, {
                    type: 'image/jpeg',
                }),
            );
        }

        return images;
    };

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = Array.from(event.target.files ?? []);

        if (files.length === 0) {
            return;
        }

        setIsUploadingPDF(true);

        try {
            const finalFilesToUpload: File[] = [];

            for (const file of files) {
                if (file.type === 'application/pdf') {
                    const convertedImages = await convertPDFtoImage(file);
                    finalFilesToUpload.push(...convertedImages);
                } else {
                    finalFilesToUpload.push(file);
                }
            }

            router.post(
                `/tasks/${task.id}/artifacts`,
                {
                    images: finalFilesToUpload,
                },
                {
                    forceFormData: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    },
                    onError: (errors) => {
                        console.error('Error uploading files:', errors);
                    },
                    onFinish: () => {
                        setIsUploadingPDF(false);
                    },
                },
            );
        } catch (error) {
            console.error('PDF conversion error:', error);
            alert('Unable to read the PDF. Check the console.');

            setIsUploadingPDF(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const toggleEvaluationPattern = (patternId: number) => {
        setSelectedEvaluationPatternIds((current) =>
            current.includes(patternId)
                ? current.filter((id) => id !== patternId)
                : [...current, patternId],
        );
    };

    console.log(selectedEvaluationPatternIds);
    console.log(aiProvider);

    const startAudit = () => {
        router.post(
            route('tasks.run-analysis', task.id),
            {
                provider: aiProvider,
                model: aiModel,
                evaluation_pattern_ids: selectedEvaluationPatternIds,
            },
            {
                preserveScroll: true,
                preserveState: true,

                onStart: () => {
                    console.log('Starting audit payload:', {
                        provider: aiProvider,
                        model: aiModel,
                        evaluation_pattern_ids: selectedEvaluationPatternIds,
                    });
                },

                onError: (errors) => {
                    console.error('Audit validation errors:', errors);
                },

                onSuccess: () => {
                    console.log('Audit request completed successfully');
                    onClose();
                },
            },
        );
    };



    const artifacts = task.artifacts ?? [];


    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
            <div className="border-outline-variant w-full max-w-5xl overflow-hidden rounded-4xl border bg-card shadow-2xl">
                <div className="flex items-start justify-between gap-6 border-b border-border p-8">
                    <div>
                        <h2 className="font-display text-2xl font-black tracking-tight text-foreground uppercase">
                            Configure Interface Audit
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Upload task screenshots, review artifacts, and start
                            the interface analysis.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-muted-foreground transition hover:bg-surface-container-high hover:text-foreground"
                        aria-label="Close dialog"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="border-b border-border px-8 pt-6">
                    <div className="rounded-2xl bg-surface-container-low p-1">
                        <div className="grid grid-cols-3 gap-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab('screenshots')}
                                className={`rounded-xl px-4 py-3 text-xs font-black tracking-widest uppercase transition-all ${
                                    activeTab === 'screenshots'
                                        ? 'bg-card text-primary shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Screenshots
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setActiveTab('evaluation_patterns')
                                }
                                className={`rounded-xl px-4 py-3 text-xs font-black tracking-widest uppercase transition-all ${
                                    activeTab === 'evaluation_patterns'
                                        ? 'bg-card text-primary shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Evalutaion
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('setup')}
                                className={`rounded-xl px-4 py-3 text-xs font-black tracking-widest uppercase transition-all ${
                                    activeTab === 'setup'
                                        ? 'bg-card text-primary shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Audit Setup
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden p-8">
                    <div
                        className="flex transition-transform duration-300 ease-out"
                        style={{
                            transform:
                                activeTab === 'screenshots'
                                    ? 'translateX(0%)'
                                    : activeTab === 'evaluation_patterns'
                                      ? 'translateX(-100%)'
                                      : 'translateX(-200%)',
                        }}
                    >
                        <section className="w-full shrink-0 space-y-6 pr-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                accept="image/*, application/pdf"
                                onChange={handleFileUpload}
                            />

                            <div className="border-outline-variant rounded-3xl border border-dashed bg-surface-container-low p-8">
                                <div className="flex items-start justify-between gap-6">
                                    <div>
                                        <h3 className="font-display text-lg font-black tracking-tight text-foreground uppercase">
                                            Add Screenshots
                                        </h3>

                                        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                                            Upload interface screenshots or a
                                            PDF. Each PDF page will be converted
                                            into an image artifact.
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={triggerFileInput}
                                        disabled={isUploadingPDF}
                                        className="gap-2 rounded-2xl px-6 py-5 text-xs font-black tracking-widest uppercase"
                                    >
                                        {isUploadingPDF ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                Uploading
                                            </>
                                        ) : (
                                            <>
                                                <CopyPlus className="size-4" />
                                                Add Files
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {artifacts.length > 0 ? (
                                    <div className="scrollbar-hide mt-8 grid max-h-87.5 grid-cols-2 gap-4 overflow-y-scroll md:grid-cols-3">
                                        {artifacts.map((artifact, index) => (
                                            <div
                                                key={artifact.id}
                                                className="group relative opacity-70 transition-opacity hover:opacity-100"
                                            >
                                                <div className="relative aspect-video [prespective:1000px]">
                                                    <div
                                                        className={`relative h-full w-full transition-transform duration-500 transform-3d ${
                                                            flippedArtifactId ===
                                                            artifact.id
                                                                ? 'transform-[rotateY(180deg)]'
                                                                : ''
                                                        }`}
                                                    >
                                                        {/*FRONT SIDE */}
                                                        <div
                                                            onClick={() =>
                                                                setFlippedArtifactId(
                                                                    artifact.id,
                                                                )
                                                            }
                                                            className="boder-border absolute inset-0 cursor-pointer overflow-hidden rounded-2xl border bg-card backface-hidden"
                                                        >
                                                            <X
                                                                onClick={(
                                                                    event,
                                                                ) => {
                                                                    event.stopPropagation();
                                                                    deleteArtifact(
                                                                        artifact.id,
                                                                    );
                                                                }}
                                                                className="absolute top-2 right-2 z-10 hidden size-5 cursor-pointer rounded-full text-destructive group-hover:block hover:scale-120 hover:bg-destructive/20"
                                                            />
                                                            <img
                                                                className="h-full w-full object-cover"
                                                                alt={`Screenshot ${index + 1}`}
                                                                src={
                                                                    artifact.image_url
                                                                }
                                                            />

                                                            <div className="absolute inset-x-0 bottom-0 bg-black/45 px-3 py-2 text-[10px] font-black tracking-widest uppercase opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                                                                Click to edit
                                                                relative page
                                                                URL
                                                            </div>
                                                        </div>
                                                        {/*BACKSIDE */}
                                                        <div
                                                            className="absolute inset-0 flex transform-[rotateY(180deg)] cursor-pointer flex-col justify-between rounded-2xl border border-border bg-card p-4 backface-hidden"
                                                            onClick={() =>
                                                                setFlippedArtifactId(
                                                                    null,
                                                                )
                                                            }
                                                        >
                                                            <label className="text-10 cursor-pointer font-black tracking-widest text-muted-foreground uppercase">
                                                                Page URL
                                                            </label>
                                                            <Button
                                                                variant={
                                                                    'secondary'
                                                                }
                                                                onClick={() =>
                                                                    saveArtifactPageUrl(
                                                                        artifact.id,
                                                                    )
                                                                }
                                                                className="absolute top-3 right-3 size-8 cursor-pointer hover:scale-115"
                                                                size="icon"
                                                            >
                                                                <Check className="size-7" />
                                                            </Button>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    artifactPageUrlDrafts[
                                                                        artifact
                                                                            .id
                                                                    ] ??
                                                                    artifact.page_url ??
                                                                    ''
                                                                }
                                                                onClick={(
                                                                    event,
                                                                ) =>
                                                                    event.stopPropagation()
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) => {
                                                                    event.preventDefault();
                                                                    setArtifactPageUrlDrafts(
                                                                        (
                                                                            current,
                                                                        ) => ({
                                                                            ...current,
                                                                            [artifact.id]:
                                                                                event
                                                                                    .target
                                                                                    .value,
                                                                        }),
                                                                    );
                                                                }}
                                                                placeholder="https://example.com/login"
                                                                className="mt-3 w-full rounded-xl border border-border bg-card-highest px-3 py-2 text-sm font-medium text-foreground transition outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                            />
                                                            <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                                                                This URL will be
                                                                used as extra
                                                                context for the
                                                                AI analysis of
                                                                this screenshot.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <span className="mt-2 block text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                    Step {index + 1}
                                                </span>
                                                {/*{(artifactPageUrlDrafts[
                                                    artifact.id
                                                ] ||
                                                    artifact.page_url) && (
                                                    <span className="mt-1 block truncate text-[10px] text-primary">
                                                        {artifactPageUrlDrafts[
                                                            artifact.id
                                                        ] || artifact.page_url}
                                                    </span>
                                                )}*/}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={triggerFileInput}
                                        disabled={isUploadingPDF}
                                        className="border-outline-variant mt-8 flex w-full cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed bg-card/60 p-10 text-center transition hover:border-primary hover:bg-card"
                                    >
                                        <ImagePlus className="mb-3 size-8 text-primary" />

                                        <span className="text-sm font-bold text-foreground">
                                            No screenshots yet
                                        </span>

                                        <span className="mt-1 text-xs text-muted-foreground">
                                            Click here to upload screenshots or
                                            a PDF.
                                        </span>
                                    </button>
                                )}
                            </div>
                        </section>

                        <section className="w-full shrink-0 space-y-6 px-3">
                            <div className="rounded-3xl border border-border bg-surface-container-low p-8">
                                <div className="flex items-start justify-between gap-6">
                                    <div>
                                        <h3 className="font-display text-lg font-black tracking-tight text-foreground uppercase">
                                            Evaluation Patterns
                                        </h3>

                                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                                            Select the Evaluation Patterns that
                                            the AI should use during the
                                            interface audit. These patterns
                                            define the human-factor and
                                            usable-security criteria used to
                                            inspect the uploaded screenshots.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-border bg-card px-4 py-3 text-right">
                                        <span className="block text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                            Selected
                                        </span>

                                        <span className="text-2xl font-black text-primary"></span>
                                    </div>
                                </div>

                                <div className="scrollbar-hide mt-8 grid max-h-90 grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2">
                                    {evaluationPatterns.map((pattern) => {
                                        const selected =
                                            selectedEvaluationPatternIds.includes(
                                                pattern.id,
                                            );

                                        return (
                                            <button
                                                key={pattern.id}
                                                type="button"
                                                onClick={() =>
                                                    toggleEvaluationPattern(
                                                        pattern.id,
                                                    )
                                                }
                                                className={`rounded-2xl border p-5 text-left transition-all ${
                                                    selected
                                                        ? 'border-primary bg-primary/10 shadow-sm'
                                                        : 'border-border bg-card hover:border-primary/60 hover:bg-card-high'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                                {pattern.h_id}
                                                            </span>

                                                            {pattern.human_factor && (
                                                                <span className="rounded-md bg-surface-container-high px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                                                                    {
                                                                        pattern
                                                                            .human_factor
                                                                            .name
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>

                                                        <h4 className="mt-3 text-sm font-black text-foreground">
                                                            {pattern.title}
                                                        </h4>

                                                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                                                            {pattern.audit_rule ??
                                                                pattern.trigger}
                                                        </p>
                                                    </div>

                                                    <div
                                                        className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                                                            selected
                                                                ? 'border-primary bg-primary text-primary-foreground'
                                                                : 'border-border bg-surface-container-low'
                                                        }`}
                                                    >
                                                        {selected && (
                                                            <Check className="size-4" />
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        <section className="w-full shrink-0 space-y-6 pl-3">
                            <div className="rounded-3xl border border-border bg-surface-container-low p-8">
                                <h3 className="font-display text-lg font-black tracking-tight text-foreground uppercase">
                                    Audit Setup
                                </h3>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Review the current task artifacts before
                                    starting the audit.
                                </p>

                                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="rounded-2xl border border-border bg-card p-5 flex flex-row gap-8">
                                        <div className="border-r border-border  pr-8">
                                            <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                Screenshots
                                            </span>

                                            <p className="mt-2 text-3xl font-black text-primary text-center">
                                                {artifacts.length}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                                Patterns
                                            </span>

                                            <p className="mt-2 text-3xl font-black text-primary text-center">
                                                {selectedEvaluationPatternIds.length === 0 ? (
                                                    "All"
                                                ) : (
                                                    selectedEvaluationPatternIds.length
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-border bg-card p-5">
                                        <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                            AI Provider
                                        </label>

                                        <select
                                            value={aiProvider}
                                            onChange={(event) =>
                                                setAiProvider(
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-3 w-full rounded-xl border border-border bg-surface-container-low px-3 py-2 text-sm font-bold text-foreground transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="openai">
                                                OpenAI
                                            </option>
                                            <option value="anthropic">
                                                Anthropic
                                            </option>
                                            <option value="google">
                                                Google
                                            </option>
                                        </select>
                                    </div>

                                    <div className="rounded-2xl border border-border bg-card p-5">
                                        <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                            AI Model
                                        </label>

                                        <select
                                            value={aiModel}
                                            onChange={(event) =>
                                                setAiModel(event.target.value)
                                            }
                                            className="mt-3 w-full rounded-xl border border-border bg-surface-container-low px-3 py-2 text-sm font-bold text-foreground transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        >
                                            {aiProvider === 'openai' && (
                                                <>
                                                    <option value="">
                                                        Default
                                                    </option>
                                                    <option value="gpt-4o">
                                                        GPT-4o
                                                    </option>
                                                    <option value="gpt-4o-mini">
                                                        GPT-4o mini
                                                    </option>
                                                    <option value="gpt-4.1">
                                                        GPT-4.1
                                                    </option>
                                                    <option value="gpt-4.1-mini">
                                                        GPT-4.1 mini
                                                    </option>
                                                </>
                                            )}

                                            {aiProvider === 'anthropic' && (
                                                <>
                                                    <option value="">
                                                        Default
                                                    </option>
                                                    <option value="claude-3-5-sonnet">
                                                        Claude 3.5 Sonnet
                                                    </option>
                                                    <option value="claude-3-haiku">
                                                        Claude 3 Haiku
                                                    </option>
                                                </>
                                            )}

                                            {aiProvider === 'google' && (
                                                <>
                                                    <option value="">
                                                        Default
                                                    </option>
                                                    <option value="gemini-1.5-pro">
                                                        Gemini 1.5 Pro
                                                    </option>
                                                    <option value="gemini-1.5-flash">
                                                        Gemini 1.5 Flash
                                                    </option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-8 rounded-2xl border border-border bg-card p-5">
                                    <h4 className="text-sm font-black tracking-widest text-foreground uppercase">
                                        Ready to start?
                                    </h4>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        The analysis should start only after at
                                        least one screenshot has been uploaded.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-border bg-card p-8">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isUploadingPDF}
                        className="px-8 tracking-widest uppercase"
                    >
                        Cancel
                    </Button>

                    <div className="flex items-center gap-3">
                        {activeTab !== 'screenshots' && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() =>
                                    setActiveTab(
                                        activeTab === 'setup'
                                            ? 'evaluation_patterns'
                                            : 'screenshots',
                                    )
                                }
                                className="px-8 tracking-widest uppercase"
                            >
                                Back
                            </Button>
                        )}

                        {activeTab === 'screenshots' && (
                            <Button
                                type="button"
                                onClick={() =>
                                    setActiveTab('evaluation_patterns')
                                }
                                disabled={isUploadingPDF}
                                className="rounded-2xl px-10 py-6 text-xs font-black tracking-widest uppercase"
                            >
                                Continue
                            </Button>
                        )}

                        {activeTab === 'evaluation_patterns' && (
                            <Button
                                type="button"
                                onClick={() => setActiveTab('setup')}
                                className="rounded-2xl px-10 py-6 text-xs font-black tracking-widest uppercase"
                            >
                                Continue
                            </Button>
                        )}

                        {activeTab === 'setup' && (
                            <Button
                                type="button"
                                onClick={startAudit}
                                disabled={
                                    isUploadingPDF || artifacts.length === 0
                                }
                                className="gap-2 rounded-2xl px-10 py-6 text-xs font-black tracking-widest uppercase"
                            >
                                <Bolt className="size-4" />
                                Start Audit
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <AlertDialog
                open={deleteWarningOpen}
                onOpenChange={setDeleteWarningOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete screenshot and related findings?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            {deleteWarningMessage ??
                                'This screenshot has findings linked to it. Deleting it will also delete those findings.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setArtifactToDelete(null);
                                setDeleteWarningMessage(null);
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction onClick={forceDeleteArtifact}>
                            Delete screenshot and findings
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
