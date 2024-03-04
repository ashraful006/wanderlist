import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";

function App() {
  const [isLoggedin, setIsLogin] = useState(false);
  const [userId, setUserId] = useState(null);

  const logIn = useCallback((userId) => {
    setIsLogin(true);
    setUserId(userId);
  }, []);

  const logOut = useCallback(() => {
    setIsLogin(false);
    setUserId(null);
  }, []);

  let routes;

  if (isLoggedin) {
    routes = (
      <Routes>
        <Route path="/" exact element={<Users />} />
        <Route path="/:userId/place" exact element={<UserPlaces />} />
        <Route path="/places/new" exact element={<NewPlace />} />
        <Route path="/places/:placeId" exact element={<UpdatePlace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" exact element={<Users />} />
        <Route path="/:userId/place" exact element={<UserPlaces />} />
        <Route path="/auth" exact element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedin: isLoggedin, userId, logIn: logIn, logOut: logOut }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
