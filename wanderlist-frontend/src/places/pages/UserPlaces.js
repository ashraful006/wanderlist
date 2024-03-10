import React, {useEffect, useState} from "react"
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const userId = useParams().userId;
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setLoadedPlaces(response.places);
      } catch (err) {}
    }
    fetchData();
  }, [sendRequest, userId]);

  const placeDeleteHandler = placeId => {
    setLoadedPlaces(prevPlaces => prevPlaces.filter(places => places.id !== placeId));
  }
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <PlaceList items={loadedPlaces} onDeletePlaces={placeDeleteHandler} />
    </React.Fragment>
  );
};

export default UserPlaces;
