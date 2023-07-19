import { createSlice } from "@reduxjs/toolkit";
import { createContext } from "react";


export const NFTSlice = createSlice({

  name: "nft_collections",
  initialState: {},
  reducers: {
    printState: (state, action ) => {
      console.log(state)
    }
  
  },
})

export const {printState} = NFTSlice.actions
export const NFTReducer = NFTSlice.reducer 