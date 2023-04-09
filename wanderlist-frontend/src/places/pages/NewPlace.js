import React from "react";

import "./NewPlace.css";
import { Input } from "../../shared/components/FormElements/Input";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";

const NewPlace = () => {
  return (
    <form className="place-form">
      <Input
        element="input"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid text"
      />
    </form>
  );
};

export default NewPlace;
