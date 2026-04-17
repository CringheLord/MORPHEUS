function HeuristicsStatsCard() {
    return (
        <div className="flex h-full flex-col justify-between p-6">
        <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Total heuristics
    </p>
    <h2 className="mt-2 text-3xl font-bold">128</h2>
        </div>

        <div className="mt-4">
    <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Active human factors
    </p>
    <p className="text-lg font-medium">6 categories</p>
    </div>
    </div>
);
}
export default HeuristicsStatsCard;
