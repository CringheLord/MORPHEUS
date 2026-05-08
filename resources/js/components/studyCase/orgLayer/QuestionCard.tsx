import { Check } from 'lucide-react';

import React from 'react';

import type { Question } from '@/types';

type Props = {
    question: Question;
    isSelected: boolean;
    onToggle: () => void;
};

const dynamicType = (type: string)=> {
    return type;
}

const QuestionCard = ( {question, isSelected, onToggle}: Props) => {


    return (
        <div>
            <div
                className={
                    `group relative flex gap-6 rounded-2xl border-2 border-border bg-card p-6 shadow-md transition-all ${isSelected ? "ring-secondary ring-4" : ''}`
                }
            >
                <div className="flex flex-col items-center">
                    <button
                        onClick={onToggle}
                        className="border-primary-container flex h-6 w-6 items-center justify-center rounded border-2 bg-primary"
                    >
                        {isSelected ? (
                            <Check className="size-5 text-primary-foreground" />
                        ) : (
                            <></>
                        )}
                    </button>
                </div>
                <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h4 className="text-on-surface text-lg font-bold">
                                Q{question.id} --  {question.title}
                            </h4>
                            <p className="text-on-surface-variant mt-1 italic">
                                "{question.question}"
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className="bg-tertiary-fixed text-on-tertiary-fixed rounded px-2 py-1 text-[10px] font-black uppercase">
                                Time Pressure
                            </span>
                            {dynamicType(question.type)}
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
                                Inadequate resources during high-pressure
                                periods leads to a 40% increase in procedural
                                violations and mental fatigue.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default QuestionCard;
