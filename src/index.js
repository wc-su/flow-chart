import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";

import "./index.scss";

import Header from "./components/Header";
import Home from "./components/Home";
import Files from "./components/Files";
import Chart from "./components/Chart";

import UserProvider from "./context/UserProvider.js";
import LoadingProvider from "./context/LoadingProvider.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <UserProvider>
        <LoadingProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="Files" element={<Files />} />
            <Route path="/Chart" element={<Chart />}>
              <Route path=":chartId" element={<Chart />} />
            </Route>
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Routes>
        </LoadingProvider>
      </UserProvider>
    </HashRouter>
  </React.StrictMode>
);
