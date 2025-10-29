import { create } from "zustand";
import { alchemy } from "../services/alchemy";

export const useNftStore = create((set) => ({
  address: "",
  nfts: [],
  loading: false,
  error: null,

  setAddress: (address) => set({ address }),

  fetchNFTs: async (address) => {
    if (!address) return set({ error: "Address required", nfts: [] });
    set({ loading: true, error: null });

    try {
      const data = await alchemy.nft.getNftsForOwner(address);
      set({ nfts: data.ownedNfts || [], address });
    } catch (err) {
      console.error(err);
      set({ error: "Failed to fetch NFTs" });
    } finally {
      set({ loading: false });
    }
  },
}));
