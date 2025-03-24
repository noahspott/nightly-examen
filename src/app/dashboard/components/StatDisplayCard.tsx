type StatDisplayCardProps = {
  statName: string;
  statNum: number;
  isFetching: boolean;
};

export default function StatDisplayCard({
  statName,
  statNum,
  isFetching = false,
}: StatDisplayCardProps) {
  return (
    <div
      className={`flex font-semibold sm:justify-center text-left justify-start sm:text-center gap-4 dashboard--card ${isFetching && "animate-pulse"}`}
    >
      <div
        className={`flex flex-col transition-opacity duration-500 ${isFetching ? "opacity-0" : "opacity-100"}`}
      >
        <p className="text-2xl">{statNum}</p>
        <h4 className="text-base text-white/70">{statName}</h4>
      </div>
    </div>
  );
}
