import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedin: false,
  logIn: () => {},
  logOut: () => {},
});
