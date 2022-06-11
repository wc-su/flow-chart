import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.scss";

import Home from "./components/Home";
import Chart from "./components/Chart";
import Header from "./components/Header";

import UserProvider from "./context/UserProvider.js";
import LoadingProvider from "./context/LoadingProvider.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <LoadingProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Chart" element={<Chart />} />
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
    </BrowserRouter>
  </React.StrictMode>
);
