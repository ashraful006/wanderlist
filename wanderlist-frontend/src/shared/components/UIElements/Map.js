import "./Map.css";
import React from "react"
const Map = (props) => {
  return <div className={`map ${props.className}`} style={props.style}></div>;
};

export default Map;
