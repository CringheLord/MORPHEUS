import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import React from 'react';


import { FieldHelp } from '@/components/fieldHelp';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { Task } from '@/types';

const helpTexts = {
    flowName:
        'Give a short name to the interaction flow being analyzed. Example: Login with 2FA, Password Reset, Patient Data Entry, or Onboarding User.',

    userType:
        'Describe the user expertise or risk profile. Example: novice user, standard user, expert user, or critical operator. This helps estimate possible cognitive and usability risks.',

    userRole:
        'Specify the user’s role in the system or organization. Example: patient, employee, administrator, healthcare operator, customer, or security manager.',

    userIntent:
        'Describe what the user is trying to achieve and why. Example: “The user wants to insert the patient SIM data before completing the registration.” This gives context to the interface analysis.',

    stressLevel:
        'Estimate the pressure during the task, from calm to panic. Higher stress can increase impulsive actions, cognitive overload, misperception, and risky decisions.',

    costOfError:
        'Define the impact of a mistake. Low means minor inconvenience; medium means frustration or delay; high means security or privacy risk; critical means severe operational impact.',
};

type Props = {
    task: Task | null;
    open: boolean;
    onClose: () => void;
    studyCaseId: number;
}

type TaskForm = {
    task_name: string;
    user_type: string;
    user_role: string;
    user_intent: string;
    stress_level: number;
    cost_of_error: string;
};

const emptyTaskForm: TaskForm = {
    task_name: '',
    user_type: 'standard_user',
    user_role: '',
    user_intent: '',
    stress_level: 5,
    cost_of_error: 'medium',
};


export default function CreateTask({ open, onClose, studyCaseId, task,  }: Props) {
    const isEditMode = !!task;

    const form = useForm<TaskForm>(emptyTaskForm);

    useEffect(() => {
        if (!open) {
            return;
        }

        if (task) {
            form.setData({
                task_name: task.task_name ?? '',
                user_type: task.user_type ?? 'standard_user',
                user_role: task.user_role ?? '',
                user_intent: task.user_intent ?? '',
                stress_level: task.stress_level ?? 5,
                cost_of_error: task.cost_of_error ?? 'medium',
            });
        } else {
            form.setData(emptyTaskForm);
        }

        form.clearErrors();
    }, [open, task]);

    const handleClose = () => {
        form.reset();
        form.clearErrors();
        onClose();
    }


    const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (isEditMode && task) {
            form.put(`/study-cases/${studyCaseId}/tasks/${task.id}`, {
                preserveScroll: true,
                onSuccess: () => handleClose(),
            });
        } else {
            form.post(`/study-cases/${studyCaseId}/tasks`, {
                preserveScroll: true,
                onSuccess: () => handleClose(),
            });
        }
    };

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
            <div className="border-outline-variant w-full max-w-3xl rounded-[2rem] border bg-card p-10 shadow-2xl">
                <div className="mb-10 flex items-start justify-between gap-6">
                    <div>
                        <h2 className="font-display text-2xl font-black tracking-tight text-foreground uppercase">
                            {isEditMode
                                ? 'Update Interaction Task'
                                : 'Define Interaction Task'}
                        </h2>
                        <p className="text-on-surface-variant mt-2 text-sm italic">
                            Configure the user flow that will be analyzed in the
                            Interface Layer.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-on-surface-variant rounded-full p-2 transition hover:bg-surface-container-high hover:text-foreground"
                        aria-label="Close modal"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="text-outline flex items-center gap-2 text-[11px] font-black tracking-widest uppercase">
                                Flow Name
                                <FieldHelp text={helpTexts.flowName} />
                            </Label>

                            <Input
                                value={form.data.task_name}
                                onChange={(e) =>
                                    form.setData('task_name', e.target.value)
                                }
                                placeholder="e.g. Insert patient's phone data"
                                className="h-14 rounded-2xl bg-surface-container-low px-5"
                            />

                            <InputError message={form.errors.task_name} />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-outline flex items-center gap-2 text-[11px] font-black tracking-widest uppercase">
                                User Type
                                <FieldHelp text={helpTexts.userType} />
                            </Label>

                            <select
                                value={form.data.user_type}
                                onChange={(e) =>
                                    form.setData('user_type', e.target.value)
                                }
                                className="h-14 w-full rounded-2xl border-input bg-surface-container-low px-5 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="novice_user">
                                    Novice user
                                </option>
                                <option value="standard_user">
                                    Standard user
                                </option>
                                <option value="critical_operator">
                                    Critical operator
                                </option>
                            </select>

                            <InputError message={form.errors.user_type} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-outline flex items-center gap-2 text-[11px] font-black tracking-widest uppercase">
                            User Role
                            <FieldHelp text={helpTexts.userRole} />
                        </Label>

                        <Input
                            value={form.data.user_role}
                            onChange={(e) =>
                                form.setData('user_role', e.target.value)
                            }
                            placeholder="e.g. Healthcare operator, employee, admin, customer"
                            className="h-14 rounded-2xl bg-surface-container-low px-5"
                        />

                        <InputError message={form.errors.user_role} />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-outline flex items-center gap-2 text-[11px] font-black tracking-widest uppercase">
                            User Intent
                            <FieldHelp text={helpTexts.userIntent} />
                        </Label>

                        <textarea
                            value={form.data.user_intent}
                            onChange={(e) =>
                                form.setData('user_intent', e.target.value)
                            }
                            placeholder="e.g. Insert the patient's SIM data and confirm the operation without exposing sensitive information."
                            className="min-h-28 w-full resize-none rounded-2xl border-input bg-surface-container-low px-5 py-4 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />

                        <InputError message={form.errors.user_intent} />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <Label className="text-outline flex items-center gap-2 text-[11px] font-black tracking-widest uppercase">
                                Stress Level
                                <FieldHelp text={helpTexts.stressLevel} />
                            </Label>

                            <input
                                type="range"
                                min={1}
                                max={10}
                                value={form.data.stress_level}
                                onChange={(e) =>
                                    form.setData(
                                        'stress_level',
                                        Number(e.target.value),
                                    )
                                }
                                className="w-full accent-primary"
                            />

                            <div className="text-outline flex justify-between text-[10px] font-black tracking-widest uppercase">
                                <span>Calm</span>
                                <span>{form.data.stress_level}</span>
                                <span>Panic</span>
                            </div>

                            <InputError message={form.errors.stress_level} />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-outline flex items-center gap-2 text-[11px] font-black tracking-widest uppercase">
                                Cost of Error
                                <FieldHelp text={helpTexts.costOfError} />
                            </Label>

                            <select
                                value={form.data.cost_of_error}
                                onChange={(e) =>
                                    form.setData(
                                        'cost_of_error',
                                        e.target.value,
                                    )
                                }
                                className="h-14 w-full rounded-2xl border-input bg-surface-container-low px-5 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="low">
                                    Low — Minor inconvenience
                                </option>
                                <option value="medium">
                                    Medium — Frustration or delay
                                </option>
                                <option value="high">
                                    High — Security/privacy risk
                                </option>
                                <option value="critical">
                                    Critical — Severe operational impact
                                </option>
                            </select>

                            <InputError message={form.errors.cost_of_error} />
                        </div>
                    </div>

                    <div className="border-outline-variant flex items-center justify-end gap-4 border-t pt-8">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={form.processing}
                            className="px-8 tracking-widest uppercase"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="min-w-56 rounded-2xl px-10 py-6 text-xs font-black tracking-widest uppercase"
                        >
                            {form.processing ? 'Creating...' : 'Save'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
