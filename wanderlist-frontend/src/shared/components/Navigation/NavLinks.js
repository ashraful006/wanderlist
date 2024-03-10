import { NavLink } from "react-router-dom";
import React, { useContext } from "react";

import "./NavLinks.css";
import { AuthContext } from "../../context/auth-context";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  console.log(auth);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/">ALL USERS</NavLink>
      </li>
      {auth.isLoggedin && (
        <li>
          <NavLink to={`/${auth.userId}/places`} >MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedin && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}
      {!auth.isLoggedin && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedin && (
        <li>
          <button onClick={auth.logOut}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
