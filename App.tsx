import React from "react";
import MainPage from "./pages/MainPage";

import { Provider } from "react-redux";
import { nftStore } from "./store";

export default function App() {
  return (
   
      <Provider store={nftStore}>
        <MainPage />
      </Provider>
    
  );
}
