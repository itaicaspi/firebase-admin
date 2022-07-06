import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import {Toaster} from "react-hot-toast";
import Popover from "./components/Popover";
import {GlobalDropdown} from "./components/Dropdown";
import Tooltip from "./components/Tooltip";

function App() {
  return (
    <div className="App">
      <Toaster/>
      <Popover/>
      <GlobalDropdown/>
      <Tooltip/>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <LoginPage />
            }
          />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Dashboard/>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
