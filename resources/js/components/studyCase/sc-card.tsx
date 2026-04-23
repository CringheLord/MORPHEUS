import { Link } from '@inertiajs/react';

import { ShieldCheck } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { useInitials } from '@/hooks/use-initials';
import studyCases from '@/routes/study-cases';




import type { User } from '@/types';
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
            colorClass = 'bg-blue-300 text-blue-800 border-blue-300';
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
                {completed_at ? new Date(completed_at).toLocaleString() : 'N/A'}
            </span>
        );
    } else if (updated_at != null) {
        return (
            <span className="text-xs font-medium text-card-foreground-secondary">
                Updated{' '}
                {updated_at ? new Date(updated_at).toLocaleString() : 'N/A'}
            </span>
        );
    } else {
        return (
            <span className="text-xs font-medium text-card-foreground-secondary">
                Created{' '}
                {created_at ? new Date(created_at).toLocaleString() : 'N/A'}
            </span>
        );
    }
};

const StatRow = ({ status, c_percentage, risk_score }: { status: Status, c_percentage: number, risk_score: number }) => {
  if (status === 'completed') {
      return (
          <div className="bg-card-highest flex items-center gap-3 rounded-lg p-3">
              <ShieldCheck className="h-5 w-5 text-primary dark:text-destructive" />
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
      return (<div className="space-y-5 p-2 rounded-xl border bg-card-highest">
              <div className="text-on-surface-variant flex justify-between text-xs font-bold">
                  <span>Audit Completion</span>
                  <span>{c_percentage}%</span>
              </div>
              <div className="bg-surface-container h-1.5 w-full overflow-hidden rounded-full">
                  <div
                      className="h-full rounded-full bg-primary dark:bg-destructive" style={{ width: `${c_percentage}%` }}
                  ></div>
              </div>
          </div>
      );
  }else {
      return (
          <div className="h-14"></div>
      );
  }

};

const ShowUsersAvatar = ( { user }: { user: User } ) => {
    const getInitials = useInitials();

    return (
        <div className="flex -space-x-2">
            <Avatar className="h-10 w-10 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
        </div>
    );
}

const BtnFinalRow = ({ status }: { status: Status }) => {
    switch (status) {
        case 'completed':
            return (<Button className="w-full">View Report</Button>);

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
        <div className="justify-self-start">
            <div className="group flex w-fit flex-col overflow-hidden rounded-2xl border border-secondary bg-card transition-all duration-300 hover:shadow-xl dark:border-muted">
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
                        <span className="text-on-surface-variant rounded bg-surface-container px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
                            Cognitive Load
                        </span>
                        <span className="text-on-surface-variant rounded bg-surface-container px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
                            Trust
                        </span>
                    </div>

                    <StatRow
                        status={safeStatus}
                        c_percentage={safePercentage}
                        risk_score={safeRiskScore}
                    />
                </div>

                <div className="flex items-center justify-between border-t border-t-secondary bg-card-high px-6 py-4 dark:border-t-destructive">
                    <div className="flex -space-x-2">
                        <div className="rounded-full border-2 border-secondary">
                            <ShowUsersAvatar user={StudyCase.owner} />
                        </div>
                        {(StudyCase.users ?? []).map((user: User) => (
                            <ShowUsersAvatar user={user} key={user.id} />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Link href={studyCases.show(StudyCase)}>
                            <BtnFinalRow status={safeStatus} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ScCard;
