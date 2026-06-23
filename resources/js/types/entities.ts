import type { User } from './auth';
import { number } from 'framer-motion';

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
    findings_count: number;

    ui_tags: uiTag[];

    findings?: Array<
        Finding & {
        pivot: {
            finding_id: number;
            evaluation_pattern_id: number;
            description: string;
        };
    }
    >;
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
    user_type: 'novice_user' | 'standard_user' | 'critical_operator'; //--> //Expert (Industry specialist)
    user_role: string;
    user_intent: string;
    stress_level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10; //Critical Operator (Under constant stress)
    cost_of_error: 'low' | 'medium' | 'critical';

    conversation?: AgentConversation | null;
    findings?: Finding[] | null;
    artifacts?: Artifact[] | null;
    audit_message: string;
    audit_error: string;
    audit_status: 'running' | 'idle' | 'completed' | 'failed' | 'completed_with_errors';
    audit_current: number;
    audit_total: number;
};

export type Artifact = {
    id: number;
    task_id: number;
    image_url: string;
    file_path: string;
    page_url: string;
}

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
    submissions: Submission[];
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

export type Submission = {
    id: number;
    answers: Answer[];
    questionnaire_id: number;
    time_spent: number | null;
}

export type Answer = {
    id: number;
    answer: boolean | null;
    score: number | null;
    text: string | null;
    question_id: number;
}

export type Finding = {
    id: number;
    title: string;
    task_id: number;
    artifact_id: number;
    description: string;
    attack_scenario: string;
    impact: string;
    severity: string;

    internal_reasoning: string;
    pragmatic_explanation: string;
    executive_question: string;

    evaluation_patterns?: Array<
        EvaluationPattern & {
        pivot: {
            finding_id: number;
            evaluation_pattern_id: number;
            description: string;
        };
    }
    >;

    mitigations: Mitigation[];
};

export type Mitigation = {
    id: number;
    title: string;
    finding_id: number;
    description: string;
}

export type AgentConversation = {
    id: string;
    user_id: number;
    task_id: number;
    title: string;
    messages: Message [];
}

export type Message = {
    id: string;
    conversation_id: AgentConversation;
    user_id: number;
    task_id: number;
    agent: string;
    role: string;
    content: string;
}

export type StudyCaseSummary = {
    id: number;
    title: string;
    status?: string | null;
    updated_at?: string | null;
    tasks_count?: number;
    questionnaires_count?: number;
}

export type DashboardStats = {
    study_cases_count: number;
    tasks_count: number;
    findings_count: number;
}

export type DashboardProps = {
    lastStudyCase: StudyCaseSummary | null;
    recentStudyCases: StudyCaseSummary[];
    stats: DashboardStats;
}




