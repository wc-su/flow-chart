import React, { useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import Header from "./components/Header";
import Home from "./components/Home";
import Files from "./components/Files";
import Chart from "./components/Chart";

import { userActions } from "./model/userReducer";
import { auth, onAuthStateChanged } from "./firebase/auth";

import LoadingProvider from "./context/LoadingProvider";

const App = () => {
  const dispatch = useDispatch();

  const outerRef = useRef();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(userActions.login());
      } else {
        dispatch(userActions.logout());
      }
    });
  }, []);

  return (
    <div ref={outerRef}>
      <BrowserRouter>
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
      </BrowserRouter>
    </div>
  );
};

export default App;
