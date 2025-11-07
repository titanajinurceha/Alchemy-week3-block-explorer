export default function DashboardCard({ title, value, unit }) {
  return (
    <div className="bg-[#fefefe] border border-[#e5e5e5] rounded-lg p-2 px-4 transition-all">
      <h3 className="text-sm font-normal text-[#666]">{title}</h3>
      <p className="text-md font-mono font-semibold overflow-hidden text-ellipsis text-[#171717]">
        {value}{" "}
        {unit && <span className="text-sm font-normal text-[#666]">{unit}</span>}
      </p>
    </div>
  );
}
