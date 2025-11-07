import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 backdrop-blur-lg bg-[#fafafa]/80 border-b-2 border-[#e5e5e5] text-[#171717] p-4 items-center">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold">Ethereum Block Explorer</h1>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-text-[#666]">
            Home
          </Link>
          <Link to="/account" className="hover:text-text-[#666]">
            Account
          </Link>
          <Link to="/nfts" className="hover:text-text-[#666]">
            NFTs
          </Link>
          <Link to="/pending" className="hover:text-text-[#666]">
            Pending
          </Link>
        </div>
      </div>
    </nav>
  );
}
