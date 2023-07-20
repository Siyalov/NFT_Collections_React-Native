import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createContext } from "react";
import { NFTCollectionsState } from "../types";
import * as api from "../../api";

export const getNFTCollection = createAsyncThunk(
  "nft/get",
  async (page: number) => {
    return await api.getPage(page);
  }
);

const initialState: NFTCollectionsState = {
  collections: [],
  isLoading: false,
  error: "",
};

export const NFTSlice = createSlice({
  name: "nft_collections",
  initialState,

  reducers: {
    printState: (state, action) => {
      console.log(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNFTCollection.fulfilled, (state, action) => {
      state.collections = action.payload;
      state.isLoading = false;
    }),
      builder.addCase(getNFTCollection.rejected, (state, action) => {
        state.isLoading = false;
        console.log("Ошибка");
      }),
      builder.addCase(getNFTCollection.pending, (state) => {
        state.isLoading = true;
      });
  },
});

export const { printState } = NFTSlice.actions;
export const NFTReducer = NFTSlice.reducer;
