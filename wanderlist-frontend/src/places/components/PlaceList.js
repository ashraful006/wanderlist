import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";
import Button from "../../shared/components/FormElements/Button";
import React from "react";

const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((place) => {
        return (
          <PlaceItem
            key={place.id}
            id={place.id}
            image={place.image}
            description={place.description}
            creatorId={place.creator}
            coordinates={place.location}
            title={place.title}
            onDelete={props.onDeletePlaces}
          />
        );
      })}
    </ul>
  );
};

export default PlaceList;
