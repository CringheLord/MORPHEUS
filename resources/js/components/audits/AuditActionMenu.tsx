// resources/js/components/audit/AuditActionMenu.tsx

import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronsLeft,
    FolderOutput,
    MoreHorizontal,
    Trash2,
    RotateCcw,
} from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

type Props = {
    onExport: () => void;
    onDelete: () => void;
};

const menuVariants = {
    closed: {
        scaleX: 0,
        opacity: 0,
        transition: {
            duration: 0.18,
            ease: [0.22, 1, 0.36, 1],
            when: 'afterChildren',
        },
    },
    open: {
        scaleX: 1,
        opacity: 1,
        transition: {
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
            when: 'beforeChildren',
            staggerChildren: 0.04,
        },
    },
};

const itemVariants = {
    closed: {
        opacity: 0,
        x: 10,
        transition: {
            duration: 0.1,
            ease: 'easeOut',
        },
    },
    open: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.14,
            ease: 'easeOut',
        },
    },
};

export default function AuditActionMenu({ onExport, onDelete }: Props) {
    const [open, setOpen] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);

    const rootRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!rootRef.current) {
                return;
            }

            if (!rootRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={rootRef}>
            <Button
                type="button"
                variant="outline"
                className="gap-2 bg-muted text-foreground transition-colors duration-300 hover:bg-accent"
                onClick={(event) => {
                    event.stopPropagation();
                    setOpen((prev) => !prev);
                }}
            >
                <MoreHorizontal className="size-5" />
                <span className="text-[11px] font-semibold tracking-wider uppercase">
                    Actions
                </span>
            </Button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        style={{ transformOrigin: 'right center' }}
                        className="absolute top-1/2 right-[calc(100%+0.75rem)] z-[100] flex -translate-y-1/2 items-center gap-2 overflow-visible rounded-xl border border-secondary border-r-secondary/30 border-l-card bg-card/95 px-3 py-2 whitespace-nowrap shadow-2xl shadow-primary/20 backdrop-blur-md"
                    >
                        <motion.div variants={itemVariants}>
                            <div className="flex items-center text-secondary">
                                <ChevronsLeft className="size-8 opacity-30" />
                                <ChevronsLeft className="size-9 opacity-60" />
                                <ChevronsLeft className="size-10" />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Button
                                type="button"
                                variant="ghost"
                                className="gap-2 text-sm"
                                onClick={() => {
                                    onExport();
                                    setOpen(false);
                                }}
                            >
                                <FolderOutput className="size-4" />
                                Export Report
                            </Button>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Button
                                type="button"
                                variant="ghost"
                                className="gap-2 text-sm text-alert hover:bg-alert/10 hover:text-alert"
                                onClick={() => {
                                    setDeleteOpen(true);
                                    setOpen(false);
                                }}
                            >
                                <RotateCcw className="size-4" />
                                Reset Audit
                            </Button>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Button
                                type="button"
                                variant="ghost"
                                className="gap-2 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => {
                                    setDeleteOpen(true);
                                    setOpen(false);
                                }}
                            >
                                <Trash2 className="size-4" />
                                Delete Audit
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {deleteOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="fixed inset-0 z-[170] flex items-center justify-center bg-background/70 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
                        >
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-foreground">
                                    Delete this audit?
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    This action cannot be undone.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDeleteOpen(false)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="button"
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => {
                                        onDelete();
                                        setDeleteOpen(false);
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
