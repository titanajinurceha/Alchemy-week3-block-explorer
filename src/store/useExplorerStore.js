import { create } from "zustand";
import { alchemy } from "../services/alchemy";

const useExplorerStore = create((set) => ({
  blockNumber: null,
  blocks: [],
  isLoading: false,
  error: null,

  fetchLatestBlock: async () => {
    set({ isLoading: true, error: null });
    try {
      const blockNumber = await alchemy.core.getBlockNumber();
      // fetch block once
      const block = await alchemy.core.getBlockWithTransactions(blockNumber);
      set((state) => {
        // Only update if different to avoid unnecessary re-renders
        if (state.blockNumber === blockNumber) {
          return { isLoading: false }; // nothing changed
        }
        return {
          blockNumber,
          blocks: [block],
          isLoading: false,
          error: null,
        };
      });
    } catch (err) {
      console.error("fetchLatestBlock error:", err);
      set({ error: err?.message || String(err), isLoading: false });
    }
  },
}));

export default useExplorerStore;
