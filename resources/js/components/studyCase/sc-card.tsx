
import { ShieldCheck } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';



import type { StudyCase } from '@/types';



type Props = {
    StudyCase: StudyCase | null;
}
type Status = 'draft' | 'in_progress' | 'completed' | 'archived';

const StatusDiv = ({ status }: { status: Status }) => {
    let colorClass = '';

    switch (status) {
        case 'draft':
            colorClass = 'bg-slate-100 text-slate-700 border-slate-200';
            break;
        case 'in_progress':
            colorClass = 'bg-blue-100 text-blue-700 border-blue-200';
            break;
        case 'completed':
            colorClass = 'bg-green-100 text-green-700 border-green-200';
            break;
        case 'archived':
            colorClass = 'bg-zinc-100 text-zinc-700 border-zinc-200';
            break;
    }

    return (
        <span
            className={`rounded-full border px-2 py-1 text-xs font-bold uppercase ${colorClass}`}
        >
            {status.replace('_', ' ')}
        </span>
    );
};

const DateJob = ({
                     completed_at,
                     created_at,
                     updated_at,
                 }: {
    completed_at: string | null;
    created_at: string | null;
    updated_at: string | null;
}) => {
    if (completed_at != null) {
        return (
            <span className="text-xs font-medium text-card-foreground-secondary">
                {completed_at}
            </span>
        );
    } else if (updated_at != null) {
        return (
            <span className="text-xs font-medium text-card-foreground-secondary">
                Updated {updated_at}
            </span>
        );
    } else {
        return (
            <span className="text-xs font-medium text-card-foreground-secondary">
                Created {created_at}
            </span>
        );
    }
};

const StatRow = ({ status, c_percentage, risk_score }: { status: Status, c_percentage: number, risk_score: number }) => {
  if (status === 'completed') {
      return (
          <div className="bg-surface-container-high flex items-center gap-3 rounded-lg p-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div className="text-xs">
                  <p className="text-on-surface font-bold">
                      Final Risk Score: { risk_score }
                  </p>
                  <p className="text-on-surface-variant">
                      Optimal Performance Range
                  </p>
              </div>
          </div>
      );
  }else if (status === 'in_progress') {
      return (<div className="space-y-2">
              <div className="text-on-surface-variant flex justify-between text-xs font-bold">
                  <span>Audit Completion</span>
                  <span>{c_percentage}%</span>
              </div>
              <div className="bg-surface-container h-1.5 w-full overflow-hidden rounded-full">
                  <div
                      className="h-full rounded-full bg-primary" style={{ width: `${c_percentage}%` }}
                  ></div>
              </div>
          </div>
      );
  }else {
      return (
          <div></div>
      );
  }

};

const ShowUsersAvatar = () => {
    return (
        <div className="flex -space-x-2">
            <img
                alt="Researcher"
                className="h-6 w-6 rounded-full border-2 border-white"
                data-alt="portrait of a researcher focused and professional"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdqnj52SXImm2C1j8BS-JhgCSOHvby_DZaiLsgrWO6TmYjw22Q3TrdRnqYKAtfCHIGbWR8N7zpZ62aNR0hhYTzX5Mq9HZ-EP_kgyqFbuwDK6r8AYi8NZSulktGiH_ZS5mAildQNupC-KkMxNuXQ75y8W1-1qRLyiInUbkV2q4bcuHy5UFMCMNwzd1uzjb8SKCg6hzFVhzbVhyEQk7XXVqahmgOUFj22UncObwtoPM7fD46fqUJB-i9xMJLQbrpH9Ug_si8s_7fUG4"
            />
            <img
                alt="Researcher"
                className="h-6 w-6 rounded-full border-2 border-white"
                data-alt="portrait of a ux specialist with neutral studio lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLyf9WnkO3A4CP-Agd627YKu7yg5x4P81b1FtPKg1CL9X7XEw4PjnCO3rJ24dbBaBtUwdysnDtoB4JalaxAQCAkWxUi4Hj9SZwnov2RxFF_3ADZqk1U3UJ9s2Z3GEWTZ0hUxFCXw-t6C8SRW2BqNP3wfxkemMFf5EFJgI5cl2bHkRh0GkNQOyfKQ3aV7QbrUlblT7EsCzgesdzZ8NtAa5jL7GJSV2xHgHy5ELg36BlN0PMVhGPO-ppOayDyiVb6ZmqhktqCynrBoU"
            />
        </div>
    );
}

const BtnFinalRow = ({ status }: { status: Status }) => {
    switch (status) {
        case 'completed':
            return <Button className="w-full">View Report</Button>;

        case 'in_progress':
            return (
                <Button variant="ghost" className="w-full">
                    Resume
                </Button>
            );

        case 'draft':
            return (
                <Button variant="ghost" className="w-full">
                    Continue
                </Button>
            );

        case 'archived':
            return (
                <Button variant="ghost" className="w-full">
                    View
                </Button>
            );
    }
};


const ScCard = ({ StudyCase }: Props) => {
    if (!StudyCase) {
        return <div></div>;
    }

    const safeStatus: Status = StudyCase.status ?? 'draft';
    const safeRiskScore = StudyCase.risk_score ?? 0;
    const safePercentage = StudyCase.c_percentage ?? 0;

    return (
        <div>
            <div className="border-surface-variant group flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:shadow-xl">
                <div className="grow p-6">
                    <div className="mb-4 flex items-start justify-between">
                        <StatusDiv status={safeStatus} />
                        <DateJob
                            completed_at={StudyCase.completed_at}
                            created_at={StudyCase.created_at}
                            updated_at={StudyCase.updated_at}
                        />
                    </div>

                    <h3 className="mb-2 text-xl leading-tight font-bold transition-colors group-hover:text-primary">
                        {StudyCase.title}
                    </h3>

                    <p className="text-on-surface-variant mb-4 line-clamp-2 text-sm">
                        {StudyCase.description}
                    </p>

                    <div className="mb-6 flex flex-wrap gap-2">
                        <span className="bg-surface-container text-on-surface-variant rounded px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
                            Cognitive Load
                        </span>
                        <span className="bg-surface-container text-on-surface-variant rounded px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
                            Trust
                        </span>
                    </div>

                    <StatRow
                        status={safeStatus}
                        c_percentage={safePercentage}
                        risk_score={safeRiskScore}
                    />
                </div>

                <div className="bg-surface-container-lowest border-surface-variant flex items-center justify-between border-t px-6 py-4">
                    <ShowUsersAvatar />
                    <div className="flex gap-2">
                        <BtnFinalRow status={safeStatus} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ScCard;
