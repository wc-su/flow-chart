import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.scss";

import Home from "./pages/Home";
import Chart from "./pages/Chart";
import Header from "./components/Header";
import Loading from "./components/Loading";

import UserProvider from "./components/Context/UserProvider.js";
import LoadingProvider from "./components/Context/LoadingProvider.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <LoadingProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/" element={<Chart />} /> */}
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
          <Loading />
        </LoadingProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
