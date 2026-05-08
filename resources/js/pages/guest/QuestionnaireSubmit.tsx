import React from 'react';

const QuestionnaireSubmit = () => {
    return (
        <div>
            <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-tight text-[#1397d9] antialiased">
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
            <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
                <section className="bg-surface-container-lowest overflow-hidden rounded-xl border-t-8 border-[#0594d6] shadow-sm">
                    <div className="p-8">
                        <div className="mb-4 flex items-center gap-3">
                            <span className="material-symbols-outlined text-3xl text-primary">
                                security
                            </span>
                            <h1 className="text-on-surface text-3xl font-black tracking-tight">
                                Q3 Cybersecurity Culture Assessment
                            </h1>
                        </div>
                        <div className="text-on-surface-variant space-y-4 leading-relaxed">
                            <p>
                                Welcome to the quarterly organizational
                                resilience and cybersecurity culture audit. This
                                questionnaire is designed to evaluate the
                                cognitive and operational load on team members
                                during critical delivery cycles.
                            </p>
                            <div className="border-outline-variant/30 flex items-center gap-2 rounded-lg border bg-surface-container-low p-3">
                                <span className="material-symbols-outlined text-lg text-primary">
                                    info
                                </span>
                                <p className="text-xs font-medium tracking-wider text-primary uppercase">
                                    Anonymous Submission
                                </p>
                                <p className="text-on-surface-variant border-outline-variant ml-1 border-l pl-2 text-xs">
                                    Your identity is cryptographically shielded.
                                    No PII is logged alongside this response.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-surface-container-lowest hover:border-outline-variant/50 group rounded-xl border border-transparent p-8 shadow-sm transition-all">
                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <h2 className="text-on-surface text-lg font-semibold">
                                Do you feel that the resources provided are
                                sufficient when project deadlines are tightened
                                unexpectedly?{' '}
                                <span className="text-error">*</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-5 gap-2 pt-4">
                            <div className="flex flex-col items-center gap-3">
                                <input
                                    className="border-outline-variant h-6 w-6 text-primary focus:ring-primary"
                                    id="likert_1"
                                    name="resources_likert"
                                    type="radio"
                                />
                                <label
                                    className="text-outline text-center text-[10px] font-bold tracking-tighter uppercase"
                                    htmlFor="likert_1"
                                >
                                    Strongly Disagree
                                </label>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <input
                                    className="border-outline-variant h-6 w-6 text-primary focus:ring-primary"
                                    id="likert_2"
                                    name="resources_likert"
                                    type="radio"
                                />
                                <label
                                    className="text-outline text-center text-[10px] font-bold tracking-tighter uppercase"
                                    htmlFor="likert_2"
                                >
                                    Disagree
                                </label>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <input
                                    className="border-outline-variant h-6 w-6 text-primary focus:ring-primary"
                                    id="likert_3"
                                    name="resources_likert"
                                    type="radio"
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
                                    name="resources_likert"
                                    type="radio"
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
                                    name="resources_likert"
                                    type="radio"
                                />
                                <label
                                    className="text-outline text-center text-[10px] font-bold tracking-tighter uppercase"
                                    htmlFor="likert_5"
                                >
                                    Strongly Agree
                                </label>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-surface-container-lowest hover:border-outline-variant/50 rounded-xl border border-transparent p-8 shadow-sm transition-all">
                    <div className="space-y-6">
                        <h2 className="text-on-surface text-lg font-semibold">
                            Have you ever bypassed security protocols to meet an
                            urgent project deadline?{' '}
                            <span className="text-error">*</span>
                        </h2>
                        <div className="space-y-3">
                            <label className="border-outline-variant/20 flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-surface-container-low">
                                <input
                                    className="border-outline-variant h-5 w-5 text-primary focus:ring-primary"
                                    name="security_bypass"
                                    type="radio"
                                    value="yes"
                                />
                                <span className="text-on-surface">
                                    Yes, I have
                                </span>
                            </label>
                            <label className="border-outline-variant/20 flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-surface-container-low">
                                <input
                                    className="border-outline-variant h-5 w-5 text-primary focus:ring-primary"
                                    name="security_bypass"
                                    type="radio"
                                    value="no"
                                />
                                <span className="text-on-surface">
                                    No, never
                                </span>
                            </label>
                        </div>
                    </div>
                </section>
                <section className="bg-surface-container-lowest hover:border-outline-variant/50 rounded-xl border border-transparent p-8 shadow-sm transition-all">
                    <div className="space-y-4">
                        <h2 className="text-on-surface text-lg font-semibold">
                            Any additional comments on organizational pressure?
                        </h2>
                        <div className="relative">
                            <textarea
                                className="border-outline-variant/50 text-on-surface w-full resize-none border-0 border-b bg-transparent px-0 py-3 transition-colors focus:border-primary focus:ring-0"
                                placeholder="Your answer"
                            ></textarea>
                        </div>
                        <p className="text-outline text-xs italic">
                            Describe any specific scenarios where cognitive load
                            affected security compliance.
                        </p>
                    </div>
                </section>
                <div className="flex items-center justify-between py-6">
                    <button className="hover:bg-primary-container flex items-center gap-2 rounded bg-primary px-10 py-3 font-bold tracking-wide text-white shadow-md transition-all hover:shadow-lg active:scale-95">
                        <span>Submit</span>
                        <span className="material-symbols-outlined text-sm">
                            send
                        </span>
                    </button>
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
            </main>
        </div>
    );
};
export default QuestionnaireSubmit;
