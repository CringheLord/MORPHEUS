import React from 'react';

import type { Questionnaire, Submission } from '@/types';
import { ArrowLeftFromLine } from 'lucide-react';

type Props = {
    questionnaire: Questionnaire;
}

const QuestionnaireResult = ({ questionnaire }: Props) => {
    console.log(questionnaire);

    function countAnswersPercentage (submissions: Submission[], value: boolean | number, answerId: number ) {

        if (value === true) {
            value = 1;
        }else if (value === false) {
            value = 0;
        }

        let counter = 0;

        for (const submission of submissions) {
            const answer = submission.answers.find((answer) => (answer.question_id == answerId));

            if (answer) {
                if (answer.score === value) {
                    counter++;
                }else {
                    if (answer.answer === value) {
                        counter++;
                    }
                }

            }
        }

        return Math.round((counter / submissions.length) * 1000)/10;

    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <nav aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-primary absolute top-5 left-15">
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
            <div className="bg-surface-container-lowest border-outline-variant/30 mt-4 mb-6 h-fit w-2/3 rounded-xl border border-t-8 border-t-primary p-8 shadow-sm">
                <h2 className="text-on-surface mb-2 text-3xl font-black tracking-tight">
                    Q3 Cybersecurity Culture Assessment
                </h2>
                <p className="text-on-surface-variant border-outline-variant/30 mb-6 border-b pb-6">
                    Comprehensive human factor assessment and risk
                    stratification.
                </p>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-on-surface-variant mb-1 text-xs font-bold tracking-wider uppercase">
                            Total Responses
                        </span>
                        <span className="text-on-surface text-2xl font-black">
                            {questionnaire.submissions_count
                                ? questionnaire.submissions_count
                                : 0}
                        </span>
                    </div>
                    <div className="bg-outline-variant/30 h-10 w-px"></div>
                    <div className="flex flex-col">
                        <span className="text-on-surface-variant mb-1 text-xs font-bold tracking-wider uppercase">
                            Status
                        </span>
                        <span className="flex items-center gap-1 text-sm font-bold text-primary">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                            {questionnaire.status === 'active'
                                ? 'Active'
                                : 'Closed'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="w-2/3">
                {questionnaire.questions?.map((question) =>
                    question.type === 'likert' ? (
                        <div
                            key={question.id}
                            className="bg-surface-container-lowest border-outline-variant/30 mb-6 rounded-xl border p-6 shadow-sm"
                        >
                            <h3 className="text-on-surface mb-6 text-lg font-bold">
                                {question.pivot?.position}. {question.question}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-on-surface-variant w-32 text-right text-sm">
                                        Strongly Disagree
                                    </span>
                                    <div className="flex h-6 flex-1 items-center overflow-hidden rounded bg-surface-container-high">
                                        <div
                                            className="h-full bg-primary"
                                            style={{
                                                width: `${countAnswersPercentage(
                                                    questionnaire.submissions,
                                                    1,
                                                    question.id,
                                                )}%`,
                                            }}
                                        ></div>
                                        <span className="text-on-surface ml-2 text-xs font-medium">
                                            {countAnswersPercentage(
                                                questionnaire.submissions,
                                                1,
                                                question.id,
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-on-surface-variant w-32 text-right text-sm">
                                        Disagree
                                    </span>
                                    <div className="flex h-6 flex-1 items-center overflow-hidden rounded bg-surface-container-high">
                                        <div
                                            className="h-full bg-primary"
                                            style={{
                                                width: `${countAnswersPercentage(
                                                    questionnaire.submissions,
                                                    2,
                                                    question.id,
                                                )}%`,
                                            }}
                                        ></div>
                                        <span className="text-on-surface ml-2 text-xs font-medium">
                                            {countAnswersPercentage(
                                                questionnaire.submissions,
                                                2,
                                                question.id,
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-on-surface-variant w-32 text-right text-sm">
                                        Neutral
                                    </span>
                                    <div className="flex h-6 flex-1 items-center overflow-hidden rounded bg-surface-container-high">
                                        <div
                                            className="h-full bg-primary"
                                            style={{
                                                width: `${countAnswersPercentage(
                                                    questionnaire.submissions,
                                                    3,
                                                    question.id,
                                                )}%`,
                                            }}
                                        ></div>
                                        <span className="text-on-surface ml-2 text-xs font-medium">
                                            {countAnswersPercentage(
                                                questionnaire.submissions,
                                                3,
                                                question.id,
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-on-surface-variant w-32 text-right text-sm">
                                        Agree
                                    </span>
                                    <div className="flex h-6 flex-1 items-center overflow-hidden rounded bg-surface-container-high">
                                        <div
                                            className="h-full bg-primary"
                                            style={{
                                                width: `${countAnswersPercentage(
                                                    questionnaire.submissions,
                                                    4,
                                                    question.id,
                                                )}%`,
                                            }}
                                        ></div>
                                        <span className="text-on-surface ml-2 text-xs font-medium">
                                            {countAnswersPercentage(
                                                questionnaire.submissions,
                                                4,
                                                question.id,
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-on-surface-variant w-32 text-right text-sm">
                                        Strongly Agree
                                    </span>
                                    <div className="flex h-6 flex-1 items-center overflow-hidden rounded bg-surface-container-high">
                                        <div
                                            className="h-full bg-primary"
                                            style={{
                                                width: `${countAnswersPercentage(
                                                    questionnaire.submissions,
                                                    5,
                                                    question.id,
                                                )}%`,
                                            }}
                                        ></div>
                                        <span className="text-on-surface ml-2 text-xs font-medium">
                                            {countAnswersPercentage(
                                                questionnaire.submissions,
                                                5,
                                                question.id,
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="border-outline-variant/30 text-on-surface-variant mt-6 flex justify-between border-t pt-4 text-sm">
                                <span>
                                    {questionnaire.submissions_count
                                        ? questionnaire.submissions_count
                                        : '0 '}{' '}
                                    responses
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-surface-container-lowest border-outline-variant/30 mb-6 rounded-xl border p-6 shadow-sm">
                            <h3 className="text-on-surface mb-6 text-lg font-bold">
                                {question.pivot?.position}. {question.question}
                            </h3>
                            <div className="mb-4 flex flex-col">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-on-surface text-sm font-bold">
                                        Yes
                                    </span>
                                    <span className="text-on-surface text-sm font-bold">
                                        {countAnswersPercentage(
                                            questionnaire.submissions,
                                            true,
                                            question.id,
                                        )}
                                        %
                                    </span>
                                </div>
                                <div className="mb-4 h-6 w-full overflow-hidden rounded bg-surface-container-high">
                                    <div
                                        className="h-full bg-primary"
                                        style={{
                                            width: `${countAnswersPercentage(
                                                questionnaire.submissions,
                                                true,
                                                question.id,
                                            )}%`,
                                        }}
                                    ></div>
                                </div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-on-surface text-sm font-bold">
                                        No
                                    </span>
                                    <span className="text-on-surface text-sm font-bold">
                                        {countAnswersPercentage(
                                            questionnaire.submissions,
                                            false,
                                            question.id,
                                        )}
                                        %
                                    </span>
                                </div>
                                <div className="h-6 w-full overflow-hidden rounded bg-surface-container-high">
                                    <div
                                        className="bg-error h-full"
                                        style={{
                                            width: `${countAnswersPercentage(
                                                questionnaire.submissions,
                                                false,
                                                question.id,
                                            )}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="border-outline-variant/30 text-on-surface-variant mt-6 flex justify-between border-t pt-4 text-sm">
                                <span>
                                    {questionnaire.submissions_count
                                        ? questionnaire.submissions_count
                                        : '0 '}{' '}
                                    responses
                                </span>
                            </div>
                        </div>
                    ),
                )}
            </div>
        </div>
    );
};
export default QuestionnaireResult;
