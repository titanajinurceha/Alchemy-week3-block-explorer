import { Link, useNavigate } from "react-router-dom";

export default function TransactionCard({ tx }) {
  const navigate = useNavigate();
  const truncateAddress = (addr = "") => {
    if (!addr) return "—";
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`; // equal truncate left/right
  };

  const formatEth = (wei) => {
    const eth = Number(wei) / 1e18;
    return `${eth.toFixed(5)} ETH`;
  };

  const handleClick = (type, value) => {
    if (!value) return; // prevent navigation if not ready
    navigate(`/${type}/${value}`);
  };

  return (
    <div
      key={tx.hash}
      onClick={() => handleClick("tx", tx?.hash)}
      className="block group bg-[#fefefe] border cursor-pointer border-[#e5e5e5] p-4 m-4 rounded-lg transition-all"
    >
      {/* Top row */}
      <div className="flex justify-between items-center mb-2">
        <p
          className="font-mono text-base font-medium text-[#171717] truncate group-hover:text-green-600 transition-colors"
          title={tx.hash}
        >
          {tx.hash}
        </p>
        <p className="font-mono text-base font-medium text-[#171717]">
          {formatEth(tx.value)}
        </p>
      </div>

      {/* Bottom row */}
      <div className="flex justify-between text-[#171717] font-medium gap-4">
        <Link
          to={`/account/${tx?.from}`}
          onClick={(e) => e.stopPropagation()}
          className="hover:text-green-600 font-mono truncate"
        >
          <span className="font-sans text-sm text-[#666]">
          from{" "}
          </span>
            {truncateAddress(tx.from)}
        </Link>
       <Link
          to={`/account/${tx?.to}`}
          onClick={(e) => e.stopPropagation()}
          className="hover:text-green-600 font-mono text-right truncate"
        >
          <span className="font-sans text-sm text-[#666]">
          to{" "}
          </span>
            {truncateAddress(tx.to)}
        </Link>
      </div>
    </div>
  );
}
