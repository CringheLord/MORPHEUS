
import { router, useForm } from '@inertiajs/react';
import {
    Layers,
    Network,
    ArrowLeftFromLine,
    FolderOpen,
    Pencil,
    Check,
    X,
    BrainCircuit,
} from 'lucide-react';

import React from 'react';

import ActionMenu from '@/components/studyCase/ActionMenu';
import ContextStrip from '@/components/studyCase/contextStrip';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import CognitiveLayer from '@/pages/study-cases/CognitiveLayer';
import InterfaceLayer from '@/pages/study-cases/InterfaceLayer';
import OrganizationalLayer from '@/pages/study-cases/OrganizationalLayer';

import studyCases from '@/routes/study-cases';



import type { StudyCase, User, Task } from '@/types';


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
};

type LayerKey = 'interface' | 'cognitive' | 'organizational';

type Props = {
    studyCase: StudyCase;
    relatedUsers: User[];
    tasks: Task[];
    currentLayerFromPivot?: LayerKey | null;
};



const Show = ({ studyCase, relatedUsers, currentLayerFromPivot, tasks }: Props) => {
    const [editingField, setEditingField] = React.useState<string | null>(null);
    const [currentLayer, setCurrentLayer] = React.useState < LayerKey > (
        currentLayerFromPivot ?? 'interface',
    );

    const handleLayerChange = (layer: LayerKey ) => {
        setCurrentLayer(layer);

        router.put(
            studyCases.currentLayerFromPivot(studyCase.id).url,
            { current_layer: layer },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const renderLayer = () => {
        switch (currentLayer) {
            case 'interface':
                return <InterfaceLayer studyCase={studyCase} tasks={tasks}/>
            case 'cognitive':
                return <CognitiveLayer studyCase={studyCase}/>
            case 'organizational':
                return <OrganizationalLayer studyCase={studyCase} />
        }
    }

    const form = useForm<ShowFormData>({
        title: studyCase.title ?? '',
        risk_level: studyCase.risk_level,
        status: studyCase.status ?? 'draft',
        assigned_user_id: studyCase.assigned_user_id ?? null,
        system_name: studyCase.system_name ?? '',
        system_type: studyCase.system_type ?? '',
        main_device: studyCase.main_device ?? '',
        sector: studyCase.sector ?? '',
        current_layer: studyCase.current_layer ?? null,
    });

    const saveField = (field: keyof ShowFormData) => {
        form.put(studyCases.update(studyCase.id).url, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setEditingField(null);
                form.clearErrors(field);
            },
            onError: () => {
                // for select-like fields, rollback to last persisted values
                if (field === 'status') {
                    form.setData('status', studyCase.status ?? 'draft');
                    setEditingField(null);
                }

                if (field === 'assigned_user_id') {
                    form.setData(
                        'assigned_user_id',
                        studyCase.assigned_user_id ?? null,
                    );
                    setEditingField(null);
                }

                if (field === 'risk_level') {
                    form.setData('risk_level', studyCase.risk_level ?? 'low');
                    setEditingField(null);
                }
            },
        });
    };

    const cancelFieldEdit = (field: keyof ShowFormData) => {
        switch (field) {
            case 'title':
                form.setData('title', studyCase.title ?? '');
                break;
            case 'status':
                form.setData('status', studyCase.status ?? 'draft');
                break;
            case 'assigned_user_id':
                form.setData(
                    'assigned_user_id',
                    studyCase.assigned_user_id ?? null,
                );
                break;
            case 'system_name':
                form.setData('system_name', studyCase.system_name ?? '');
                break;
            case 'system_type':
                form.setData('system_type', studyCase.system_type ?? '');
                break;
            case 'main_device':
                form.setData('main_device', studyCase.main_device ?? '');
                break;
            case 'sector':
                form.setData('sector', studyCase.sector ?? '');
                break;
            case 'risk_level':
                form.setData('risk_level', studyCase.risk_level ?? '');
                break;
            case 'current_layer':
                form.setData('current_layer', studyCase.current_layer ?? null);
                break;
        }

        form.clearErrors(field);
        setEditingField(null);
    };

    return (
        <div>
            <header className="bg-surface sticky top-0 z-50 shadow-sm">
                {/* Main Header Area */}
                <div className="border-surface-variant flex flex-col items-start justify-between gap-4 border-b px-6 py-4 md:flex-row md:items-center">
                    {/* Left Side: Breadcrumbs & Title */}
                    <div className="flex flex-col gap-3">
                        <nav aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-2 text-primary">
                                <li>
                                    <a
                                        className="group flex items-center gap-1 transition-colors hover:text-secondary"
                                        href="/study-cases"
                                    >
                                        <ArrowLeftFromLine className="size-6 text-primary transition-colors transition-transform group-hover:-translate-x-1 group-hover:text-secondary" />
                                        Back to Study Cases
                                    </a>
                                </li>
                            </ol>
                        </nav>
                        <div className="flex items-center gap-1.5">
                            <FolderOpen className="size-6 text-primary" />
                            <span className="text-md opacity-70">
                                Study Case:
                            </span>
                            {editingField === 'title' ? (
                                <div className="flex items-center gap-1.5">
                                    <Input
                                        type="text"
                                        value={form.data.title}
                                        onChange={(e) =>
                                            form.setData(
                                                'title',
                                                e.target.value,
                                            )
                                        }
                                        className="h-8 w-40"
                                        autoFocus
                                    />

                                    <Button
                                        type="button"
                                        size={'icon'}
                                        variant="ghost"
                                        className="size-7"
                                        onClick={() => saveField('title')}
                                    >
                                        <Check className="size-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        size={'icon'}
                                        variant="ghost"
                                        className="size-7"
                                        onClick={() => cancelFieldEdit('title')}
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className="group flex items-center gap-1 text-lg font-medium hover:underline"
                                    onClick={() => setEditingField('title')}
                                >
                                    {form.data.title ||
                                        studyCase.title ||
                                        'N/A'}
                                    <Pencil className="size-3 text-secondary opacity-0 group-hover:opacity-100" />
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Right Side: Actions */}
                    <div className="flex items-center gap-4">
                        <ActionMenu
                            onShare={() => console.log('Share')}
                            onExport={() => console.log('Export')}
                            onResetLayer={(layer) =>
                                console.log('Reset layer:', layer)
                            }
                            onDelete={() =>
                                console.log('Delete study case:', studyCase.id)
                            }
                        />
                    </div>
                </div>
                <ContextStrip
                    studyCase={studyCase}
                    relatedUsers={relatedUsers}
                    form={form}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    saveField={saveField}
                    cancelFieldEdit={cancelFieldEdit}
                />
                {/* Tab Navigation */}
                <div className="border-surface-variant bg-surface-container-lowest border-b px-6">
                    <nav
                        aria-label="Tabs"
                        className="-mb-px flex space-x-8 overflow-x-auto justify-center"
                    >
                        {/* Active Tab */}
                        <button
                            aria-current={
                                currentLayer === 'interface'
                                    ? 'page'
                                    : undefined
                            }
                            onClick={() => handleLayerChange('interface')}
                            className="font-label group relative flex items-center gap-2 px-1 py-4 text-sm font-medium whitespace-nowrap text-primary transition-colors hover:text-secondary"
                        >
                            <Layers className="size-7 text-primary transition-colors group-hover:text-secondary" />
                            Interface Layer
                            {currentLayer === 'interface' ? (
                                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-100 transform bg-primary transition-transform duration-300"></span>
                            ) : (
                                <></>
                            )}
                        </button>
                        {/* Inactive Tabs */}
                        <button
                            className="font-label group relative flex items-center gap-2 px-1 py-4 text-sm font-medium whitespace-nowrap text-primary transition-colors hover:text-secondary"
                            aria-current={
                                currentLayer === 'cognitive'
                                    ? 'page'
                                    : undefined
                            }
                            onClick={() => handleLayerChange('cognitive')}
                        >
                            <BrainCircuit className="size-7 text-primary transition-colors group-hover:text-secondary" />
                            Cognitive Layer Interface Layer
                            {currentLayer === 'cognitive' ? (
                                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-100 transform bg-primary transition-transform duration-300"></span>
                            ) : (
                                <></>
                            )}
                        </button>
                        <button
                            className="group font-label group relative flex items-center gap-2 px-1 py-4 text-sm font-medium whitespace-nowrap text-primary transition-colors hover:text-secondary"
                            aria-current={
                                currentLayer === 'organizational'
                                    ? 'page'
                                    : undefined
                            }
                            onClick={() => handleLayerChange('organizational')}
                        >
                            <Network className="size-7 text-primary transition-colors group-hover:text-secondary" />
                            Organizational Layer Interface Layer
                            {currentLayer === 'organizational' ? (
                                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-100 transform bg-primary transition-transform duration-300"></span>
                            ) : (
                                <></>
                            )}
                        </button>
                    </nav>
                </div>
            </header>
            <main className="flex-1">{renderLayer()}</main>
        </div>
    );
};
export default Show;
