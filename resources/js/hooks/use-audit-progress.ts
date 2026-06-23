import { router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export type AuditProgress = {
    status:
        | 'idle'
        | 'queued'
        | 'running'
        | 'completed'
        | 'completed_with_errors'
        | 'failed';
    current: number;
    total: number;
    message: string | null;
    error: string | null;
    findings_count?: number;
};

type UseAuditProgressParams = {
    taskId: number;
    initialProgress: AuditProgress;
    intervalMs?: number;
};

function isAuditActive(status: AuditProgress['status']) {
    return status === 'queued' || status === 'running';
}

function isAuditFinished(status: AuditProgress['status']) {
    return (
        status === 'completed' ||
        status === 'completed_with_errors' ||
        status === 'failed'
    );
}

export function useAuditProgress({
    taskId,
    initialProgress,
    intervalMs = 2000,
}: UseAuditProgressParams) {
    const [auditProgress, setAuditProgress] =
        useState<AuditProgress>(initialProgress);

    useEffect(() => {
        if (!isAuditActive(auditProgress.status)) {
            return;
        }

        const interval = window.setInterval(async () => {
            try {
                const { data } = await axios.get<AuditProgress>(
                    route('tasks.audit-progress', taskId),
                );

                setAuditProgress(data);

                if (isAuditFinished(data.status)) {
                    window.clearInterval(interval);

                    router.reload({
                        only: ['task', 'findings'],
                        preserveScroll: true,
                    });
                }
            } catch (error) {
                console.error('Unable to fetch audit progress:', error);
            }
        }, intervalMs);

        return () => window.clearInterval(interval);
    }, [auditProgress.status, taskId, intervalMs]);

    return auditProgress;
}
