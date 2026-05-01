import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

import {
    Bot,
    Bolt,
    ChevronsLeft,
    Info,
    Layers,
    Pencil,
    Send,
    Settings2,
    TriangleAlert,
    ZoomIn,
    ZoomOut,
    CopyPlus,
} from 'lucide-react';

import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import {  useState, useMemo, useRef } from 'react';

import React from 'react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

import AuditActionMenu from '@/components/audits/AuditActionMenu';
import { Button } from '@/components/ui/button';

import type { StudyCase, Task, EvaluationPattern } from '@/types';


type Props = {
    evaluationPattern: EvaluationPattern [];
    studyCase: StudyCase;
    task: Task;
};







const InterfaceAudit = ({ studyCase, task, evaluationPattern }: Props) => {

    const [isUploadingPDF, setIsUploadingPDF] = useState(false);


    const FileInputRef = useRef<HTMLInputElement | null>(null);

    const triggerFileInput = () => {
        FileInputRef.current?.click();
    }

    const convertPDFtoImage = async (file: File): Promise<File[]> => {
        const arrayBuffer = await file.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({
            data: arrayBuffer,
        }).promise

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
                            reject(new Error('Unable to convert PDF page to image.'));
                        }
                    },
                    'image/jpeg',
                    1.0,
                );
            });

            const imageFile = new File(
                [blob],
                `step_${pageNum}_${Date.now()}.jpg`,
                {
                    type: 'image/jpeg',
                },
            );
            images.push(imageFile);
        }

        return images;
    };

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    )=> {
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
                        if (FileInputRef.current) {
                            FileInputRef.current.value = '';
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

            if (FileInputRef.current) {
                FileInputRef.current.value = '';
            }
        }

    }



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
                        onExport={() =>
                            console.log('Export audit report:', task.id)
                        }
                        onDelete={() =>
                            console.log('Delete audit task:', task.id)
                        }
                    />
                </div>
            </header>

            <div className="flex h-screen overflow-hidden pt-16">
                <aside className="flex w-72 flex-col border-r border-border bg-card text-card-foreground">
                    <div className="flex grow flex-col overflow-y-auto p-6">
                        <div className="mb-8 flex items-center gap-2">
                            <Settings2 className="size-5 text-primary" />
                            <h2 className="text-lg font-bold text-foreground">
                                Setup Operativo
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    User Persona
                                </label>

                                <div className="flex items-center justify-between rounded-lg border border-border bg-muted p-3">
                                    <span className="text-sm text-foreground">
                                        {task.user_type ?? 'Standard'}
                                    </span>

                                    <Pencil className="size-4 text-muted-foreground" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Intent
                                </label>

                                <div className="rounded-lg border border-border bg-muted p-3">
                                    <span className="text-sm text-foreground">
                                        {task.user_intent ??
                                            'Subscription flow'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Stress Level
                                </label>

                                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                                    <div className="h-1.5 grow overflow-hidden rounded-full bg-background">
                                        <div
                                            className="h-full bg-primary dark:bg-secondary"
                                            style={{
                                                width: `${(task.stress_level ?? 6) * 10}%`,
                                            }}
                                        />
                                    </div>

                                    <span className="text-xs font-extrabold text-primary dark:text-secondary">
                                        {task.stress_level ?? 6}/10
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Cost of Error
                                </label>

                                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                                    <span className="text-sm font-bold text-destructive uppercase">
                                        {task.cost_of_error ?? 'Critical'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <div className="mb-2 flex flex-row justify-between">
                                <label className="mb-4 block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Screenshots
                                </label>
                                <input
                                    type="file"
                                    ref={FileInputRef}
                                    className="fileInput hidden"
                                    multiple
                                    accept="image/*, application/pdf"
                                    onChange={handleFileUpload}
                                />
                                <CopyPlus
                                    className="size-5 text-primary hover:scale-120 hover:text-secondary dark:text-secondary dark:hover:text-primary"
                                    onClick={triggerFileInput}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="group relative cursor-pointer">
                                    <div className="aspect-video overflow-hidden rounded-md border-2 border-primary ring-2 ring-primary/20">
                                        <img
                                            className="h-full w-full object-cover"
                                            alt="Screenshot step 1"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8lEHMAVrkfT5n3YudBV5Y8yhPifn028uwlk1XqPqXWa6ohn4lzrqM1k21WCjQbn8l_H8gst_tddxHR9oP2CyY8oWl_UwE4-fvstxG7UizNa5HXjcBPKV1DoducfykZhf11n_8v9RtlmhZYyJ0BRq_W0oB-kh7bJvHnOSqh7YQCF6ybtdpyB163P8khYT36muUs5ZaQ1ojXCyuqbjEV0wpFq33mobjg8AHHNzLLhe1owVdAsBflabRL9nQJK6uC7pqYb9n0Ix3r-g"
                                        />
                                    </div>

                                    <span className="mt-1.5 block text-[10px] font-medium text-primary">
                                        Step 1
                                    </span>
                                </div>

                                <div className="group relative cursor-pointer opacity-50 transition-opacity hover:opacity-100">
                                    <div className="aspect-video overflow-hidden rounded-md border border-border">
                                        <img
                                            className="h-full w-full object-cover"
                                            alt="Screenshot step 2"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPBW2UnA1s_-JaamJJH5ckB1nGn7m-1UzrO6MNRRFjcJ_zpTdWjSTuYn2vqQ49s2_nF8BG9C_PlajOFSg6pKlHfuMINjVB_pxGMfNgPfAUyJqWGPgTphdkvU58Gf8GaTj-UR0wV59bBgJB2zFRIQnJzji-ovKWTdnNzLoAto-_ExGMibaCZdZs-eIFJc6NUCBs2WyIcCfkzr10mYxjsO3cdAeDwKM13dmDwv6q65lqkt7layuccB7MJmKzlXvLyewGaZrkEr3IHic"
                                        />
                                    </div>

                                    <span className="mt-1.5 block text-[10px] font-medium text-muted-foreground">
                                        Step 2
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border bg-card p-6">
                        <Button
                            type="button"
                            className="w-full gap-2 rounded-xl py-6 font-bold shadow-lg shadow-primary/20 hover:opacity-90"
                        >
                            <Bolt className="size-5" />
                            <span>Configura e Avvia Audit</span>
                        </Button>
                    </div>
                </aside>

                <main className="canvas-grid relative flex grow flex-col items-center justify-center overflow-hidden bg-muted p-8">
                    <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                        <div className="flex items-center gap-4 border-b border-border bg-muted px-4 py-3">
                            <div className="flex gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                                <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                                <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                            </div>

                            <div className="grow rounded-md border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                                morpheus.ai/app/v1/subscription
                            </div>
                        </div>

                        <div className="relative">
                            <img
                                className="w-full"
                                alt="A clean web form interface"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFubvng3JtX4rdK2MYRw-Ppin0OI4PMHBDSz63IoYknX_l537Q2jR-z57yVt4WhKsd4blEegg4TOHf7ONF104dTh1EN2Hv77ZvJ-KiFUDdI3dCoCLupdXm2LgCzCu6cijwfA2VleV-P1wAc6E2D1UJOE7FHFhFHYzCxRLZeIr8yHpjSuKsi_lvkD9d3ZcaKihu6zjAFo3Fd12tEAkP5a1tItgc6W0BzIRTE19s0WVPhD1DWuK_-lIDYz7o4zkZH-hZp4uN9McFUZI"
                            />

                            <div className="absolute top-[35%] left-[25%] h-[12%] w-[40%] rounded-sm border-2 border-destructive bg-destructive/10">
                                <div className="absolute -top-6 -left-0.5 flex items-center gap-1 rounded-t-sm bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">
                                    <TriangleAlert className="size-3.5" />
                                    H02
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card/80 p-1.5 shadow-xl backdrop-blur-md">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                            <ZoomIn className="size-5" />
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                            <ZoomOut className="size-5" />
                        </Button>

                        <div className="mx-1 h-4 w-px bg-border" />

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                            <Layers className="size-5" />
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                            <Info className="size-5" />
                        </Button>
                    </div>
                </main>

                <aside className="flex w-96 flex-col border-l border-border bg-card text-card-foreground">
                    <div className="flex border-b border-border">
                        <Button
                            type="button"
                            variant="ghost"
                            className="h-auto flex-1 rounded-none border-b-2 border-primary py-4 text-sm font-bold text-primary hover:bg-muted/50 hover:text-primary"
                        >
                            Analisi
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            className="h-auto flex-1 rounded-none py-4 text-sm font-bold text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        >
                            Copilot
                        </Button>
                    </div>

                    <div className="flex grow flex-col overflow-hidden">
                        <div className="border-b border-border bg-muted/50 p-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-foreground">
                                    Detected Problems
                                </h3>

                                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-black tracking-tighter text-destructive">
                                    04
                                </span>
                            </div>
                        </div>

                        <div className="flex-grow space-y-4 overflow-y-auto p-4">
                            <div className="rounded-xl border-2 border-primary/20 bg-primary/10 p-4 ring-4 ring-primary/10">
                                <div className="mb-3 flex items-start gap-3">
                                    <span className="mt-0.5 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                                        H02
                                    </span>

                                    <div>
                                        <h4 className="text-sm font-bold text-foreground">
                                            Concretizing the Abstract Threat
                                        </h4>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Step 1: Lack of Error Prevention
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-primary/20 bg-card/80 p-4 shadow-sm">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Bot className="size-4 text-primary" />

                                        <span className="text-[10px] font-black tracking-widest text-primary uppercase">
                                            Morpheus Copilot Summary
                                        </span>
                                    </div>

                                    <p className="text-xs leading-relaxed text-card-foreground-secondary">
                                        The form lacks real-time validation on
                                        the credit card field, increasing user
                                        cognitive load. The error is only
                                        communicated post-submission, failing
                                        the "Prevention over Recovery"
                                        principle.
                                    </p>
                                </div>
                            </div>

                            <div className="cursor-pointer rounded-xl border border-border p-4 opacity-60 transition-opacity hover:bg-muted/50 hover:opacity-100">
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                                        H01
                                    </span>

                                    <div>
                                        <h4 className="text-sm font-bold text-foreground">
                                            Visibility of System Status
                                        </h4>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            The loading state is ambiguous
                                            during processing.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border bg-card p-4">
                            <div className="relative">
                                <input
                                    className="w-full rounded-xl border border-input bg-input px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                                    placeholder="Chiedi al Copilot..."
                                    type="text"
                                />

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1.5 right-2 text-primary hover:bg-muted"
                                >
                                    <Send className="size-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default InterfaceAudit;
