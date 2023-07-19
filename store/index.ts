import { configureStore } from '@reduxjs/toolkit'
import { NFTReducer } from './slices/NFTSlice'


export const nftStore = configureStore({
 
reducer: {
  nft: NFTReducer
}

})

export type RootState = ReturnType<typeof nftStore.getState>
export type AppDispatch = typeof nftStore.dispatch 