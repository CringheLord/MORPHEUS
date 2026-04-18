import { Head, Link } from '@inertiajs/react';
import { heuristics } from '@/routes';

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
Index.layout = {
    breadcrumbs: [
        {
            title: 'Study Cases',
            href: '/StudyCases',
        },
    ],
};
