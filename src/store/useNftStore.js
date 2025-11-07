import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { alchemy } from "../services/alchemy";

export const useNftStore = create(
  persist(
    (set) => ({
      address: "",
      nfts: [],
      loading: false,
      error: null,
      hasFetched: false, // 🧭 UX: track whether user has fetched at least once

      setAddress: (address) => set({ address, hasFetched: false, error: null }),

      fetchNFTs: async (address) => {
        if (!address || address.length < 10)
          return set({ error: "Address required", nfts: [] });

        set({ loading: true, error: null, hasFetched: true });
        try {
          const data = await alchemy.nft.getNftsForOwner(address);
          set({
            nfts: data.ownedNfts || [],
            address,
          });
        } catch (err) {
          console.error("NFT fetch error:", err);
          set({
            error: "Failed to fetch NFTs. Please try again later.",
            nfts: [],
          });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "nft-explorer-storage", // storage key name
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({
        address: state.address,
        nfts: state.nfts,
      }), // only persist useful fields
    }
  )
);
