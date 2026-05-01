import {
    CornerDownRight,
    ShieldCheck,
    BarChart3,
    BellRing,
    Brain,
} from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import type { EvaluationPattern } from '@/types';

type Props = {
    evaluationPattern: EvaluationPattern | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function EvaluationPatternDetailDialog({
    evaluationPattern,
    open,
    onOpenChange,
}: Props) {
    if (!evaluationPattern) {
        return null;
    }

    const humanFactor = evaluationPattern.human_factor;
    const uiTags = evaluationPattern.ui_tags ?? [];

    /*
     * Temporary icons.
     * Later you can replace these with your dynamic Lucide icon mapping.
     */
    const Icon = ShieldCheck;
    const HFIcon = Brain;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="border-outline-variant h-[90vh] !w-[95vw] !max-w-[95vw] overflow-hidden rounded-3xl border bg-card p-0 shadow-2xl sm:!max-w-[95vw] lg:!max-w-8xl"
            >
                <DialogHeader className="border-b border-border bg-card px-8 pt-6 pb-5">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex min-w-0 items-center gap-6">
                            <Icon className="size-15 shrink-0 rounded-2xl bg-secondary/80 p-2 text-secondary-foreground" />

                            <div className="min-w-0">
                                <div className="mb-2 flex flex-nowrap items-center gap-2">
                                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-black text-primary">
                                        {evaluationPattern.h_id}
                                    </span>

                                    <span className="text-sm font-semibold text-muted-foreground">
                                        Evaluation Pattern
                                    </span>
                                </div>

                                <DialogTitle className="line-clamp-2 text-2xl leading-tight font-black text-foreground">
                                    {evaluationPattern.title}
                                </DialogTitle>

                                <DialogDescription className="mt-1 text-sm text-muted-foreground">
                                    MORPHEUS Evaluation Pattern detail profile
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="h-[calc(90vh-104px)] overflow-y-auto">
                    <section className="px-8 py-6">
                        <div className="flex flex-col gap-6 rounded-2xl lg:flex-row lg:items-stretch lg:justify-between">
                            <div className="flex h-fit flex-1 gap-10 rounded-xl border border-border bg-card-high p-6 lg:max-w-[45%]">
                                <div className="flex-1">
                                    <span className="text-outline mb-2 block text-xs font-bold tracking-widest uppercase">
                                        Human Factor
                                    </span>

                                    <p className="text-on-surface flex items-center gap-2 text-lg font-semibold">
                                        <HFIcon className="size-7 shrink-0" />
                                        {humanFactor?.name ?? 'Not assigned'}
                                    </p>
                                </div>

                                <div className="flex-1">
                                    <span className="text-outline mb-2 block text-xs font-bold tracking-widest uppercase">
                                        Category
                                    </span>

                                    <p className="text-on-surface flex items-center gap-2 text-lg font-semibold">
                                        {humanFactor?.category ??
                                            'Not provided'}
                                    </p>
                                </div>
                            </div>
                            <div className="mr-50">
                                <MetricCard
                                    icon={<BellRing className="size-5" />}
                                    label="Violations Flagged"
                                    value={
                                        evaluationPattern.number_of_violations
                                            ? String(
                                                evaluationPattern.number_of_violations,
                                            )
                                            : 'Not provided'
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 px-8 pb-8 lg:grid-cols-[1.45fr_1fr]">
                        <main className="space-y-6">
                            {uiTags.length > 0 && (
                                <section className="border-outline-variant rounded-2xl border bg-card-high p-5">
                                    <SectionTitle title="Interface Tags" />

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {uiTags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="rounded-full bg-surface-container px-3 py-1.5 text-xs font-bold text-muted-foreground"
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <section className="space-y-4">
                                <SectionTitle title="Theoretical Context" />
                                <DetailBlock
                                    label="Trigger"
                                    value={evaluationPattern.trigger}
                                />
                                <HighlightedBlock
                                    label={
                                        humanFactor
                                            ? `Factor: ${humanFactor.name}`
                                            : 'Human Factor'
                                    }
                                    value={evaluationPattern.human_factor_exp}
                                />
                                <div className="border-secondary/30 border-dotted border-2 p-3 gap-3">
                                    <DetailBlock
                                        label="Possible Error"
                                        value={evaluationPattern.error}
                                    />
                                    <ExampleBlock
                                        value={evaluationPattern.examples}
                                    />
                                </div>
                            </section>

                            <section className="space-y-4">
                                <SectionTitle title="Empirical Evidence" />

                                <DetailBlock
                                    label="Violations"
                                    value={evaluationPattern.violations}
                                />

                                <DetailBlock
                                    label="Organizational Question"
                                    value={evaluationPattern.org_question}
                                />
                            </section>
                        </main>

                        <aside className="space-y-5 rounded-3xl bg-slate-950 p-6 text-slate-100 dark:bg-card-high">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                                    <ShieldCheck className="size-5" />
                                </div>

                                <h3 className="text-lg font-black tracking-wide text-primary">
                                    Audit & Remediation
                                </h3>
                            </div>

                            <HighlightedBlock
                                label="Audit Rule"
                                value={evaluationPattern.audit_rule}
                            />

                            <DarkDetailBlock
                                label="Security Risk"
                                value={evaluationPattern.security_risk}
                                danger
                            />

                            <MitigationBlock
                                value={evaluationPattern.mitigation}
                            />

                            <DarkDetailBlock
                                label="Remediation"
                                value={evaluationPattern.remediation}
                            />
                        </aside>
                    </section>

                    <footer className="border-outline-variant sticky bottom-0 flex flex-col gap-3 border-t bg-card/95 px-8 py-4 backdrop-blur md:flex-row md:items-center md:justify-between">
                        <p className="text-xs font-semibold text-muted-foreground">
                            MORPHEUS Evaluation Pattern Profile ·{' '}
                            {evaluationPattern.h_id}
                        </p>
                    </footer>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ExampleBlock({ value }: { value?: string | null }) {
    if (!value) {
        return null;
    }

    const cleanedVal = value.trim();
    const lines = cleanedVal.split('\n').map((line) => line.trim());

    return (
        <div className="space-y-3 p-1">
            <h3 className="mb-2 border-b pb-1 text-xs font-black tracking-wide text-muted-foreground uppercase">
                EXAMPLES
            </h3>
            {lines.map((line, index) => (
                <div key={index} className="felx-row flex gap-2">
                    <CornerDownRight className="size-5 shrink-0 text-primary dark:text-secondary" />
                    <p className="font-bold text-primary dark:text-secondary uppercase text-nowrap">
                        {line.slice(1, 12)} :
                    </p>
                    <p>{line.slice(12, line.length)}</p>

                </div>
            ))}
        </div>
    );
}

function MitigationBlock({ value }: { value?: string | null }) {
    if (!value) {
        return null;
    }

    const cleanedValue = value.trim();

    const bundleMatch = cleanedValue.match(/^Nudge Bundle:\s*/i);
    const title = bundleMatch ? 'Nudge Bundle' : 'Mitigation';

    const withoutTitle = cleanedValue.replace(/^Nudge Bundle:\s*/i, '').trim();

    const ingredients = withoutTitle
        .split(/(?=Ingredient\s+\d+\s*\()/i)
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => {
            const match = item.match(
                /^Ingredient\s+(\d+)\s*\(([^)]+)\)\s*-\s*(.*)$/i,
            );

            if (!match) {
                return {
                    number: null,
                    name: null,
                    text: item,
                };
            }

            return {
                number: match[1],
                name: match[2],
                text: match[3],
            };
        });

    return (
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex flex-col border-b border-white/10 pb-2 text-xs font-bold tracking-widest uppercase">
                <h4 className="font-extrabold">MITIGATIONS</h4>
            </div>
            <h4 className="mb-3 text-xs tracking-wide text-primary uppercase">
                {title}
            </h4>

            <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                    <div
                        key={index}
                        className="flex gap-3 rounded-xl border border-secondary/30 bg-card-highest p-3"
                    >
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary dark:bg-secondary text-xs font-black text-primary-foreground">
                            {ingredient.number ?? index + 1}
                        </div>

                        <div>
                            {ingredient.name && (
                                <p className="mb-1 text-sm font-bold text-card-foreground">
                                    {ingredient.name}
                                </p>
                            )}

                            <p className="text-sm leading-6 text-card-foreground">
                                {ingredient.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function SectionTitle({ title }: { title: string }) {
    return (
        <h2 className="border-l-4 border-primary pl-3 text-sm font-black tracking-[0.2em] text-primary uppercase">
            {title}
        </h2>
    );
}

function MetricCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="border-outline-variant rounded-2xl border bg-card-high p-5">
            <div className="flex items-center gap-4">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {icon}
                </div>

                <div>
                    <p className="text-[11px] font-black tracking-[0.18em] text-muted-foreground uppercase">
                        {label}
                    </p>

                    <p className="mt-1 text-2xl font-black text-foreground">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

function DetailBlock({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    if (!value) {
        return null;
    }

    return (
        <div>
            <h3 className="mb-2 text-xs font-black tracking-wide text-muted-foreground uppercase">
                {label}
            </h3>

            <p className="text-sm leading-7 whitespace-pre-line text-foreground">
                {value}
            </p>
        </div>
    );
}

function HighlightedBlock({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    if (!value) {
        return null;
    }

    return (
        <div className="rounded-2xl border-l-4 border-primary bg-primary/5 p-5">
            <h3 className="mb-2 text-xs font-black tracking-wide text-primary uppercase">
                {label}
            </h3>

            <p className="text-sm leading-7 font-semibold whitespace-pre-line text-foreground italic">
                {value}
            </p>
        </div>
    );
}

function DarkDetailBlock({
    label,
    value,
    danger = false,
}: {
    label: string;
    value?: string | null;
    danger?: boolean;
}) {
    if (!value) {
        return null;
    }

    return (
        <section
            className={
                danger
                    ? 'rounded-2xl border border-destructive/40 bg-destructive/10 p-4'
                    : 'rounded-2xl border border-white/10 bg-white/5 p-4'
            }
        >
            <h4
                className={
                    danger
                        ? 'mb-2 text-xs font-black tracking-wide text-destructive uppercase'
                        : 'mb-2 text-xs font-black tracking-wide text-primary uppercase'
                }
            >
                {label}
            </h4>

            <p className="text-sm leading-7 whitespace-pre-line text-slate-100">
                {value}
            </p>
        </section>
    );
}
