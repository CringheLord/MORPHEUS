import type { User } from './auth';

export type Heuristic = {
    id: number;
    h_id: string;
    title: string;
    icon: string;
    human_factor_id: object;
    incidence_rate: number;
    trigger: string;
    examples: string;
    human_factor_exp: string;
    error: string;
    mitigation: string;
    audit_rule: string;
    violations: string;
    security_risk: string;
    remediation: string;
    org_question: string;

    ui_tags: uiTag[];
};

export type uiTag = {
    id: number;
    name: string;
    slug: string;
};

export type HumanFactor = {
    id: number;
    h_id: string;
    title: string;
    description: string;
};

export type StudyCase = {
    id: number;
    title: string;
    description: string | null;

    risk_score: number;
    risk_level: 'low' | 'medium' | 'high';
    status: 'draft' | 'in_progress' | 'completed' | 'archived';
    c_percentage: number;

    owner?: User | null;
    users?: User[] | null;
    lastUser?: User | null;
    assigned_user_id?: number | null;
    system_name?: string | null;
    system_type?: string | null;
    current_layer?: string | null;

    completed_at: string | null;
    created_at: string;
    updated_at: string | null;
};
