import { create } from "zustand";
import { persist } from "zustand/middleware";
import { alchemy } from "../services/alchemy";

const useExplorerStore = create(
  persist(
    (set) => ({
      address: "",
      balance: null,
      loading: false,
      error: null,
      hasFetched: false,

      setAddress: (address) => set({ address, hasFetched: false, error: null }),

      fetchBalance: async (addr) => {
        if (!addr || addr.length < 10) {
          return set({
            error: "Please enter a valid Ethereum address.",
            balance: null,
            hasFetched: true,
            loading: false,
          });
        }

        try {
          set({ loading: true, error: null });
          const balance = await alchemy.core.getBalance(addr, "latest");
          set({
            balance: balance.toString(),
            address: addr,
            hasFetched: true,
            loading: false,
          });
        } catch (err) {
          console.error(err);
          set({
            error: "Failed to fetch balance. Please check the address.",
            balance: null,
            hasFetched: true,
            loading: false,
          });
        }
      },
    }),
    {
      name: "account-storage",
      partialize: (state) => ({
        address: state.address,
        balance: state.balance,
        hasFetched: state.hasFetched,
      }),
    }
  )
);

export default useExplorerStore;
