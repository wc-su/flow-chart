import React, { useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import Files from "./components/Files";
import Chart from "./components/Chart";

import UserProvider from "./context/UserProvider";
import LoadingProvider from "./context/LoadingProvider";

const App = () => {
  const outerRef = useRef();

  return (
    <div ref={outerRef}>
      <BrowserRouter>
        <UserProvider>
          <LoadingProvider>
            <Header outerRef={outerRef} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="Files" element={<Files />} />
              <Route path="Chart" element={<Chart />}>
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
      </BrowserRouter>
    </div>
  );
};

export default App;
