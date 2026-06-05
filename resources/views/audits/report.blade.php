<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>MORPHEUS Audit Report</title>

    <style>
        @page {
            margin: 35px 40px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #111827;
            line-height: 1.45;
            background: #ffffff;
        }

        h1 {
            font-size: 24px;
            margin: 0 0 6px;
            color: #111827;
        }

        h2 {
            font-size: 17px;
            margin: 0 0 10px;
            color: #111827;
            page-break-after: avoid;
        }

        h3 {
            font-size: 13px;
            margin: 10px 0 5px;
            color: #374151;
            page-break-after: avoid;
        }

        p {
            margin: 0 0 7px;
        }

        .muted {
            color: #6b7280;
        }

        .label {
            font-weight: bold;
            color: #111827;
        }

        .header {
            border-bottom: 3px solid #0594d6;
            padding-bottom: 12px;
            margin-bottom: 18px;
        }

        .header-subtitle {
            color: #597b96;
            font-size: 12px;
            margin-top: 2px;
        }

        .section {
            margin-bottom: 18px;
        }

        .section-card {
            border: 1px solid #d1d5db;
            background: #f9fafb;
            padding: 12px;
            margin-bottom: 18px;
        }

        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }

        .meta-table th,
        .meta-table td {
            border: 1px solid #d1d5db;
            padding: 7px;
            text-align: left;
            vertical-align: top;
        }

        .meta-table th {
            width: 28%;
            background: #f3f4f6;
            font-weight: bold;
            color: #111827;
        }

        .meta-table td {
            background: #ffffff;
        }

        /*
         * Forces the findings section to start on a new page.
         * This prevents the "Findings and Human Factor Analysis" heading
         * from remaining alone at the bottom of the previous page.
         */
        .findings-section {
            page-break-before: always;
            padding-top: 8px;
        }

        .findings-heading {
            page-break-after: avoid;
            margin-bottom: 12px;
            color: #111827;
        }

        .finding {
            border: 1px solid #d1d5db;
            border-left: 5px solid #0594d6;
            padding: 14px;
            margin-bottom: 18px;
            page-break-inside: avoid;
            background: #ffffff;
        }

        .finding-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #111827;
        }

        .badge {
            display: inline-block;
            padding: 3px 7px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .risk-critical {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }

        .risk-high {
            background: #ffedd5;
            color: #9a3412;
            border: 1px solid #fed7aa;
        }

        .risk-medium {
            background: #fef9c3;
            color: #854d0e;
            border: 1px solid #fde68a;
        }

        .risk-low {
            background: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
        }

        .risk-unknown {
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
        }

        ul {
            margin: 4px 0 8px 18px;
            padding: 0;
        }

        li {
            margin-bottom: 4px;
        }

        .pattern-box {
            border: 1px solid #e5e7eb;
            background: #f9fafb;
            padding: 9px;
            margin-top: 8px;
            page-break-inside: avoid;
        }

        .pattern-title {
            color: #0594d6;
            font-weight: bold;
        }

        .mitigation-box {
            border: 1px solid #d1d5db;
            background: #f3f4f6;
            padding: 9px;
            margin-top: 6px;
            page-break-inside: avoid;
        }

        .executive-question {
            border-left: 4px solid #ca7d02;
            background: #fff7ed;
            padding: 8px 10px;
            margin-top: 8px;
            page-break-inside: avoid;
        }
    </style>
</head>

<body>
<div class="header">
    <h1>MORPHEUS Audit Report</h1>
    <p class="header-subtitle">
        Human Factors Cybersecurity Evaluation Report
    </p>
</div>

<div class="section">
    <h2>Task Information</h2>

    <table class="meta-table">
        <tr>
            <th>Task Name</th>
            <td>{{ $task->task_name ?? 'N/A' }}</td>
        </tr>
        <tr>
            <th>User Type</th>
            <td>{{ $task->user_type ?? 'N/A' }}</td>
        </tr>
        <tr>
            <th>User Role</th>
            <td>{{ $task->user_role ?? 'N/A' }}</td>
        </tr>
        <tr>
            <th>User Intent</th>
            <td>{{ $task->user_intent ?? 'N/A' }}</td>
        </tr>
        <tr>
            <th>Stress Level</th>
            <td>{{ $task->stress_level ?? 'N/A' }}</td>
        </tr>
        <tr>
            <th>Cost of Error</th>
            <td>{{ $task->cost_of_error ?? 'N/A' }}</td>
        </tr>
    </table>
</div>

<div class="section section-card">
    <h2>Executive Summary</h2>

    <p>
        This report identifies interface, cognitive, and organizational weaknesses
        that may increase human-factor-related cybersecurity risk.
    </p>

    <p>
        <span class="label">Total Findings:</span>
        {{ ($task->findings ?? collect())->count() }}
    </p>
</div>

<div class="section findings-section">
    <h2 class="findings-heading">Findings and Human Factor Analysis</h2>

    @forelse($task->findings as $finding)
        @php
            $patterns = $finding->evaluationPatterns ?? collect();
            $firstPattern = $patterns->first();

            $severityRaw = strtolower((string) ($finding->severity ?? ''));

            $riskLabel = match ($severityRaw) {
                'critical', 'critico' => 'Critical',
                'high', 'alta', 'alto' => 'High',
                'medium', 'media', 'medio' => 'Medium',
                'low', 'bassa', 'basso' => 'Low',
                default => 'To be assessed',
            };

            $riskClass = match ($riskLabel) {
                'Critical' => 'risk-critical',
                'High' => 'risk-high',
                'Medium' => 'risk-medium',
                'Low' => 'risk-low',
                default => 'risk-unknown',
            };

            $title = $finding->title
                ?? $finding->name
                ?? $firstPattern?->title
                ?? 'Human-factor-related vulnerability';

            $description = $finding->visual_element_description
                ?? $finding->description
                ?? 'No description available.';

            $attackScenario = $finding->pragmatic_explanation
                ?? $firstPattern?->security_risk
                ?? $firstPattern?->error
                ?? 'No attack scenario available.';

            $impact = $finding->impact
                ?? $firstPattern?->violations
                ?? $firstPattern?->security_risk
                ?? 'No impact information available.';

            $mitigation = $finding->remediation
                ?? $firstPattern?->remediation
                ?? $firstPattern?->mitigation
                ?? 'No mitigation available.';
        @endphp

        <div class="finding">
            <div class="finding-title">
                VULN-{{ str_pad($loop->iteration, 2, '0', STR_PAD_LEFT) }}:
                {{ $title }}
            </div>

            <p>
                <span class="label">Description:</span>
                {!! nl2br(e($description)) !!}
            </p>

            <p>
                <span class="label">Attack Scenario / Risk:</span>
                {!! nl2br(e($attackScenario)) !!}
            </p>

            <p>
                <span class="label">Risk Level:</span>
                <span class="badge {{ $riskClass }}">
                    {{ $riskLabel }}
                </span>

                @if($finding->severity)
                    <span class="muted">
                        Detected severity: {{ $finding->severity }}
                    </span>
                @endif
            </p>

            <p>
                <span class="label">Business and Regulatory Impact:</span>
                {!! nl2br(e($impact)) !!}
            </p>

            <h3>Human Factor Analysis</h3>

            @if($patterns->count())
                @foreach($patterns as $pattern)
                    <div class="pattern-box">
                        <p class="pattern-title">
                            {{ $pattern->h_id ?? ('EP-' . $pattern->id) }}
                            —
                            {{ $pattern->title ?? 'Evaluation Pattern' }}
                        </p>

                        @if($pattern->humanFactor ?? false)
                            <p>
                                <span class="label">Human Factor:</span>
                                {{ $pattern->humanFactor->name ?? 'N/A' }}
                            </p>
                        @endif

                        @if($pattern->human_factor_exp)
                            <p>
                                <span class="label">Socio-technical Dynamic:</span>
                                {!! nl2br(e($pattern->human_factor_exp)) !!}
                            </p>
                        @endif

                        @if($pattern->trigger)
                            <p>
                                <span class="label">Trigger:</span>
                                {!! nl2br(e($pattern->trigger)) !!}
                            </p>
                        @endif

                        @if($pattern->error)
                            <p>
                                <span class="label">Unsafe Action:</span>
                                {!! nl2br(e($pattern->error)) !!}
                            </p>
                        @endif

                        @if($pattern->pivot?->description)
                            <p>
                                <span class="label">Link Rationale:</span>
                                {!! nl2br(e($pattern->pivot->description)) !!}
                            </p>
                        @endif
                    </div>
                @endforeach
            @else
                <p class="muted">No evaluation patterns associated with this finding.</p>
            @endif

            <h3>Strategic Mitigation Plan</h3>

            <div class="mitigation-box">
                {!! nl2br(e($mitigation)) !!}
            </div>

            @if($finding->executive_question)
                <h3>Executive Question</h3>

                <div class="executive-question">
                    {!! nl2br(e($finding->executive_question)) !!}
                </div>
            @endif
        </div>
    @empty
        <p>No findings available for this task.</p>
    @endforelse
</div>
</body>
</html>
