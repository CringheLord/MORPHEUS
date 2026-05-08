<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            [
                'title' => 'Cybersecurity Training Availability',
                'question' => 'Do employees receive periodic cybersecurity training related to their daily tasks?',
                'type' => 'yes_no',
                'category' => 'Training',
                'human_factor' => 'Lack of training',
            ],
            [
                'title' => 'Training Practicality',
                'question' => 'How useful is the cybersecurity training for recognizing risks during real work activities?',
                'type' => 'likert',
                'category' => 'Training',
                'human_factor' => 'Lack of training',
            ],
            [
                'title' => 'Security Procedure Clarity',
                'question' => 'Are security procedures written in a way that is easy to understand and apply?',
                'type' => 'likert',
                'category' => 'Procedures',
                'human_factor' => 'Lack of knowledge',
            ],
            [
                'title' => 'Emergency Procedure Accessibility',
                'question' => 'Can employees easily access security procedures during urgent or stressful situations?',
                'type' => 'yes_no',
                'category' => 'Procedures',
                'human_factor' => 'Stress',
            ],
            [
                'title' => 'Time Pressure During Tasks',
                'question' => 'Do employees often feel pressured to complete tasks quickly even when security checks are required?',
                'type' => 'likert',
                'category' => 'Workload',
                'human_factor' => 'Time pressure',
            ],
            [
                'title' => 'Security Verification Time',
                'question' => 'Do employees have enough time to verify suspicious emails, links, or requests before acting?',
                'type' => 'likert',
                'category' => 'Workload',
                'human_factor' => 'Time pressure',
            ],
            [
                'title' => 'Resource Adequacy',
                'question' => 'Are employees provided with sufficient tools and resources to follow secure work practices?',
                'type' => 'likert',
                'category' => 'Resources',
                'human_factor' => 'Lack of resources',
            ],
            [
                'title' => 'Support from IT/Security Team',
                'question' => 'Do employees know who to contact when they encounter a possible cybersecurity issue?',
                'type' => 'yes_no',
                'category' => 'Communication',
                'human_factor' => 'Lack of communication',
            ],
            [
                'title' => 'Incident Reporting Confidence',
                'question' => 'Would employees feel comfortable reporting a security mistake without fear of blame?',
                'type' => 'likert',
                'category' => 'Security Culture',
                'human_factor' => 'Lack of communication',
            ],
            [
                'title' => 'Security Communication Effectiveness',
                'question' => 'Are cybersecurity updates and warnings communicated clearly by the organization?',
                'type' => 'likert',
                'category' => 'Communication',
                'human_factor' => 'Lack of communication',
            ],
            [
                'title' => 'Policy Awareness',
                'question' => 'Are employees aware of the organization’s cybersecurity policies?',
                'type' => 'yes_no',
                'category' => 'Security Culture',
                'human_factor' => 'Attitude towards policies',
            ],
            [
                'title' => 'Policy Compliance Difficulty',
                'question' => 'Which cybersecurity policies are difficult to follow during everyday work, and why?',
                'type' => 'free_text',
                'category' => 'Security Culture',
                'human_factor' => 'Attitude towards policies',
            ],
            [
                'title' => 'Password Management Practices',
                'question' => 'Do employees receive clear guidance on how to create, store, and manage passwords securely?',
                'type' => 'yes_no',
                'category' => 'Procedures',
                'human_factor' => 'Lack of knowledge',
            ],
            [
                'title' => 'Phishing Awareness',
                'question' => 'How confident are employees in recognizing phishing attempts?',
                'type' => 'likert',
                'category' => 'Training',
                'human_factor' => 'Security self-efficacy',
            ],
            [
                'title' => 'Security Self-Efficacy',
                'question' => 'Do employees feel capable of making correct security decisions without external help?',
                'type' => 'likert',
                'category' => 'Security Culture',
                'human_factor' => 'Security self-efficacy',
            ],
            [
                'title' => 'Fatigue During Security-Sensitive Tasks',
                'question' => 'Do employees perform security-sensitive tasks when they are tired or mentally overloaded?',
                'type' => 'likert',
                'category' => 'Workload',
                'human_factor' => 'Cognitive fatigue',
            ],
            [
                'title' => 'Interruptions and Distractions',
                'question' => 'Are employees frequently interrupted while performing tasks that require security attention?',
                'type' => 'likert',
                'category' => 'Workload',
                'human_factor' => 'Cognitive fatigue',
            ],
            [
                'title' => 'Organizational Security Norms',
                'question' => 'Do employees observe colleagues following secure behavior in daily work routines?',
                'type' => 'likert',
                'category' => 'Security Culture',
                'human_factor' => 'Norms',
            ],
            [
                'title' => 'Management Support for Security',
                'question' => 'Does management encourage employees to prioritize security even when it slows down work?',
                'type' => 'likert',
                'category' => 'Security Culture',
                'human_factor' => 'Norms',
            ],
            [
                'title' => 'Open Feedback on Security Problems',
                'question' => 'What organizational problems make it harder for employees to follow cybersecurity best practices?',
                'type' => 'free_text',
                'category' => 'Security Culture',
                'human_factor' => 'Lack of resources',
            ],
        ];

        foreach ($questions as $question) {
            Question::query()->updateOrCreate(
                [
                    'title' => $question['title'],
                ],
                $question,
            );
        }
    }
}
