import React from "react";

import "./Input.css";

export const Input = (props) => {
  const element =
    props.element === "input" ? (
      <input id={props.id} placeholder={props.placeholder} name={props.name} />
    ) : (
      <textarea id={props.id} rows={props.rows || 3} />
    );
  return (
    <div className="form-control">
      <label htmlFor={props.id}>{props.label}</label>
      {element}
    </div>
  );
};
