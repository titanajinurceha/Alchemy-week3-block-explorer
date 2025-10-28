import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BlockDetails from "./pages/BlockDetails";
import TransactionDetails from "./pages/TransactionDetails";
import Account from "./pages/Account";
import NFTExplorer from "./pages/NFTExplorer";
import PendingTracker from "./pages/PendingTracker";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/block/:blockNumber" element={<BlockDetails />} />
          <Route path="/tx/:txHash" element={<TransactionDetails />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/:address" element={<Account />} />
          <Route path="/nfts" element={<NFTExplorer />} />
          <Route path="/pending" element={<PendingTracker />} />
        </Routes>
      </main>
    </Router>
  );
}
