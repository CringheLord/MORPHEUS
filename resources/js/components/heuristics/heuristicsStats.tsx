import {
    Braces,
    MessageCircleWarning,
    ChartColumn,
    FileUser,
} from 'lucide-react';
import React from 'react';

import heuristics from '@/routes/heuristics';
import type { Heuristic } from '@/types';


type Props = {
    heuristics: Heuristic[];
}

const HeuristicsStats = ({ heuristics }: Props) => {
    const heuristics_tot = heuristics.length;
    const incidence_rate = heuristics.reduce((acc, heuristic) => acc + heuristic.incidence_rate, 0) / heuristics_tot;

    return (
        <div className="grid grid-rows-1 gap-4 md:grid-cols-4 lg:grid-rows-1">
            <div className="glass-card border-primary p-6 hover:bg-primary/5">
                <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <Braces className="h-5 w-5 text-primary" />
                    </div>
                    <span className="rounded-sm bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-600">
                        LIVE
                    </span>
                </div>
                <h3 className="mb-1 text-sm text-card-foreground-secondary">
                    Total Heuristics
                </h3>
                <p className="text-3xl font-bold text-card-foreground">
                    {heuristics_tot}
                </p>
            </div>

            <div className="glass-card glass-alert border-alert p-6 hover:bg-alert/5">
                <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-lg bg-alert/10 p-2">
                        <MessageCircleWarning className="h-6 w-6 text-alert" />
                    </div>
                </div>
                <h3 className="mb-1 text-sm text-card-foreground-secondary">
                    Violations Flagged
                </h3>
                <p className="text-3xl font-bold text-card-foreground">
                    12,840
                </p>
            </div>

            <div className="glass-card glass-destructive border-destructive p-6 hover:bg-destructive/10">
                <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-lg bg-destructive/10 p-2">
                        <ChartColumn className="h-6 w-6 text-destructive" />
                    </div>
                    <span className="text-xs font-medium text-card-foreground-secondary">
                        Avg.
                    </span>
                </div>
                <h3 className="mb-1 text-sm text-card-foreground-secondary">
                    Incidence Rate
                </h3>
                <p className="text-3xl font-bold text-card-foreground">
                    {incidence_rate.toFixed(2)}%
                </p>
            </div>

            <div className="glass-card glass-destructive border-destructive p-6 hover:bg-destructive/5">
                <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-lg bg-destructive/10 p-2">
                        <FileUser className="h-6 w-6 text-destructive" />
                    </div>
                </div>
                <h3 className="mb-1 text-sm text-card-foreground-secondary">
                    Primary Risk Factor
                </h3>
                <p className="pt-2 text-center text-xl font-bold text-primary">
                    #HF1
                </p>
            </div>
        </div>
    );
};
export default HeuristicsStats;
