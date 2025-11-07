import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useExplorerStore from "../store/useExplorerStore";
import Loader from "../components/Loader";
import TransactionHistory from "../components/TransactionHistory";

export default function Account() {
  const { address: routeAddress } = useParams();
  const {
    address,
    setAddress,
    balance,
    loading,
    error,
    hasFetched,
    fetchBalance,
  } = useExplorerStore();

  // Convert wei → ETH and format numbers
  const formatEth = (wei) => {
    const eth = Number(wei) / 1e18;
    return eth.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };
  useEffect(() => {
    if (routeAddress && routeAddress !== address) {
      setAddress(routeAddress);
      fetchBalance(routeAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeAddress]);

  return (
    <div className="text-[#171717]">
      {/* ===== SEARCH CARD ===== */}
      <div className="border border-[#e5e5e5] bg-[#fafafa] rounded-lg p-4 mb-6">
        <p className="px-1 font-black text-lg text-[#171717]">
          Ethereum Address
        </p>
        <label
          htmlFor="eth-address"
          className="block px-1 text-sm font-medium text-[#666] mb-4"
        >
          Enter an Ethereum address to view balance and recent transactions.
        </label>
        <div className="flex flex-col sm:flex-row gap-3 mb-4 border-[#e5e5e5]">
          <input
            id="eth-address"
            type="text"
            placeholder="0x1234...abcd"
            value={address}
            onChange={(e) => setAddress(e.target.value.trim())}
            onKeyDown={(e) => e.key === "Enter" && fetchBalance(address)}
            className="border border-[#e5e5e5] bg-[#fefefe] font-mono px-3 py-2 rounded-lg w-full focus:outline-none focus:ring focus:ring-black/50 transition"
          />
          <button
            onClick={() => fetchBalance(address)}
            className="bg-black text-white font-semibold px-6 rounded-lg hover:bg-black/80 hover:shadow-sm hover:shadow-black/30 transition"
          >
            Check
          </button>
        </div>
        {hasFetched && error && (
          <p className="text-[#666] italic text-base text-center mt-4">
            {error}
          </p>
        )}
      </div>

      {/* ===== BALANCE CARD ===== */}
      {loading && <Loader />}
      {!loading && !error && balance && (
        <>
          <div className="border border-[#e5e5e5] bg-[#fefefe] rounded-lg mb-6">
            <div className="bg-[#fafafa] border-b border-[#e5e5e5] rounded-t-lg">
              <p className="px-4 py-2 font-black text-lg">Overview</p>
            </div>
            <div className="px-5 py-4 grid grid-cols-5 gap-x-4 gap-y-2 text-sm">
              <p className="text-[#666] text-base">Address</p>
              <p className="col-span-4 text-base font-medium truncate font-mono">
                : {address}
              </p>
              <p className="text-[#666] text-base">Balance</p>
              <p className="col-span-4 text-base font-medium truncate font-mono">
                : {formatEth(balance)} ETH{" "}
                <span className="text-[#666] text-sm">
                  ({Number(balance).toLocaleString()} wei)
                </span>
              </p>
            </div>
          </div>

          {/* ===== TRANSACTIONS ===== */}
          <TransactionHistory address={address} />
        </>
      )}
    </div>
  );
}
