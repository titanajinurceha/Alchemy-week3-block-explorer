import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Ethereum Block Explorer</h1>
      <div className="flex gap-4">
        <Link to="/" className="text-gray-300 hover:text-gray-300">Home</Link>
        <Link to="/account" className="text-gray-300 hover:text-gray-300">Account</Link>
        <Link to="/nfts" className="text-gray-300 hover:text-gray-300">NFTs</Link>
        <Link to="/pending" className="text-gray-300 hover:text-gray-300">Pending</Link>
      </div>
    </nav>
  );
}
