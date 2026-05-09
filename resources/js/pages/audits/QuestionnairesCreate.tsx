
import { router, useForm } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import { ChevronUp, ChevronDown, ArrowLeftFromLine } from 'lucide-react';
import { Search, Save } from 'lucide-react';
import { useRef } from 'react';

import React from 'react';

import { share } from '@/actions/App/Http/Controllers/QuestionnairesController';

import QuestionCard from '@/components/studyCase/orgLayer/QuestionCard';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';



import type { Question, Questionnaire } from '@/types';

type QuestionnaireForm = {
    title: string;
    description: string;
    status: 'draft' | 'active' | 'closed';

    questions: Question[];
};

type Props = {
    questionnaire: Questionnaire;
    questions: Question[];
}


const QuestionnairesCreate = ({ questionnaire, questions }: Props) => {
    const submitRef = useRef<HTMLButtonElement>(null)

    function submitClick() {
        submitRef.current?.click();
    }

    const shareQuestionnaire = () => {
        const url = `${window.location.origin}/questionnaires/${questionnaire.id}/submit/get`;

        router.put(share(questionnaire.id),
        {
            url:url,
        },
        {
            preserveScroll: true,
        });
    };

    const form = useForm<QuestionnaireForm>({
        title: questionnaire.title ?? '',
        description:
            questionnaire.description ??
            '',
        status: questionnaire.status ?? 'draft',
        questions: (questionnaire.questions ?? []).map((question, index) => ({
            id: question.id,
            title: question.title,
            question: question.question,
            type: question.type,

            position: question.pivot?.position ?? index + 1,
        })),
    });

    const selectQuestionId = React.useMemo(() => {
        return new Set(form.data.questions.map((question) => question.id));
    }, [form.data.questions]);

    const toggleQuestion = (question: Question) => {
        const isAlreadySelected = selectQuestionId.has(question.id);

        if (isAlreadySelected) {
            const updateQuestions = form.data.questions
                .filter((q) => q.id !== question.id)
                .map((q, index) => ({
                    ...q,
                    position: index + 1,
                }));
            form.setData('questions', updateQuestions);

            return;
        }

        form.setData('questions', [
            ...form.data.questions,
            {
                id: question.id,
                title: question.title,
                question: question.question,
                type: question.type,
                position: form.data.questions.length + 1,
            },
        ]);
    };

    const submit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        form.put(`/study-cases/${questionnaire.study_case_id}/questionnaires/${questionnaire.id}/update`, {
            preserveScroll: true,
        });
    }

    const upOrder = (question: Question) => {
        const currentIndex = form.data.questions.findIndex(
            (q) => q.id === question.id,
        );

        if (currentIndex <= 0) {
            return;
        }

        const updatedQuestions = [...form.data.questions];

        const previousQuestion = updatedQuestions[currentIndex - 1];
        updatedQuestions[currentIndex - 1] = updatedQuestions[currentIndex];
        updatedQuestions[currentIndex] = previousQuestion;

        form.setData('questions', normalizePositions(updatedQuestions));
    };

    const normalizePositions = (questions: Question[]) => {
        return questions.map((question, index) => ({
            ...question,
            position: index + 1,
        }));
    };

    const downOrder = (question: Question) => {
        const currentIndex = form.data.questions.findIndex(
            (q) => q.id === question.id,
        );

        if (
            currentIndex === -1 ||
            currentIndex >= form.data.questions.length - 1
        ) {
            return;
        }

        const updatedQuestions = [...form.data.questions];

        const nextQuestion = updatedQuestions[currentIndex + 1];
        updatedQuestions[currentIndex + 1] = updatedQuestions[currentIndex];
        updatedQuestions[currentIndex] = nextQuestion;

        form.setData('questions', normalizePositions(updatedQuestions));
    };

    console.log(form.data)

    return (
        <div>
            <div className="flex h-[calc(100vh)] overflow-hidden">
                <main className="flex flex-1 flex-col overflow-hidden">
                    <div className="flex flex-1 overflow-hidden">
                        <div className="hide-scrollbar flex w-80 flex-col overflow-y-auto border-r border-border bg-card-high">
                            <div className="space-y-8 p-6">
                                <nav aria-label="Breadcrumb">
                                    <ol className="flex items-center space-x-2 text-primary">
                                        <li>
                                            <a
                                                className="group flex items-center gap-1 transition-colors hover:text-secondary"
                                                href="/study-cases"
                                            >
                                                <ArrowLeftFromLine className="size-6 text-primary transition-colors transition-transform group-hover:-translate-x-1 group-hover:text-secondary" />
                                                Back to Study Cases
                                            </a>
                                        </li>
                                    </ol>
                                </nav>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-wider uppercase">
                                        Search Questions
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute top-2 left-3 size-5 text-lg" />

                                        <Input
                                            placeholder="Search questions..."
                                            className="p-3 pl-10"
                                            type="text"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-outline text-xs font-bold tracking-wider uppercase">
                                        Human Factors
                                    </label>
                                    <div className="space-y-2">
                                        <label className="hover:bg-surface-variant/50 flex cursor-pointer items-center gap-3 rounded p-2 transition-colors">
                                            <input
                                                className="border-outline-variant rounded text-primary focus:ring-primary"
                                                type="checkbox"
                                            />
                                            <span className="text-sm font-medium">
                                                Lack of training
                                            </span>
                                        </label>
                                        <label className="hover:bg-surface-variant/50 flex cursor-pointer items-center gap-3 rounded p-2 transition-colors">
                                            <input
                                                className="border-outline-variant rounded text-primary focus:ring-primary"
                                                type="checkbox"
                                            />
                                            <span className="text-sm font-medium">
                                                Time pressure
                                            </span>
                                        </label>
                                        <label className="hover:bg-surface-variant/50 flex cursor-pointer items-center gap-3 rounded p-2 transition-colors">
                                            <input
                                                className="border-outline-variant rounded text-primary focus:ring-primary"
                                                type="checkbox"
                                            />
                                            <span className="text-sm font-medium">
                                                Communication breakdown
                                            </span>
                                        </label>
                                        <label className="hover:bg-surface-variant/50 flex cursor-pointer items-center gap-3 rounded p-2 transition-colors">
                                            <input
                                                className="border-outline-variant rounded text-primary focus:ring-primary"
                                                type="checkbox"
                                            />
                                            <span className="text-sm font-medium">
                                                Fatigue Management
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-outline text-xs font-bold tracking-wider uppercase">
                                        Categories
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <button className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                                            All
                                        </button>
                                        <button className="border-outline-variant rounded-full border bg-card-highest px-3 py-1.5 text-xs font-semibold transition-colors hover:border-primary">
                                            Training
                                        </button>
                                        <button className="border-outline-variant rounded-full border bg-card-highest px-3 py-1.5 text-xs font-semibold transition-colors hover:border-primary">
                                            Procedures
                                        </button>
                                        <button className="border-outline-variant rounded-full border bg-card-highest px-3 py-1.5 text-xs font-semibold transition-colors hover:border-primary">
                                            Hardware
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-outline text-xs font-bold tracking-wider uppercase">
                                        Answer Type
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                className="text-primary focus:ring-primary"
                                                name="atype"
                                                type="radio"
                                            />
                                            <span className="text-sm">
                                                Yes/No
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                className="text-primary focus:ring-primary"
                                                name="atype"
                                                type="radio"
                                            />
                                            <span className="text-sm">
                                                Likert Scale
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                className="text-primary focus:ring-primary"
                                                name="atype"
                                                type="radio"
                                            />
                                            <span className="text-sm">
                                                Free Text
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hide-scrollbar bg-surface flex flex-1 flex-col overflow-y-auto p-8">
                            <div className="mx-auto w-full max-w-4xl space-y-8">
                                <section className="border-outline-variant space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
                                    <form onSubmit={submit}>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="text-on-surface text-sm font-bold">
                                                    Questionnaire Title
                                                </Label>
                                                <Input
                                                    className="border-outline-variant w-full rounded-xl border bg-surface-container-low p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                    placeholder="e.g., Annual Safety Perception Survey 2024"
                                                    type="text"
                                                    value={form.data.title}
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'title',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-on-surface text-sm font-bold">
                                                    Initial Status
                                                </Label>
                                                <div className="border-outline-variant w-full rounded-xl border bg-surface-container-low p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                                                    {questionnaire.status}
                                                </div>
                                            </div>
                                            <div className="space-y-2 md:col-span-3">
                                                <Label className="text-on-surface text-sm font-bold">
                                                    Description (Optional)
                                                </Label>
                                                <textarea
                                                    className="border-outline-variant w-full rounded-xl border bg-surface-container-low p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                    placeholder="Describe the intent of this investigation..."
                                                    value={
                                                        form.data.description
                                                    }
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'description',
                                                            e.target.value,
                                                        )
                                                    }
                                                ></textarea>
                                                <button
                                                    ref={submitRef}
                                                    type="submit"
                                                    className="hidden"
                                                ></button>
                                            </div>
                                        </div>
                                    </form>
                                </section>
                                <div className="space-y-4">
                                    <h3 className="text-outline text-sm font-bold tracking-widest uppercase">
                                        Available Questions (42)
                                    </h3>
                                    {questions?.map((question) => (
                                        <QuestionCard
                                            key={question.id}
                                            question={question}
                                            isSelected={selectQuestionId.has(
                                                question.id,
                                            )}
                                            onToggle={() =>
                                                toggleQuestion(question)
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex w-96 flex-col border-l border-border bg-card-high">
                            <div className="border-outline-variant border-b p-6">
                                <h2 className="font-display text-on-surface text-xl font-extrabold">
                                    Questionnaire Summary
                                </h2>
                                <div className="bg-primary-container/5 border-primary-container/10 mt-4 flex items-center justify-between rounded-xl border p-4">
                                    <div>
                                        <span className="block text-3xl font-black text-primary">
                                            {form.data.questions.length}{' '}
                                        </span>
                                        <span className="text-outline text-xs font-bold uppercase">
                                            Selected Items
                                        </span>
                                    </div>
                                    <span className="material-symbols-outlined text-4xl text-primary opacity-20">
                                        fact_check
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4 overflow-y-auto p-6">
                                <label className="text-outline text-[10px] font-black tracking-widest uppercase">
                                    Added Questions
                                </label>
                                <div className="mt-4 space-y-3">
                                    {form.data.questions.map((question) => (
                                        <div
                                            key={question.id}
                                            className="group flex items-center gap-3"
                                        >
                                            <div className="flex flex-col items-center">
                                                <Button
                                                    onClick={() =>
                                                        upOrder(question)
                                                    }
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-4"
                                                >
                                                    <ChevronUp className="size-4 text-primary" />
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        downOrder(question)
                                                    }
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-4"
                                                >
                                                    <ChevronDown className="size-4 text-primary" />
                                                </Button>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-on-surface truncate text-sm font-bold">
                                                    {question.title}
                                                </p>
                                                <p className="text-outline text-[10px]">
                                                    Human Factor: Time Pressure
                                                </p>
                                            </div>
                                            <Button
                                                variant={'ghost'}
                                                size={'icon'}
                                                className="material-symbols-outlined text-lg text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                close
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="border-outline-variant bg-surface-container-lowest flex flex-col items-center space-y-4 space-x-2 border-t p-6">
                                <Button
                                    className="w-2/3 justify-center"
                                    size={'lg'}
                                    onClick={submitClick}
                                    variant="secondary"
                                    disabled={form.processing}
                                >
                                    <Save className="ml-1 size-5" />
                                    Save
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="lg" className="w-full">
                                            <span>Share Questionnaire</span>
                                            <span className="material-symbols-outlined">
                                                auto_awesome
                                            </span>
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Share this questionnaire?
                                            </AlertDialogTitle>

                                            <AlertDialogDescription>
                                                Once shared, this questionnaire
                                                will be locked. You will no
                                                longer be able to modify its
                                                title, description, status, or
                                                selected questions. This
                                                preserves the consistency of the
                                                answers collected from workers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>

                                            <AlertDialogAction
                                                onClick={shareQuestionnaire}
                                            >
                                                Yes, share and lock it
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
export default QuestionnairesCreate;
