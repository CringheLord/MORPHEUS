import React from 'react';

const InterfaceLayer = () => {
    return (
        <div>
            <div className="flex w-full flex-grow flex-col gap-6 md:w-2/3 lg:w-3/4">
                <div className="mb-4 flex flex-col gap-2">
                    <h1 className="font-headline text-on-surface text-3xl font-bold">
                        Interface Layer Analysis
                    </h1>
                    <p className="text-on-surface-variant max-w-2xl text-sm">
                        Evaluate visual hierarchy, consistency, typography, and
                        interactive element affordances. Begin by providing data
                        sources for the audit.
                    </p>
                </div>

                <div className="bg-surface-container-lowest border-outline-variant flex min-h-[400px] flex-grow flex-col items-center justify-center rounded-xl border p-12 text-center shadow-sm">
                    <div className="mb-6 rounded-full bg-surface-container-low p-6">
                        <span
                            className="material-symbols-outlined text-6xl text-primary"
                            data-icon="design_services"
                        >
                            design_services
                        </span>
                    </div>
                    <h2 className="font-headline text-on-surface mb-2 text-2xl font-bold">
                        No UI Findings Yet
                    </h2>
                    <p className="text-on-surface-variant mb-8 max-w-md">
                        The Interface Layer canvas is empty. Start an audit to
                        identify visual design and interaction violations across
                        your product.
                    </p>
                    <div className="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
                        <button className="border-outline-variant hover:bg-surface-bright group flex h-full flex-col items-center rounded-lg border p-6 text-left transition-all hover:border-primary">
                            <span
                                className="material-symbols-outlined mb-4 text-3xl text-secondary transition-colors group-hover:text-primary"
                                data-icon="upload_file"
                            >
                                upload_file
                            </span>
                            <h3 className="font-headline text-on-surface mb-2 font-semibold">
                                Import Screenshots
                            </h3>
                            <p className="text-on-surface-variant text-center text-xs">
                                Upload key screen flows for static visual
                                analysis.
                            </p>
                        </button>

                        <button className="border-outline-variant hover:bg-surface-bright group flex h-full flex-col items-center rounded-lg border p-6 text-left transition-all hover:border-primary">
                            <span
                                className="material-symbols-outlined mb-4 text-3xl text-secondary transition-colors group-hover:text-primary"
                                data-icon="link"
                            >
                                link
                            </span>
                            <h3 className="font-headline text-on-surface mb-2 font-semibold">
                                Connect URL
                            </h3>
                            <p className="text-on-surface-variant text-center text-xs">
                                Provide a live URL for automated heuristic
                                scanning.
                            </p>
                        </button>

                        <button className="border-outline-variant hover:bg-surface-bright group flex h-full flex-col items-center rounded-lg border p-6 text-left transition-all hover:border-primary">
                            <span
                                className="material-symbols-outlined mb-4 text-3xl text-secondary transition-colors group-hover:text-primary"
                                data-icon="library_books"
                            >
                                library_books
                            </span>
                            <h3 className="font-headline text-on-surface mb-2 font-semibold">
                                Browse Library
                            </h3>
                            <p className="text-on-surface-variant text-center text-xs">
                                Explore common interface violations and
                                patterns.
                            </p>
                        </button>
                    </div>
                </div>
            </div>

            <aside className="flex w-full flex-col gap-6 md:w-1/3 lg:w-1/4">
                <div className="border-outline-variant sticky top-24 rounded-xl border bg-surface-container-low p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <span
                            className="material-symbols-outlined text-tertiary"
                            data-icon="fact_check"
                        >
                            fact_check
                        </span>
                        <h3 className="font-headline text-on-surface text-lg font-bold">
                            Interface Audit Checklist
                        </h3>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                            <div className="border-outline mt-0.5 h-5 w-5 flex-shrink-0 rounded border"></div>
                            <div>
                                <h4 className="text-on-surface text-sm font-semibold">
                                    Visual Hierarchy
                                </h4>
                                <p className="text-on-surface-variant mt-1 text-xs">
                                    Are primary actions clearly distinguished
                                    from secondary ones?
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="border-outline mt-0.5 h-5 w-5 flex-shrink-0 rounded border"></div>
                            <div>
                                <h4 className="text-on-surface text-sm font-semibold">
                                    Typography Scale
                                </h4>
                                <p className="text-on-surface-variant mt-1 text-xs">
                                    Is there a consistent and logical use of
                                    heading sizes?
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="border-outline mt-0.5 h-5 w-5 flex-shrink-0 rounded border"></div>
                            <div>
                                <h4 className="text-on-surface text-sm font-semibold">
                                    Color Contrast
                                </h4>
                                <p className="text-on-surface-variant mt-1 text-xs">
                                    Do text and interactive elements meet WCAG
                                    AA standards?
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="border-outline mt-0.5 h-5 w-5 flex-shrink-0 rounded border"></div>
                            <div>
                                <h4 className="text-on-surface text-sm font-semibold">
                                    Alignment &amp; Grid
                                </h4>
                                <p className="text-on-surface-variant mt-1 text-xs">
                                    Are elements consistently aligned to an
                                    underlying grid?
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="border-outline-variant mt-8 border-t pt-6">
                        <button className="bg-surface border-outline-variant flex w-full items-center justify-center gap-2 rounded border py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-surface-container">
                            <span
                                className="material-symbols-outlined text-sm"
                                data-icon="download"
                            >
                                download
                            </span>
                            Download Full Template
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
};
export default InterfaceLayer;
