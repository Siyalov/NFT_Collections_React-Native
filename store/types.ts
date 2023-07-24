import { NFTUserCollection } from "../api/serverData";

export interface NFTCollectionsState {
  collections: Array<NFTUserCollection>;
  isLoading: boolean;
  error: string | null;
}
