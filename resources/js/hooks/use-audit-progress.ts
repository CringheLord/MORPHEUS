import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import axios from 'axios';
import { useEffect, useState } from 'react';

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

export function useAuditProgress({ taskId, initialProgress, intervalMs = 2000, }: UseAuditProgressParams) {

    const [auditProgress, setAuditProgress] = useState<AuditProgress>(initialProgress);

    useEffect(() => {
        const isAuditActive = auditProgress.status === 'running';

        if (!isAuditActive) {
            return;
        }

        const interval = window.setInterval(async () => {
            try {
                const { data } = await axios.get<AuditProgress>(
                    route('task.audit-progress', taskId),
                );

                setAuditProgress(data);

                if (data.status === 'completed' || data.status === 'failed' || data.status === 'completed_with_errors') {
                    window.clearInterval(interval);

                    router.reload({
                        only: ['task', 'findings']
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
