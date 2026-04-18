import {
    Brain,
    BrainCog,
    ShieldAlert,
    ListChecks,
    FileSearch,
    HelpCircle,
    Eye,
    EyeOff,
    Search,
    GraduationCap,
    BadgeCheck,
    TriangleAlert,
    Zap,
    Frown,
    Hand,
    BatteryLow,
    CircleHelp,
    User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { Heuristic } from '@/types';

type Props = {
    heuristic: Heuristic;
};

const iconMap: Record<string, LucideIcon> = {
    psychology: Brain,
    psychology_alt: BrainCog,
    search: Search,
    school: GraduationCap,
    verified: BadgeCheck,
    warning: TriangleAlert,
    priority_high: TriangleAlert,
    visibility: Eye,
    visibility_off: EyeOff,
    touch_app: Hand,
    mood_bad: Frown,
    bolt: Zap,
    face: User,
    help: CircleHelp,
    gpp_maybe: ShieldAlert,
    battery_horiz_050: BatteryLow,
};

const HeuristicShow = ({ heuristic }: Props) => {
    const Icon = iconMap[heuristic.icon] ?? HelpCircle;

    return (
        <tr className="bg-card transition-colors hover:bg-secondary/20 dark:hover:bg-card/1">
            <td className="px-6 py-4 font-mono text-sm font-bold text-primary">
                {heuristic.h_id}
            </td>

            <td className="px-6 py-4">
                <div className="flex items-center gap-6">
                    <div className="rounded-lg border border-secondary/20 bg-tertiary/5 p-2">
                        <Icon className="h-5 w-5 text-secondary" />
                    </div>

                    <span className="font-bold text-foreground">
                        {heuristic.title}
                    </span>
                </div>
            </td>

            <td className="px-6 py-4 text-sm text-muted-foreground">
                {heuristic.human_factor.name}
            </td>

            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-secondary"
                            style={{ width: `${heuristic.incidence_rate}%` }}
                        />
                    </div>

                    <span className="text-sm font-bold">
                        {heuristic.incidence_rate}%
                    </span>
                </div>
            </td>

            <td className="px-6 py-4 text-right">
                <Button variant={"ghost"} size={"sm"}>View Details</Button>
            </td>
        </tr>
    );
};

export default HeuristicShow;
