type StatDisplayCardProps = {
  statName: string;
  statNum: number;
  isLoading: boolean;
};

export default function StatDisplayCard({
  statName,
  statNum,
  isLoading = false,
}: StatDisplayCardProps) {
  return (
    <div
      className={`flex sm:justify-center text-left justify-start sm:text-center gap-4 dashboard--card ${isLoading && "animate-pulse"}`}
    >
      <div
        className={`flex flex-col transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
      >
        <p className="text-2xl">{statNum}</p>
        <h4 className="text-base text-white/70">{statName}</h4>
      </div>
    </div>
  );
}
