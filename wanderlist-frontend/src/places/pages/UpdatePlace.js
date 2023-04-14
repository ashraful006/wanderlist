import React from "react";
import { useParams } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import { Input } from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];
const UpdatePlace = (props) => {
  const placeId = useParams().placeId;
  const identifiedPlace = DUMMY_PLACES.filter((p) => p.id === placeId);

  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>Could not found place!!</h2>
      </div>
    );
  }

  return (
    <form>
      <Input
        id="title"
        type="text"
        element="input"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid text"
        onInput={() => {}}
        value={identifiedPlace.title}
        validity={true}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid Description (min length 5)"
        onInput={() => {}}
        value={identifiedPlace.description}
        validity={true}
      />
      <Button type="submit" disabled={true}>
        Update Place
      </Button>
    </form>
  );
};

export default UpdatePlace;
