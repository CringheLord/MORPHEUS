import { useForm } from '@inertiajs/react';
import { SendHorizontal } from 'lucide-react';
import React from 'react';
import { submit } from '@/actions/App/Http/Controllers/QuestionnairesController'

import { Button } from '@/components/ui/button';

import type { Question, Questionnaire } from '@/types';
type Props = {
    questionnaire: Questionnaire;
    questions: Question[];
}

type answerValue = string | number | boolean | null;
type submitForm = {
    answers: Record<number, answerValue>
}






const QuestionnaireSubmit = ({questionnaire, questions}: Props) => {

    const form = useForm<submitForm>({
        answers: {},
    });

    const setAnswer = (questionId: number, value: answerValue)=> {
        form.setData('answers', {
            ...form.data.answers,
            [questionId]: value,
        });
    };

    const submitForm: React.SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const payload = {
            answers: questions.map((question) => ({
                question_id: question.id,
                value: form.data.answers[question.id] ?? null,
            })),
        };
        console.log(payload);

        form.transform(() => payload);
        form.submit(submit(questionnaire.id), {
            preserveScroll: true,
        })

    }


    const dynamicType = (question: Question) => {
        if (question.type === 'likert') {
            return (
                <div className="grid grid-cols-5 gap-2 pt-4">
                    <div className="flex flex-col items-center gap-3">
                        <input
                            className="border-outline-variant h-6 w-6 text-primary focus:ring-primary"
                            id="likert_1"
                            name={`question_${question.id}`}
                            type="radio"
                            checked={form.data.answers[question.id] === 1}
                            onChange={() => setAnswer(question.id, 1)}
                        />
                        <label
                            className="text-outline text-center text-[10px] font-bold tracking-tighter uppercase"
                            htmlFor="likert_2"
                        >
                            Strongly Disagree
                        </label>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <input
                            className="border-outline-variant h-6 w-6 text-primary focus:ring-primary"
                            id="likert_3"
                            name={`question_${question.id}`}
                            type="radio"
                            checked={form.data.answers[question.id] === 2}
                            onChange={() => setAnswer(question.id, 2)}
                        />
                        <label
                            className="text-outline text-center text-[10px] font-bold tracking-tighter uppercase"
                            htmlFor="likert_4"
                        >
                            Disagree
                        </label>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <input
                            className="border-outline-variant h-6 w-6 text-primary focus:ring-primary"
                            id="likert_5"
                            name={`question_${question.id}`}
                            type="radio"
                            checked={form.data.answers[question.id] === 3}
                            onChange={() => setAnswer(question.id, 3)}
                        />
                        <label
                            className="text-outline text-center text-[10px] font-bold tracking-tighter uppercase"
                            htmlFor="likert_3"
                        >
                            Neutral
                        </label>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <input
                            className="border-outline-variant h-6 w-6 text-primary focus:ring-primary"
                            id="likert_4"
                            name={`question_${question.id}`}
                            type="radio"
                            checked={form.data.answers[question.id] === 4}
                            onChange={() => setAnswer(question.id, 4)}
                        />
                        <label
                            className="text-outline text-center text-[10px] font-bold tracking-tighter uppercase"
                            htmlFor="likert_4"
                        >
                            Agree
                        </label>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <input
                            className="border-outline-variant h-6 w-6 text-primary focus:ring-primary"
                            id="likert_5"
                            name={`question_${question.id}`}
                            type="radio"
                            checked={form.data.answers[question.id] === 5}
                            onChange={() => setAnswer(question.id, 5)}
                        />
                        <label
                            className="text-outline text-center text-[10px] font-bold tracking-tighter uppercase"
                            htmlFor="likert_5"
                        >
                            Strongly Agree
                        </label>
                    </div>
                </div>
            );

        } else if (question.type === 'yes_no') {
            return (
                <div className="space-y-3">
                    <label className="border-outline-variant/20 flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-surface-container-low">
                        <input
                            className="border-outline-variant h-5 w-5 text-primary focus:ring-primary"
                            name={`question_${question.id}`}
                            type="radio"
                            value="yes"
                            checked={form.data.answers[question.id] === true}
                            onChange={() => setAnswer(question.id, true)}
                        />
                        <span className="text-on-surface">Yes, I have</span>
                    </label>
                    <label className="border-outline-variant/20 flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-surface-container-low">
                        <input
                            className="border-outline-variant h-5 w-5 text-primary focus:ring-primary"
                            name={`question_${question.id}`}
                            type="radio"
                            value="no"
                            checked={form.data.answers[question.id] === false}
                            onChange={() => setAnswer(question.id, false)}
                        />
                        <span className="text-on-surface">No, never</span>
                    </label>
                </div>
            );
        }else if (question.type === 'text') {
            return (
                <div className="relative">
                    <textarea
                        className="border-outline-variant/50 text-on-surface w-full resize-none border-0 border-b bg-transparent px-0 py-3 transition-colors focus:border-primary focus:ring-0"
                        placeholder="Your answer"
                        onChange={(e) => setAnswer(question.id, e.target.value)}
                    ></textarea>
                </div>
            );
        }

    }

    return (
        <div>
            <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-card px-6 shadow-sm dark:border-secondary dark:bg-card-high">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-tight text-primary antialiased dark:text-secondary">
                        MORPHEUS
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined cursor-pointer text-slate-500 transition-all hover:text-[#1397d9] active:scale-95">
                            dark_mode
                        </span>
                    </div>
                    <div className="mx-2 h-8 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
                </div>
            </header>
            <main className="mx-auto max-w-3xl space-y-6 bg-card-high px-4 py-8">
                <section className="overflow-hidden rounded-xl border-t-8 border-primary bg-card shadow-sm dark:border-secondary">
                    <div className="p-8">
                        <div className="mb-4 flex items-center gap-3">
                            <span className="material-symbols-outlined text-3xl text-primary">
                                security
                            </span>
                            <h1 className="text-on-surface text-3xl font-black tracking-tight">
                                Q{questionnaire.id} - {questionnaire.title}
                            </h1>
                        </div>
                        <div className="text-on-surface-variant space-y-4 leading-relaxed">
                            <p>{questionnaire.description}</p>
                            <div className="border-outline-variant/30 flex items-center gap-2 rounded-lg border bg-surface-container-low p-3">
                                <span className="material-symbols-outlined text-lg text-primary">
                                    info
                                </span>
                                <p className="text-xs font-medium tracking-wider text-primary uppercase">
                                    Anonymous Submission
                                </p>
                                <p className="text-on-surface-variant border-outline-variant ml-1 border-l pl-2 text-xs">
                                    Your identity shielded. No personal
                                    information will be saved by the system.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <form onSubmit={submitForm} className="space-y-15">
                    {questions.map((question: Question) => (
                        <section
                            key={question.id}
                            className="hover:border-outline-variant/50 group space-y-6 rounded-xl border border-transparent bg-card p-8 shadow-sm transition-all"
                        >
                            <div className="space-y-6">
                                <div className="flex items-start justify-between">
                                    <h2 className="text-on-surface text-lg font-semibold">
                                        {question.question}{' '}
                                        <span className="text-error">*</span>
                                    </h2>
                                </div>
                            </div>
                            {dynamicType(question)}
                        </section>
                    ))}
                    <div className="flex items-center justify-between py-6">
                        <Button type={"submit"} size={"lg"} className="text-pretty font-bold w-35 group hover:scale-110 ml-10 space-x-2">
                            <span>Submit</span>
                            <SendHorizontal className="size-6 group-hover:translate-x-2 transition-transform"/>
                        </Button>
                        <div className="flex flex-col items-end">
                            <div className="flex gap-1">
                                <div className="h-1 w-8 rounded-full bg-primary"></div>
                                <div className="bg-outline-variant h-1 w-8 rounded-full"></div>
                                <div className="bg-outline-variant h-1 w-8 rounded-full"></div>
                            </div>
                            <span className="text-outline mt-2 text-[10px] font-bold uppercase">
                                Page 1 of 3
                            </span>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};
export default QuestionnaireSubmit;
