import { useForm } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import { Search, Save } from 'lucide-react';
import { useRef } from 'react';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';



import type { Question, Questionnaire } from '@/types';;




type QuestionnaireForm = {
    title: string;
    description: string;
    status: 'draft' | 'active' | 'closed';

    questions: Question[];
}
type Props = {
    questionnaire: Questionnaire;
}


const QuestionnairesCreate = ({ questionnaire }: Props) => {
    const submitRef = useRef<HTMLButtonElement>(null)

    function submitClick() {
        submitRef.current?.click();
    }

    const form = useForm<QuestionnaireForm>({
        title: questionnaire.title ?? '',
        description:
            questionnaire.description ??
            '',
        status: questionnaire.status ?? 'draft',
        questions: (questionnaire.questions ?? []).map((question, index) => ({
            id: question.id,
            question: question.question ?? 'Insert your question here',

            position: question.pivot?.position ?? index + 1,
        })),
    });

    const submit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        form.put(`/study-cases/${questionnaire.study_case_id}/questionnaires/${questionnaire.id}/update`, {
            preserveScroll: true,
        });
    }


    return (
        <div>
            <div className="flex h-[calc(100vh)] overflow-hidden">
                <main className="flex flex-1 flex-col overflow-hidden">
                    <div className="flex flex-1 overflow-hidden">
                        <div className="border-border hide-scrollbar flex w-80 flex-col overflow-y-auto border-r bg-card-high">
                            <div className="space-y-8 p-6">
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
                                        <button className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white">
                                            All
                                        </button>
                                        <button className="border-outline-variant rounded-full border bg-white px-3 py-1.5 text-xs font-semibold transition-colors hover:border-primary">
                                            Training
                                        </button>
                                        <button className="border-outline-variant rounded-full border bg-white px-3 py-1.5 text-xs font-semibold transition-colors hover:border-primary">
                                            Procedures
                                        </button>
                                        <button className="border-outline-variant rounded-full border bg-white px-3 py-1.5 text-xs font-semibold transition-colors hover:border-primary">
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
                                                <select
                                                    value={form.data.status}
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'status',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="border-outline-variant w-full rounded-xl border bg-surface-container-low p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                >
                                                    <option value="draft">
                                                        Draft
                                                    </option>
                                                    <option value="active">
                                                        Active
                                                    </option>
                                                    <option value="closed">
                                                        Closed
                                                    </option>
                                                </select>
                                            </div>
                                            <div className="space-y-2 md:col-span-3">
                                                <Label className="text-on-surface text-sm font-bold">
                                                    Description (Optional)
                                                </Label>
                                                <textarea
                                                    className="border-outline-variant w-full rounded-xl border bg-surface-container-low p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                    placeholder="Describe the intent of this investigation..."
                                                    value={form.data.description}
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'description',
                                                            e.target.value,
                                                        )
                                                    }
                                                ></textarea>
                                                <button ref={submitRef} type="submit" className="hidden"></button>
                                            </div>
                                        </div>
                                    </form>
                                </section>
                                <div className="space-y-4">
                                    <h3 className="text-outline text-sm font-bold tracking-widest uppercase">
                                        Available Questions (42)
                                    </h3>
                                    <div className="group relative flex gap-6 rounded-2xl border-2 border-border bg-card p-6 shadow-md ring-4 ring-secondary transition-all">
                                        <div className="flex flex-col items-center">
                                            <div className="border-primary-container flex h-6 w-6 items-center justify-center rounded border-2 bg-primary">
                                                <span className="material-symbols-outlined text-lg font-bold text-card-foreground">
                                                    check
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="text-on-surface text-lg font-bold">
                                                        Resource Adequacy under
                                                        Deadline
                                                    </h4>
                                                    <p className="text-on-surface-variant mt-1 italic">
                                                        "Do you feel that the
                                                        resources provided are
                                                        sufficient when project
                                                        deadlines are tightened
                                                        unexpectedly?"
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="bg-tertiary-fixed text-on-tertiary-fixed rounded px-2 py-1 text-[10px] font-black uppercase">
                                                        Time Pressure
                                                    </span>
                                                    <span className="bg-secondary-fixed text-on-secondary-fixed rounded px-2 py-1 text-[10px] font-black uppercase">
                                                        Yes/No
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="bg-error-container/20 border-error-container/30 flex gap-3 rounded-xl border p-4">
                                                <span className="material-symbols-outlined text-error">
                                                    warning
                                                </span>
                                                <div>
                                                    <p className="text-on-error-container text-xs font-bold">
                                                        Risk Explanation
                                                    </p>
                                                    <p className="text-on-error-container/80 text-xs">
                                                        Inadequate resources
                                                        during high-pressure
                                                        periods leads to a 40%
                                                        increase in procedural
                                                        violations and mental
                                                        fatigue.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="group relative flex cursor-pointer gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50">
                                        <div className="flex flex-col items-center">
                                            <div className="border-outline-variant h-6 w-6 rounded border-2 bg-card"></div>
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="text-on-surface text-lg font-bold">
                                                        Standard Operating
                                                        Procedure Clarity
                                                    </h4>
                                                    <p className="text-on-surface-variant mt-1 italic">
                                                        "Are the SOPs for
                                                        emergency shutdowns
                                                        easily accessible and
                                                        understandable in
                                                        high-stress
                                                        environments?"
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="text-on-surface-variant rounded bg-surface-container-high px-2 py-1 text-[10px] font-black uppercase">
                                                        Procedures
                                                    </span>
                                                    <span className="bg-secondary-fixed text-on-secondary-fixed rounded px-2 py-1 text-[10px] font-black uppercase">
                                                        Yes/No
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="bg-surface-container-lowest border-outline-variant flex gap-3 rounded-xl border p-4">
                                                <span className="material-symbols-outlined text-outline">
                                                    info
                                                </span>
                                                <div>
                                                    <p className="text-on-surface text-xs font-bold">
                                                        Risk Explanation
                                                    </p>
                                                    <p className="text-on-surface-variant text-xs">
                                                        Ambiguous procedures are
                                                        the primary catalyst for
                                                        decision-making
                                                        paralysis during
                                                        critical failures.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="group relative flex gap-6 rounded-2xl border-2 border-border bg-card p-6 shadow-md ring-4 ring-secondary transition-all">
                                        <div className="flex flex-col items-center">
                                            <div className="border-primary-container flex h-6 w-6 items-center justify-center rounded border-2 bg-primary">
                                                <span className="material-symbols-outlined text-lg font-bold text-white">
                                                    check
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="text-on-surface text-lg font-bold">
                                                        Pre-task Fatigue
                                                        Assessment
                                                    </h4>
                                                    <p className="text-on-surface-variant mt-1 italic">
                                                        "Rate your level of
                                                        alertness prior to
                                                        starting high-risk
                                                        maintenance tasks."
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="bg-tertiary-fixed text-on-tertiary-fixed rounded px-2 py-1 text-[10px] font-black uppercase">
                                                        Fatigue
                                                    </span>
                                                    <span className="bg-secondary-fixed text-on-secondary-fixed rounded px-2 py-1 text-[10px] font-black uppercase">
                                                        Likert
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="bg-error-container/20 border-error-container/30 flex gap-3 rounded-xl border p-4">
                                                <span className="material-symbols-outlined text-error">
                                                    bedtime
                                                </span>
                                                <div>
                                                    <p className="text-on-error-container text-xs font-bold">
                                                        Risk Explanation
                                                    </p>
                                                    <p className="text-on-error-container/80 text-xs">
                                                        Self-reported high
                                                        fatigue levels correlate
                                                        strongly with a
                                                        reduction in hazard
                                                        perception and slowed
                                                        reaction times.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-border flex w-96 flex-col border-l bg-card-high">
                            <div className="border-outline-variant border-b p-6">
                                <h2 className="font-display text-on-surface text-xl font-extrabold">
                                    Questionnaire Summary
                                </h2>
                                <div className="bg-primary-container/5 border-primary-container/10 mt-4 flex items-center justify-between rounded-xl border p-4">
                                    <div>
                                        <span className="block text-3xl font-black text-primary">
                                            12
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
                                <div className="space-y-3">
                                    <div className="group flex items-start gap-3">
                                        <span className="material-symbols-outlined mt-1 text-sm text-primary">
                                            drag_handle
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-on-surface truncate text-sm font-bold">
                                                Resource Adequacy under Deadline
                                            </p>
                                            <p className="text-outline text-[10px]">
                                                Human Factor: Time Pressure
                                            </p>
                                        </div>
                                        <button className="material-symbols-outlined text-error text-lg opacity-0 transition-opacity group-hover:opacity-100">
                                            close
                                        </button>
                                    </div>
                                    <div className="group flex items-start gap-3">
                                        <span className="material-symbols-outlined mt-1 text-sm text-primary">
                                            drag_handle
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-on-surface truncate text-sm font-bold">
                                                Pre-task Fatigue Assessment
                                            </p>
                                            <p className="text-outline text-[10px]">
                                                Human Factor: Fatigue
                                            </p>
                                        </div>
                                        <button className="material-symbols-outlined text-error text-lg opacity-0 transition-opacity group-hover:opacity-100">
                                            close
                                        </button>
                                    </div>
                                    <div className="group flex items-start gap-3">
                                        <span className="material-symbols-outlined mt-1 text-sm text-primary">
                                            drag_handle
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-on-surface truncate text-sm font-bold">
                                                Onboarding Satisfaction
                                            </p>
                                            <p className="text-outline text-[10px]">
                                                Human Factor: Training
                                            </p>
                                        </div>
                                        <button className="material-symbols-outlined text-error text-lg opacity-0 transition-opacity group-hover:opacity-100">
                                            close
                                        </button>
                                    </div>
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
                                <Button size={'lg'} className="w-full">
                                    <span>Create Questionnaire</span>
                                    <span className="material-symbols-outlined">
                                        auto_awesome
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
export default QuestionnairesCreate;
