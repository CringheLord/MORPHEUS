import type { User } from './auth';

export type EvaluationPattern = {
    id: number;
    h_id: string;
    title: string;
    icon: string;
    human_factor_id: number;
    human_factor: HumanFactor;
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
    number_of_violations: number;

    ui_tags: uiTag[];
};

export type uiTag = {
    id: number;
    name: string;
    category: string;
    slug: string;
};

export type HumanFactor = {
    id: number;
    name: string;
    category: string;
    icon: string;
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
    main_device?: string | null;
    sector?: string | null;
    currentLayerFromPivot?: string | null;

    tasks?: Task[] | null;
    questionnaires?: Questionnaire[] | null;

    completed_at: string | null;
    created_at: string;
    updated_at: string | null;
};

export type Task = {
    id: number;
    study_case_id: number; //Novice (Low technological confidence)
    task_name: string; //Average User (Standard daily use)
    user_type: 'novice' | 'average_user' | 'expert' | 'critical_operator'; //--> //Expert (Industry specialist)
    user_role: string;
    user_intent: string;
    stress_level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10; //Critical Operator (Under constant stress)
    cost_of_error: 'low' | 'medium' | 'critical';
};

export type Questionnaire = {
    id: number;
    title: string | null;
    status: 'draft' | 'active' | 'closed';
    description: string | null;
    study_case_id: number;
    created_by_id: number;
    questions_count: number;
    submissions_count: number;
    link: string;
    questions: Question[];
    created_at: string;
};

export type Question = {
    id: number;
    title: string;
    question: string;
    type: string;
    position: number;
    pivot?: {
        position: number;
    };
    //answer: string;
}

