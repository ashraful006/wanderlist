import React from "react";

import "./NewPlace.css";
import { Input } from "../../shared/components/FormElements/Input";

const NewPlace = () => {
  return (
    <form className="place-form">
      <Input element="input" label="Title" validators={[]} errorText="Please enter a valid text" />
    </form>
  );
};

export default NewPlace;
