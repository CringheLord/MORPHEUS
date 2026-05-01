import { AnimatePresence, motion } from 'framer-motion';
import {
    MoreHorizontal,
    RotateCcw,
    Trash2,
    Share,
    FolderOutput, ChevronsLeft,
} from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

type Props = {
    onShare: () => void;
    onExport: () => void;
    onResetLayer: (
        layer: 'interface' | 'cognitive' | 'organizational' | 'all',
    ) => void;
    onDelete: () => void;
};

const menuVariants = {
    closed: {
        scaleX: 0,
        transition: {
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
            when: 'afterChildren',
        },
    },
    open: {
        scaleX: 1,
        transition: {
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
            when: 'beforeChildren',
            staggerChildren: 0.04,
        },
    },
};

const menuItemVariants = {
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

const subMenuVariants = {
    closed: {
        scaleY: 0,
        transition: {
            duration: 0.18,
            ease: [0.22, 1, 0.36, 1],
            when: 'afterChildren',
        },
    },
    open: {
        scaleY: 1,
        transition: {
            duration: 0.18,
            ease: [0.22, 1, 0.36, 1],
            when: 'beforeChildren',
            staggerChildren: 0.03,
        },
    },
};

const subMenuItemVariants = {
    closed: {
        opacity: 0,
        y: -6,
        transition: {
            duration: 0.1,
            ease: 'easeOut',
        },
    },
    open: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.14,
            ease: 'easeOut',
        },
    },
};

export default function ActionsMenu({
    onShare,
    onExport,
    onResetLayer,
    onDelete,
}: Props) {
    const [open, setOpen] = React.useState(false);
    const [resetOpen, setResetOpen] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const resetButtonRef = React.useRef<HTMLButtonElement | null>(null);

    const [submenuPos, setSubmenuPos] = React.useState({
        top: 0,
        left: 0,
    });

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!rootRef.current) {
return;
}

            if (!rootRef.current.contains(event.target as Node)) {
                setOpen(false);
                setResetOpen(false);
                setDeleteOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const toggleResetMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        if (!resetButtonRef.current) {
return;
}

        const rect = resetButtonRef.current.getBoundingClientRect();

        setSubmenuPos({
            top: rect.bottom + 10,
            left: rect.left + rect.width / 2,
        });

        setResetOpen((prev) => !prev);
    };

    return (
        <div className="relative" ref={rootRef}>
            <Button
                type="button"
                variant="outline"
                className="text-md transition-colors duration-300"
                onClick={() => {
                    setOpen((prev) => !prev);

                    if (open) {
                        setResetOpen(false);
                    }
                }}
            >
                <MoreHorizontal className="size-6" />
                More
            </Button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        style={{ transformOrigin: 'right center' }}
                        className="transition-color absolute top-1/2 right-[calc(100%+0.75rem)] z-[100] flex -translate-y-1/2 items-center gap-2 overflow-visible rounded-xl border border-secondary border-r-secondary/30 border-l-card bg-card-high/20 px-3 py-2 whitespace-nowrap shadow-2xl shadow-primary/20"
                    >
                        <motion.div variants={menuItemVariants}>
                            <div className="flex items-center text-secondary">
                                <ChevronsLeft className="size-8 opacity-30 transition-all duration-200 group-hover:scale-120" />
                                <ChevronsLeft className="size-9 opacity-60 transition-all duration-200 group-hover:scale-120" />
                                <ChevronsLeft className="size-10 transition-all duration-200 group-hover:scale-120" />
                            </div>
                        </motion.div>
                        <motion.div variants={menuItemVariants}>
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-sm"
                                onClick={() => {
                                    onShare();
                                    setOpen(false);
                                    setResetOpen(false);
                                }}
                            >
                                <Share className="size-4" />
                                Share
                            </Button>
                        </motion.div>

                        <motion.div variants={menuItemVariants}>
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-sm"
                                onClick={() => {
                                    onExport();
                                    setOpen(false);
                                    setResetOpen(false);
                                }}
                            >
                                <FolderOutput className="size-4" />
                                Export Report
                            </Button>
                        </motion.div>

                        <motion.div variants={menuItemVariants}>
                            <Button
                                ref={resetButtonRef}
                                type="button"
                                variant="ghost"
                                className="text-sm text-alert hover:bg-alert/10 hover:text-alert"
                                onClick={toggleResetMenu}
                            >
                                <RotateCcw className="size-4" />
                                Reset layer
                            </Button>
                        </motion.div>

                        <motion.div variants={menuItemVariants}>
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => {
                                    setDeleteOpen(true);
                                    setResetOpen(false);
                                }}
                            >
                                <Trash2 className="size-4" />
                                Delete Study Case
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {open && resetOpen && (
                    <motion.div
                        variants={subMenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        style={{
                            top: `${submenuPos.top}px`,
                            left: `${submenuPos.left}px`,
                            transformOrigin: 'top center',
                        }}
                        className="fixed z-[140] flex min-w-[230px] -translate-x-1/2 flex-col rounded-2xl border border-alert bg-card-high p-2 shadow-2xl"
                    >
                        <motion.div variants={subMenuItemVariants}>
                            <Button
                                type="button"
                                variant="ghost"
                                className="justify-start text-sm hover:bg-alert/10"
                                onClick={() => {
                                    onResetLayer('interface');
                                    setOpen(false);
                                    setResetOpen(false);
                                }}
                            >
                                Interface layer
                            </Button>
                        </motion.div>

                        <motion.div variants={subMenuItemVariants}>
                            <Button
                                type="button"
                                variant="ghost"
                                className="justify-start text-sm hover:bg-alert/10"
                                onClick={() => {
                                    onResetLayer('cognitive');
                                    setOpen(false);
                                    setResetOpen(false);
                                }}
                            >
                                Cognitive layer
                            </Button>
                        </motion.div>

                        <motion.div variants={subMenuItemVariants}>
                            <Button
                                type="button"
                                variant="ghost"
                                className="justify-start text-sm hover:bg-alert/10"
                                onClick={() => {
                                    onResetLayer('organizational');
                                    setOpen(false);
                                    setResetOpen(false);
                                }}
                            >
                                Organizational layer
                            </Button>
                        </motion.div>

                        <motion.div
                            variants={subMenuItemVariants}
                            className="my-1 h-px w-full bg-border"
                        />

                        <motion.div variants={subMenuItemVariants}>
                            <Button
                                type="button"
                                variant="ghost"
                                className="justify-start text-sm hover:bg-alert/10"
                                onClick={() => {
                                    onResetLayer('all');
                                    setOpen(false);
                                    setResetOpen(false);
                                }}
                            >
                                All layers
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
                            className="w-full max-w-md rounded-2xl border bg-card-high p-6 shadow-2xl"
                        >
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">
                                    Delete this Study Case?
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
                                        setOpen(false);
                                        setResetOpen(false);
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
