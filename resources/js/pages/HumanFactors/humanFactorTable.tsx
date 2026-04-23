import {
    BrainCircuit,
    Brain,
    ShieldAlert,
    Eye,
    EyeOff,
    SearchCheck,
    GraduationCap,
    BadgeCheck,
    TriangleAlert,
    Zap,
    Frown,
    UserRoundX,
    BatteryLow,
    CircleHelp,
    MousePointerClick,
    Icon,
    HelpCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import React from 'react';

const iconMap: Record<string, LucideIcon> = {
    'shield-alert': ShieldAlert,
    'eye-off': EyeOff,
    'battery-low': BatteryLow,
    'search-check': SearchCheck,
    'brain': Brain,
    'brain-circuit': BrainCircuit,
    'graduation-cap': GraduationCap,
    'badge-check': BadgeCheck,
    'eye': Eye,
    'circle-question-mark': CircleHelp,
    'mouse-pointer-click': MousePointerClick,
    'frown': Frown,
    'zap': Zap,
    'user-round-x': UserRoundX,
    'triangle-alert': TriangleAlert,
};

import type { HumanFactor } from '@/types';

type Props = {
    humanFactor: HumanFactor;
}

const HumanFactorTable = ( { humanFactor }: Props ) => {
    const Icon = iconMap[humanFactor.icon] ?? HelpCircle;

    return (
        <tr className="group transition-colors hover:bg-card/30">
            <td className="text-m px-2 py-2 text-center font-bold text-primary">
                #HF {humanFactor.id}
            </td>
            <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                    <Icon className="size-6 text-primary group-hover:text-primary dark:group-hover:text-secondary/90" />
                    <div>
                        <span className="text-on-background text-sm font-bold transition-colors group-hover:text-primary dark:group-hover:text-secondary/90">
                            {humanFactor.name}
                        </span>
                    </div>
                </div>
            </td>
            <td className="px-8 py-6">
                <span className="bg-surface-container-high inline-block rounded px-3 py-1 text-[10px] font-bold tracking-tighter text-card-foreground">
                    {humanFactor.category}
                </span>
            </td>
        </tr>
    );
};
export default HumanFactorTable;
