import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";

import "./index.scss";

import store from "./model/store";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
