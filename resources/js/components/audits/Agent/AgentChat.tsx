import axios from 'axios';
import {
    Bot,
    Loader2,
    Send,
    UserRound,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { route } from 'ziggy-js';

import { Button } from '@/components/ui/button';
import type { EvaluationPattern, Finding, Message, Task } from '@/types';

type Props = {
    task: Task;
    messages: Message[] | Record<string, Message> | null;
    className?: string;
    selectedFinding?: Finding;
    selectedEP?: EvaluationPattern;
};

const AgentChat = ({ task, messages, className, selectedEP, selectedFinding }: Props) => {
    const normalizedMessages = Array.isArray(messages)
        ? messages
        : Object.values(messages ?? {});

    const [prompt, setPrompt] = useState('');
    const [processing, setProcessing] = useState(false);
    const [chatMessages, setChatMessages] =
        useState<Message[]>(normalizedMessages);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }
    }, [isOpen]);

    async function sendMessage() {
        const trimmedPrompt = prompt.trim();

        if (!trimmedPrompt || processing) {
            return;
        }

        setProcessing(true);
        setErrorMessage('');
        setPrompt('');

        setChatMessages((currentMessages) => [
            ...currentMessages,
            {
                id: `temp-user-${Date.now()}`,
                role: 'user',
                content: trimmedPrompt,
            } as Message,
        ]);

        try {
            const response = await axios.post(
                route('tasks.morpheus-agent', { task: task.id }),
                {
                    prompt: trimmedPrompt,
                    selected_evaluation_pattern: selectedEP?.id,
                    selected_finding: selectedFinding?.id,
                },
            );

            setChatMessages((currentMessages) => [
                ...currentMessages,
                {
                    id: `temp-assistant-${Date.now()}`,
                    role: 'assistant',
                    content: response.data.response,
                } as Message,
            ]);
        } catch (error) {
            console.error(error);

            let message =
                'Something went wrong while contacting the AI service.';

            if (axios.isAxiosError(error)) {
                message =
                    error.response?.data?.message ?? error.message ?? message;
            }

            setErrorMessage(message);
        } finally {
            setProcessing(false);
        }
    }



    return (
        <section className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
            {/* HEADER */}
            <header className="flex items-center justify-between gap-3 border-b border-border bg-primary px-5 py-4 dark:bg-secondary/70">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 rounded-3xl border-b border-border bg-card-highest px-5 py-4">
                        <Bot className="size-5" />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-foreground">
                            MORPHEUS Copilot
                        </h2>
                        <p className="text-xs font-semibold text-muted-foreground">
                            Ask questions about this audit task
                        </p>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-background/20 text-foreground hover:bg-background/30"
                    onClick={() => setIsOpen((current) => !current)}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'Close chat' : 'Open chat'}
                >
                    <ChevronUp
                        className={`size-5 transition-transform duration-300 ${
                            isOpen ? 'rotate-0' : 'rotate-180'
                        }`}
                    />
                </Button>
            </header>

            {/* COLLAPSIBLE BODY */}
            <div
                className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
            >
                <div className="min-h-0 overflow-hidden">
                    <div
                        className={`flex h-[calc(70vh-88px)] min-h-[430px] flex-col transition-opacity duration-300 ${
                            isOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {/* MESSAGES */}
                        <div className="flex-1 overflow-y-auto px-4 py-6">
                            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                                {chatMessages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Bot className="size-6" />
                                        </div>

                                        <h3 className="text-lg font-semibold text-foreground">
                                            How can I help with this audit?
                                        </h3>

                                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                            Ask the copilot to explain findings,
                                            summarize risks, or reason about human
                                            factors in this study case.
                                        </p>
                                    </div>
                                )}

                                {chatMessages.map((message, index) => {
                                    const isUser = message.role === 'user';

                                    return (
                                        <div
                                            key={message.id ?? index}
                                            className={`flex gap-3 ${
                                                isUser
                                                    ? 'justify-end'
                                                    : 'justify-start'
                                            }`}
                                        >
                                            {!isUser && (
                                                <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-secondary">
                                                    <Bot className="size-6" />
                                                </div>
                                            )}

                                            <div
                                                className={`max-w-[80%] rounded-2xl px-3 py-3 text-sm leading-relaxed shadow-sm ${
                                                    isUser
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'border border-border bg-card-highest'
                                                }`}
                                            >
                                                <ReactMarkdown
                                                    components={{
                                                        p: ({ children }) => (
                                                            <p className="mb-3 last:mb-0">
                                                                {children}
                                                            </p>
                                                        ),
                                                        ul: ({ children }) => (
                                                            <ul className="my-3 list-disc space-y-1 pl-5">
                                                                {children}
                                                            </ul>
                                                        ),
                                                        ol: ({ children }) => (
                                                            <ol className="my-3 list-decimal space-y-1 pl-5">
                                                                {children}
                                                            </ol>
                                                        ),
                                                        li: ({ children }) => (
                                                            <li className="leading-relaxed">
                                                                {children}
                                                            </li>
                                                        ),
                                                        code: ({ children }) => (
                                                            <code className="rounded-md bg-muted px-1.5 py-0.5 text-xs">
                                                                {children}
                                                            </code>
                                                        ),
                                                    }}
                                                >
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>

                                            {isUser && (
                                                <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                                    <UserRound className="size-4" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {processing && (
                                    <div className="flex justify-start gap-3">
                                        <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Bot className="size-4" />
                                        </div>

                                        <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
                                            Thinking...
                                        </div>
                                    </div>
                                )}

                                {errorMessage && (
                                    <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                                        {errorMessage}
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* CHAT INPUT */}
                        <footer className="border-t border-border bg-background px-4 py-4">
                            <div className="mx-auto w-full max-w-3xl">
                                <div className="flex items-end gap-2 rounded-2xl border border-input bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring">
                                    {processing && (
                                        <Loader2 className="size-6 animate-spin self-center" />
                                    )}

                                    <textarea
                                        value={prompt}
                                        disabled={processing}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Message MORPHEUS Copilot..."
                                        rows={1}
                                        className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                sendMessage();
                                            }
                                        }}
                                    />

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="icon"
                                        className="mb-1 cursor-pointer rounded-xl"
                                        onClick={sendMessage}
                                        disabled={processing || !prompt.trim()}
                                    >
                                        <Send className="size-4" />
                                    </Button>
                                </div>

                                {/*<p className="mt-2 text-center text-xs text-muted-foreground">
                                    AI responses can support the audit, but findings
                                    should still be reviewed by the evaluator.
                                </p>*/}
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default AgentChat;
