import React from 'react';

type Props = {
    children: React.ReactNode;
};

export default function AuditLayout({ children }: Props) {
    return (
        <div className="h-screen min-h-0 overflow-hidden bg-background text-foreground">
            {children}
        </div>
    );
}
