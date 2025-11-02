import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { alchemy } from "../services/alchemy";
import Loader from "../components/Loader";
import TransactionHistory from "../components/TransactionHistory";

export default function Account() {
  const { address: routeAddress } = useParams();
  const [address, setAddress] = useState(routeAddress || "");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false); // 👈 track user interaction

  async function fetchBalance(addr) {
    // don't trigger validation before user interaction
    setHasSubmitted(true);

    if (!addr || addr.length < 10) {
      setError("Please enter a valid Ethereum address.");
      setBalance(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const bal = await alchemy.core.getBalance(addr, "latest");
      setBalance(bal.toString());
    } catch (err) {
      console.error(err);
      setError("Failed to fetch balance. Please check the address.");
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (routeAddress) {
      fetchBalance(routeAddress);
      setHasSubmitted(true); // prevent initial error flash
    }
  }, [routeAddress]);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-3">Account</h2>

      <input
        type="text"
        placeholder="Enter Ethereum address"
        value={address}
        onChange={(e) => setAddress(e.target.value.trim())}
        className="border-2 border-gray-500 px-4 py-2 rounded w-full mb-5 focus:outline-none focus:ring-2 focus:ring-gray-200"
      />

      <button
        onClick={() => fetchBalance(address)}
        className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800 transition"
      >
        Check Balance
      </button>

      {loading && <Loader />}

      {/* only show error after submit */}
      {hasSubmitted && error && <p className="text-red-500 mt-2">{error}</p>}
      {!loading && !error && balance && (
        <>
          <div className="mt-3 p-3 border rounded border-gray-500">
            <p>
              <strong>Address:</strong> {address}
            </p>
            <p>
              <strong>Balance:</strong> {balance} wei
            </p>
          </div>

          <TransactionHistory address={address} />
        </>
      )}
    </div>
  );
}
