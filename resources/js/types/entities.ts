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
};

export type HumanFactor = {
    id: number;
    h_id: string;
    title: string;
    description: string;
};
