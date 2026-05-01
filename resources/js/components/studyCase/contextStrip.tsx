import {
    MonitorSmartphone,
    Bug,
    Clock4,
    UserRoundPen,
    UserCheck,
    Check,
    X,
    Pencil,
} from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import type { StudyCase, User } from '@/types';

type ShowFormData = {
    title: string;
    status: string;
    risk_level: 'low' | 'medium' | 'high';
    assigned_user_id: number | null;
    system_name: string;
    system_type: string;
    main_device: string;
    sector: string;
    current_layer: string | null;
}

type Props = {
    studyCase: StudyCase;
    relatedUsers: User[];
    form: {
        data: ShowFormData;
        setData: (key: keyof ShowFormData, value: any) => void;
        errors: Partial<Record<keyof ShowFormData, string>>;
        processing: boolean;
    };
    editingField: string | null;
    setEditingField: (value: string | null) => void;
    saveField: (field: keyof ShowFormData) => void;
    cancelFieldEdit: (field: keyof ShowFormData) => void;
};

const RiskColor = ({
    risk_level,
}: {
    risk_level: 'low' | 'medium' | 'high' | null | undefined;
}) => {
    if (risk_level === 'low') {
        return (
            <span className="text-xsm rounded bg-emerald-300/10 px-1.5 py-0.5 font-bold tracking-wider text-emerald-700 uppercase">
                Low
            </span>
        );
    } else if (risk_level === 'medium') {
        return (
            <span className="text-xsm rounded bg-alert/10 px-1.5 py-0.5 font-bold tracking-wider text-alert uppercase">
                Medium
            </span>
        );
    } else if (risk_level === 'high') {
        return (
            <span className="text-xsm rounded bg-destructive/20 px-1.5 py-0.5 font-bold tracking-wider text-destructive uppercase">
                High
            </span>
        );
    }

    return (
        <span className="text-xsm rounded bg-muted px-1.5 py-0.5 font-bold tracking-wider uppercase">
            N/A
        </span>
    );
};

const statusLabel = (value: string | null | undefined) => {
    switch (value) {
        case 'draft':
            return 'Draft';
        case 'in_progress':
            return 'In Progress';
        case 'completed':
            return 'Completed';
        case 'archived':
            return 'Archived';
        default:
            return 'Unknown';
    }
};


