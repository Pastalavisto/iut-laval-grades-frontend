interface StatisticDisplayProps {
  numberStatistic: string;
  labelStatistic: string;
  descriptionStatistic: string;
}

export default function StatisticDisplay({
  numberStatistic,
  labelStatistic,
  descriptionStatistic
}: StatisticDisplayProps) {
  return (
    <div className="w-[200px] p-4 bg-white shadow-md rounded-lg">
      <div className="text-sm text-gray-500">{labelStatistic}</div>
      <div className="text-3xl font-bold text-center">{numberStatistic}</div>
      <div className="text-sm text-gray-500">{descriptionStatistic}</div>
    </div>
  );
}
