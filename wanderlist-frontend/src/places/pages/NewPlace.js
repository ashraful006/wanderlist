import React, {useContext} from "react";

import "./PlaceForm.css";
import { Input } from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      lat: {
        value: "",
        isValid: false,
      },
      lng: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const {isLoading, sendRequest, error, clearError} = useHttpClient();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    
    try {
      await sendRequest(
        'http://localhost:5000/api/places',
        'POST',
        JSON.stringify(
          {
            title: formState.inputs.title.value,
            description: formState.inputs.description.value,
            location: {
              lat: formState.inputs.lat.value,
              lng: formState.inputs.lng.value,
            },
            creator: auth.userId,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwhqZsr5q4Dz-ecvcVg_9WzU0VsmEw6l6pYYaq9RdWKw&s"
          }
        ),
        {
          "Content-Type": "application/json"
        }
      );
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error = {error} onClear = {clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          type="text"
          element="input"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid text"
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid Description (min length 5)"
          onInput={inputHandler}
        />
        <Input
          id="lat"
          element="input"
          label="Latitude"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid latitude"
          onInput={inputHandler}
        />
        <Input
          id="lng"
          element="input"
          label="Longitude"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid longitude"
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          Add place
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
