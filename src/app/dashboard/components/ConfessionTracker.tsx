// Components
import StatDisplayCard from "./StatDisplayCard";

export default function ConfessionTracker({
  isFetching,
  daysSinceLastConfession,
}: {
  isFetching: boolean;
  daysSinceLastConfession: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <StatDisplayCard
        statName="Days"
        statNum={daysSinceLastConfession}
        isFetching={isFetching}
      />
      <button
        onClick={() => {}}
        className="p-4 bg-white/5 rounded-lg text-white font-semibold text-lg hover:text-white hover:bg-white/10"
      >
        Restart
      </button>
    </div>
  );
}
