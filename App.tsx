import React from "react";
import MainPage from "./pages/MainPage";

import { Provider } from "react-redux";
import { store } from "./store/types";

export default function App() {
  return (
    <Provider store={store}>
      <MainPage />
    </Provider>
  );
}
