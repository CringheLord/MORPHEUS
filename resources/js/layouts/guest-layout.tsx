import React from 'react';

type Props = {
    children: React.ReactNode;
};

export default function GuestLayout ({children}: Props) {
    return (
        <div className="h-screen min-h-0 bg-background text-foreground">
            {children}
        </div>
    );
};
