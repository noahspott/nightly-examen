type StatDisplayCardProps = {
  statName: string;
  statNum: number;
  isLoading: boolean;
};

export default function StatDisplayCard({
  statName,
  statNum,
  isLoading,
}: StatDisplayCardProps) {
  return (
    <div className="flex gap-2 bg-gradient-to-br from-white/10 to-white/5 rounded-lg px-3 md:px-6 py-4">
      <div className="flex flex-col">
        <p className="text-xl">{statNum}</p>
        <h4 className="text-xs">{statName}</h4>
      </div>
    </div>
  );
}
