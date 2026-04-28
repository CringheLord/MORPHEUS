import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

type FieldHelpProps = {
    text: string;
};

export function FieldHelp({ text }: FieldHelpProps) {
    const [open, setOpen] = useState(false);

    return (
        <span className="relative inline-flex">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                onBlur={() => setOpen(false)}
                className="inline-flex size-4 items-center justify-center rounded-full text-primary transition hover:scale-110 hover:text-secondary"
                aria-label="Show field help"
            >
                <HelpCircle className="size-4 fill-primary/15" />
            </button>

            {open && (
                <span className="absolute top-7 left-1/2 z-50 w-72 -translate-x-1/2 rounded-2xl bg-card-highest px-4 py-3 text-left text-[11px] leading-relaxed font-semibold text-white shadow-xl">
                    {text}
                </span>
            )}
        </span>
    );
}
