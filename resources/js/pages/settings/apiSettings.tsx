import { useForm, usePage } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import React from 'react';
const openaiLi = '/Logo/AI_logos/openai_dark.png';
const openaiDK = '/Logo/AI_logos/openai_light.png';

import { Button } from '@/components/ui/button';

type ApiKey = {
    id: string;
    name: string;
    description: string;
    iconDK: string;
    iconLI: string;
}

type FormData = {
    id: string;
    key: string;
}

const apiKeysNames = [
    {
        id: 'open_ai_api_key',
        name: 'OpenAI',
        description: 'OpenAI API Key',
        iconDK: openaiDK,
        iconLI: openaiLi,
    },
]

const ApiSettings = () => {
    const form = useForm<FormData>({
        id: '',
        key: '',
    });
const user = usePage().props.auth.user;
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.put('/settings/ai-api', {
            onSuccess: () => form.reset(),
        });
    };

    return (
        <div className="space-y-10 pl-6">
            <h1 className="text-2xl font-bold">API Keys</h1>
            <div className="p-2">
                {apiKeysNames.map((apiKey) => {
                    return (
                        <div
                            key={apiKey.id}
                            className="flex items-center justify-between"
                        >
                            <div className="flex w-screen items-center gap-4 rounded-lg border border-border bg-card-high p-6">
                                <img
                                    src={apiKey.iconLI}
                                    alt={apiKey.name}
                                    className="flex size-10 dark:hidden"
                                />
                                <img
                                    src={apiKey.iconDK}
                                    alt={apiKey.name}
                                    className="hidden size-10 dark:flex"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {apiKey.name}
                                    </h2>
                                    <p className="text-sm text-muted-foreground text-nowrap">
                                        {apiKey.description}
                                    </p>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Insert API Key"
                                    onChange={(e) => {
                                        form.setData('key', e.target.value);
                                        form.setData('id', apiKey.id);
                                    }}
                                    className="w-full rounded-md border border-border p-2"
                                    name={apiKey.id}
                                />
                                {form.errors.key && (
                                    <p className="mt-1 text-sm text-destructive">
                                        {form.errors.key}
                                    </p>
                                )}
                                <Button
                                    variant="secondary"
                                    disabled={form.processing}
                                    onClick={submit}
                                    type="submit"
                                    size={'icon'}
                                    className="ml-2 h-10 w-19 rounded-full"
                                >
                                    <Check />
                                    <span className="sr-only">
                                        {form.processing ? 'Saving...' : ''}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    );
                })
                }
            </div>
        </div>
    );
};
export default ApiSettings;
