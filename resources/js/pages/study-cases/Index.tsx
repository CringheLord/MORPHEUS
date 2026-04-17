import { Head, Link } from '@inertiajs/react';

type StudyCase = {
    id: number;
    name: string;
};

export default function Index({ studyCases }: { studyCases: StudyCase[] }) {
    return (
        <>
            <Head title="Study Cases" />
            <div>ciao</div>

        </>
    );
}