const ContextStrip = ( {
    studyCase,
    relatedUsers,
    form,
    editingField,
    setEditingField,
    saveField,
    cancelFieldEdit,
}: Props ) => {
    const assignedUserName =
        (relatedUsers ?? []).find((user) => user.id === form.data.assigned_user_id)
            ?.name ??
        studyCase.assignedUser?.name ??
        'No user';

    return (
        <div className="border-surface-variant font-label text-on-surface-variant flex flex-wrap items-center gap-x-6 gap-y-2 border-b bg-surface-container-low px-6 py-2 text-xs">
            <div className="flex items-center gap-1.5">
                <MonitorSmartphone className="size-4 text-primary" />
                <span className="opacity-70">System Name:</span>
                {editingField === 'system_name' ? (
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            value={form.data.system_name}
                            onChange={(e) =>
                                form.setData('system_name', e.target.value)
                            }
                            className="h-8 w-40"
                            autoFocus
                        />

                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            disabled={form.processing}
                            onClick={() => saveField('system_name')}
                        >
                            <Check className="size-4" />
                        </Button>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            disabled={form.processing}
                            onClick={() => cancelFieldEdit('system_name')}
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="group underline-secondary flex items-center gap-1 font-medium hover:underline"
                        onClick={() => setEditingField('system_name')}
                    >
                        {form.data.system_name ||
                            studyCase.system_name ||
                            'N/A'}
                        <Pencil className="size-3 text-secondary opacity-0 group-hover:opacity-100" />
                    </button>
                )}
                {form.errors.system_name && (
                    <span className="text-[11px] text-destructive">
                        {form.errors.system_name}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-1.5">
                <span className="opacity-70">System Type: </span>
                {editingField === 'system_type' ? (
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            value={form.data.system_type}
                            onChange={(e) =>
                                form.setData('system_type', e.target.value)
                            }
                            className="h-8 w-40"
                            autoFocus
                        />

                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            disabled={form.processing}
                            onClick={() => saveField('system_type')}
                        >
                            <Check className="size-4" />
                        </Button>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            disabled={form.processing}
                            onClick={() => cancelFieldEdit('system_type')}
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="group underline-secondary flex items-center gap-1 font-medium hover:underline"
                        onClick={() => setEditingField('system_type')}
                    >
                        {form.data.system_type ||
                            studyCase.system_type ||
                            'N/A'}
                        <Pencil className="size-3 text-secondary opacity-0 group-hover:opacity-100" />
                    </button>
                )}
                {form.errors.system_type && (
                    <span className="text-[11px] text-destructive">
                        {form.errors.system_type}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-1.5">
                <span className="opacity-70">Main device: </span>
                {editingField === 'main_device' ? (
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            value={form.data.main_device}
                            onChange={(e) =>
                                form.setData('main_device', e.target.value)
                            }
                            className="h-8 w-40"
                            autoFocus
                        />

                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            disabled={form.processing}
                            onClick={() => saveField('main_device')}
                        >
                            <Check className="size-4" />
                        </Button>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            disabled={form.processing}
                            onClick={() => cancelFieldEdit('main_device')}
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="group underline-secondary flex items-center gap-1 font-medium hover:underline"
                        onClick={() => setEditingField('main_device')}
                    >
                        {form.data.main_device ||
                            studyCase.main_device ||
                            'N/A'}
                        <Pencil className="size-3 text-secondary opacity-0 group-hover:opacity-100" />
                    </button>
                )}
                {form.errors.main_device && (
                    <span className="text-[11px] text-destructive">
                        {form.errors.main_device}
                    </span>
                )}
            </div>
            <div className="h-5 w-1 border-2 border-secondary bg-secondary shadow-2xl shadow-primary"></div>
            <div className="flex items-center gap-1.5">
                <MonitorSmartphone className="size-4 text-primary" />
                <span className="opacity-70">Sector: </span>
                {editingField === 'sector' ? (
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            value={form.data.sector}
                            onChange={(e) =>
                                form.setData('sector', e.target.value)
                            }
                            className="h-8 w-40"
                            autoFocus
                        />

                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            disabled={form.processing}
                            onClick={() => saveField('sector')}
                        >
                            <Check className="size-4" />
                        </Button>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            disabled={form.processing}
                            onClick={() => cancelFieldEdit('sector')}
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="group underline-secondary flex items-center gap-1 font-medium hover:underline"
                        onClick={() => setEditingField('sector')}
                    >
                        {form.data.sector || studyCase.sector || 'N/A'}
                        <Pencil className="size-3 text-secondary opacity-0 group-hover:opacity-100" />
                    </button>
                )}
                {form.errors.sector && (
                    <span className="text-[11px] text-destructive">
                        {form.errors.sector}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-1.5">
                <Bug className="size-4 text-primary" />
                <span className="opacity-70">Risk level:</span>
                {editingField === 'risk_level' ? (
                    <div className="flex items-center gap-2">
                        <Select
                            value={form.data.risk_level}
                            onValueChange={(value) =>
                                form.setData('risk_level', value)
                            }
                        >
                            <SelectTrigger className="h-8 w-40">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            disabled={form.processing}
                            onClick={() => saveField('risk_level')}
                        >
                            <Check className="size-4" />
                        </Button>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            disabled={form.processing}
                            onClick={() => cancelFieldEdit('risk_level')}
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="group underline-secondary flex items-center gap-1 font-medium hover:underline hover:underline-offset-4"
                        onClick={() => setEditingField('risk_level')}
                    >
                        <RiskColor
                            risk_level={
                                form.data.risk_level ??
                                studyCase.risk_level ??
                                null
                            }
                        />
                        <Pencil className="size-3 text-secondary opacity-0 group-hover:opacity-100" />
                    </button>
                )}
                {form.errors.risk_level && (
                    <span className="text-[11px] text-destructive">
                        {form.errors.risk_level}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-1.5">
                <Clock4 className="size-4 text-primary" />
                <span className="opacity-70">Status:</span>

                {editingField === 'status' ? (
                    <div className="flex items-center gap-2">
                        <Select
                            value={form.data.status}
                            onValueChange={(value) =>
                                form.setData('status', value)
                            }
                        >
                            <SelectTrigger className="h-8 w-40">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="in_progress">
                                    In Progress
                                </SelectItem>
                                <SelectItem value="completed">
                                    Completed
                                </SelectItem>
                                <SelectItem value="archived">
                                    Archived
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            disabled={form.processing}
                            onClick={() => saveField('status')}
                        >
                            <Check className="size-4" />
                        </Button>

                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            disabled={form.processing}
                            onClick={() => cancelFieldEdit('status')}
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="group underline-secondary flex items-center gap-1 font-medium hover:underline"
                        onClick={() => setEditingField('status')}
                    >
                        {statusLabel(studyCase.status)}
                        <Pencil className="size-3 text-secondary opacity-0 group-hover:opacity-100" />
                    </button>
                )}

                {form.errors.status && (
                    <span className="text-[11px] text-destructive">
                        {form.errors.status}
                    </span>
                )}
            </div>
            <div className="ml-auto flex flex-row items-center gap-3">
                <div className="flex flex-row items-center gap-3">
                    <div className="ml-auto flex items-center gap-1.5">
                        <UserCheck className="size-4 text-primary" />
                        <span className="text-on-surface font-medium">
                            Assigned to
                        </span>
                        <span className="mx-1 opacity-40">|</span>
                        {editingField === 'assigned_user_id' ? (
                            <div className="flex items-center gap-2">
                                <Select
                                    value={
                                        form.data.assigned_user_id
                                            ? String(form.data.assigned_user_id)
                                            : 'none'
                                    }
                                    onValueChange={(value) =>
                                        form.setData(
                                            'assigned_user_id',
                                            value === 'none'
                                                ? null
                                                : Number(value),
                                        )
                                    }
                                >
                                    <SelectTrigger className="h-8 w-45">
                                        <SelectValue placeholder="No user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            No user
                                        </SelectItem>
                                        {relatedUsers.map((user) => (
                                            <SelectItem
                                                key={user.id}
                                                value={String(user.id)}
                                            >
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="size-7"
                                    disabled={form.processing}
                                    onClick={() =>
                                        saveField('assigned_user_id')
                                    }
                                >
                                    <Check className="size-4" />
                                </Button>

                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="size-7"
                                    disabled={form.processing}
                                    onClick={() =>
                                        cancelFieldEdit('assigned_user_id')
                                    }
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>
                        ) : (
                            <button
                                className="group underline-secondary flex items-center gap-1 font-medium hover:underline"
                                onClick={() =>
                                    setEditingField('assigned_user_id')
                                }
                            >
                                {assignedUserName}
                                <Pencil className="size-3 text-secondary opacity-0 group-hover:opacity-100" />
                            </button>
                        )}

                        {form.errors.assigned_user_id && (
                            <span className="text-[11px] text-destructive">
                                {form.errors.assigned_user_id}
                            </span>
                        )}
                    </div>
                    <div className="mx-3 h-5 w-1 border-2 border-secondary bg-secondary shadow-2xl shadow-primary"></div>
                    <div className="ml-auto flex items-center gap-1.5">
                        <UserRoundPen className="size-4 text-primary" />
                        <span className="text-on-surface font-medium">
                            {studyCase.last_user?.name ?? 'No user'}
                        </span>
                        <span className="mx-1 opacity-40">|</span>
                        <span className="opacity-70">
                            Last updated:{' '}
                            {studyCase.updated_at
                                ? new Date(
                                      studyCase.updated_at,
                                  ).toLocaleString()
                                : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ContextStrip;
