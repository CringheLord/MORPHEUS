import { AlertTriangle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';


type ProgressStatus =
    | 'idle'
    | 'queued'
    | 'running'
    | 'completed'
    | 'completed_with_errors'
    | 'failed';

type ProgressSize = 'sm' | 'md' | 'lg';

type LoadingVariant = 'line' | 'circle' | 'dots';

type ProgressStatusCardProps = {
    status: ProgressStatus;
    size?: ProgressSize;
    loadingVariant?: LoadingVariant;
    current?: number;
    total?: number;
    title?: string;
    message?: string | null;
    error?: string | null;
    icon?: React.ReactNode;
    showPercentage?: boolean;
    showCounter?: boolean;
    className?: string;
};

const statusConfig: Record<
    ProgressStatus,
    {
        label: string;
        icon: React.ReactNode;
        titleClassName: string;
    }
> = {
    idle: {
        label: 'Idle',
        icon: <Loader2 className="size-4" />,
        titleClassName: 'text-muted-foreground',
    },
    queued: {
        label: 'Audit queued',
        icon: <Loader2 className="size-4 animate-spin" />,
        titleClassName: 'text-primary',
    },
    running: {
        label: 'Audit in progress',
        icon: <Loader2 className="size-4 animate-spin" />,
        titleClassName: 'text-primary',
    },
    completed: {
        label: 'Audit completed',
        icon: <CheckCircle2 className="size-4" />,
        titleClassName: 'text-primary',
    },
    completed_with_errors: {
        label: 'Completed with errors',
        icon: <AlertTriangle className="size-4" />,
        titleClassName: 'text-alert',
    },
    failed: {
        label: 'Audit failed',
        icon: <XCircle className="size-4" />,
        titleClassName: 'text-destructive',
    },
};
const sizeClasses: Record<
    ProgressSize,
    {
        card: string;
        title: string;
        message: string;
        circle: number;
        stroke: number;
    }
> = {
    sm: {
        card: 'rounded-2xl p-4',
        title: 'text-sm',
        message: 'text-xs',
        circle: 44,
        stroke: 4,
    },
    md: {
        card: 'rounded-3xl p-6',
        title: 'text-base',
        message: 'text-sm',
        circle: 56,
        stroke: 5,
    },
    lg: {
        card: 'rounded-3xl p-8',
        title: 'text-lg',
        message: 'text-sm',
        circle: 72,
        stroke: 6,
    },
};

function getProgressPercentage(current = 0, total = 0): number {
    if (total <= 0) {
        return 0;
    }

    return Math.min(100, Math.max(0, Math.round((current / total) * 100)));
}

function LoadingDots() {
    return (
        <div className="flex items-center gap-1.5">
            <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <span className="size-2 animate-bounce rounded-full bg-primary" />
        </div>
    );
}

function CircularProgress({
    percentage,
    size,
    stroke,
}: {
    percentage: number;
    size: number;
    stroke: number;
}) {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div
            className="relative grid shrink-0 place-items-center text-primary"
            style={{ width: size, height: size }}
        >
            <svg className="-rotate-90" width={size} height={size}>
                <circle
                    className="text-muted"
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />

                <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    className="transition-all duration-500"
                />
            </svg>

            <span className="absolute text-xs font-black text-foreground">
                {percentage}%
            </span>
        </div>
    );
}

const AuditProgressStatusCard = ({
    status,
    current = 0,
    total = 0,
    title,
    message,
    error,
    icon,
    size = 'md',
    loadingVariant = 'line',
    showPercentage = true,
    showCounter = true,
    className,
}: ProgressStatusCardProps) => {
    const config = statusConfig[status];
    const sizing = sizeClasses[size];
    const percentage = getProgressPercentage(current, total);

    const showLine = loadingVariant === 'line';
    const showCircle = loadingVariant === 'circle';
    const showDots = loadingVariant === 'dots';

    return (
        <div
            className={cn(
                'border border-dashed border-border bg-card-high text-center',
                sizing.card,
                className,
            )}
        >
            <div className="flex items-start justify-between gap-4 text-left">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <div className="grid size-8 place-items-center rounded-xl bg-muted text-primary">
                            {icon ?? config.icon}
                        </div>

                        <h3
                            className={cn(
                                'font-display font-black tracking-tight uppercase',
                                sizing.title,
                                config.titleClassName,
                            )}
                        >
                            {title ?? config.label}
                        </h3>
                    </div>

                    {message && (
                        <p
                            className={cn(
                                'mt-3 text-muted-foreground',
                                sizing.message,
                            )}
                        >
                            {message}
                        </p>
                    )}

                    {error && (
                        <p className="mt-3 text-xs font-medium text-destructive">
                            {error}
                        </p>
                    )}
                </div>

                {showCircle && (
                    <CircularProgress
                        percentage={percentage}
                        size={sizing.circle}
                        stroke={sizing.stroke}
                    />
                )}

                {showDots && (
                    <div className="flex shrink-0 items-center justify-center rounded-xl bg-muted px-3 py-2">
                        <LoadingDots />
                    </div>
                )}
            </div>

            {(showLine || showCounter || showPercentage) && (
                <div className="mt-5">
                    {(showCounter || showPercentage) && (
                        <div className="mb-2 flex items-center justify-between text-xs font-bold text-muted-foreground">
                            {showCounter && (
                                <span>
                                    {current}/{total || '?'}
                                </span>
                            )}

                            {showPercentage && <span>{percentage}%</span>}
                        </div>
                    )}

                    {showLine && (
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
export default AuditProgressStatusCard;
