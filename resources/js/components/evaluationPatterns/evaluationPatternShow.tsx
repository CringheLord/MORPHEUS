import {
    ShieldAlert,
    BrainCircuit,
    Brain,
    SearchCheck,
    BatteryLow,
    Globe,
    Hourglass,
    EyeOff,
    MousePointerClick,
    CircleAlert,
    Eye,
    BadgeCheck,
    GraduationCap,
    Zap,
    Frown,
    UserRoundX,
    MessageCircleWarning,
    CircleHelp,
    ShieldQuestion,
    TriangleAlert,
    HelpCircle,
    Hexagon,
    ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { useState } from 'react';

import EPDetailDialog from '@/components/evaluationPatterns/evaluationPatternDetail';

import { Button } from '@/components/ui/button';


import type { EvaluationPattern } from '@/types';


type Props = {
    evaluationPattern: EvaluationPattern;
};

const iconMap: Record<string, LucideIcon> = {
    'shield-alert': ShieldAlert,
    'brain-circuit': BrainCircuit,
    brain: Brain,
    'search-check': SearchCheck,
    'battery-low': BatteryLow,
    globe: Globe,
    hourglass: Hourglass,
    'eye-off': EyeOff,
    'mouse-pointer-click': MousePointerClick,
    'circle-alert': CircleAlert,
    eye: Eye,
    'badge-check': BadgeCheck,
    'graduation-cap': GraduationCap,
    zap: Zap,
    frown: Frown,
    'user-round-x': UserRoundX,
    'message-circle-warning': MessageCircleWarning,
    'circle-question-mark': CircleHelp,
    'badge-question-mark': ShieldQuestion,
    'triangle-alert': TriangleAlert,
    Hexagon: Hexagon,
};

const EvaluationPatternShow = ({ evaluationPattern }: Props) => {
    const Icon = iconMap[evaluationPattern.icon] ?? HelpCircle;
    const HFIcon = iconMap[evaluationPattern.human_factor.icon];
    const uiTags = evaluationPattern.ui_tags ?? [];

    const [selectedEvaluationPattern, setSelectedEvaluationPattern] =
        useState<EvaluationPattern | null>(null);

    return (
        <>
            <article className="heuristic-row group rounded-2xl border border-border bg-card-high p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg dark:hover:border-secondary/60">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex min-w-0 gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-card text-primary dark:bg-primary">
                            <Icon className="size-6 text-primary dark:text-secondary" />
                        </div>

                        <div className="min-w-0">
                            <div className="mb-2 flex flex-row items-center gap-10">
                                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-black tracking-wider text-muted-foreground">
                                    {evaluationPattern.h_id}
                                </span>
                                <div>
                                    Category:
                                    <span className="text-m ml-2 rounded-full bg-secondary/10 px-2.5 py-1 text-secondary">
                                        {evaluationPattern.human_factor.category}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-base leading-snug font-bold text-foreground transition-colors group-hover:text-primary">
                                {evaluationPattern.title}
                            </h3>

                            {evaluationPattern.trigger && (
                                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                    {evaluationPattern.trigger}
                                </p>
                            )}

                            <div className="mt-4 flex flex-wrap gap-2">
                                {uiTags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="inline-flex items-center rounded-full bg-surface-container px-3 py-1.5 text-xs font-medium whitespace-nowrap text-muted-foreground"
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 md:flex-col md:items-end">
                        <div className="rounded-2xl bg-muted px-3 py-2 text-center">
                            <p className="text-[10px] font-black tracking-wider text-muted-foreground uppercase">
                                Incidence
                            </p>
                            <p className="text-sm font-bold text-foreground">
                                {evaluationPattern.incidence_rate ?? 0}%
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition hover:opacity-90"
                            size="lg"
                            onClick={() =>
                                setSelectedEvaluationPattern(evaluationPattern)
                            }
                        >
                            Inspect
                            <ArrowRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </article>
            <EPDetailDialog
                evaluationPattern={evaluationPattern}
                open={selectedEvaluationPattern !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedEvaluationPattern(null);
                    }
                }}
                Icon={Icon}
                HFIcon={HFIcon}
            />
        </>
    );
};

export default EvaluationPatternShow;
