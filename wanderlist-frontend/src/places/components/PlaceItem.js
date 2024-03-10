import React, { Fragment, useState, useContext } from "react";

import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import "./PlaceItem.css";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const confirmDeleteModal = async () => {

    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        'DELETE'
      );

      props.onDelete(props.id);
    } catch (err) {
            
    }
  };

  const showDeleteWarningHandler = () => {
    setShowDeleteModal(true);
  };

  const cancelDeleteWarningHandler = () => {
    setShowDeleteModal(false);
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map style={{ background: "purple", padding: "90px" }} />
        </div>
      </Modal>
      <Modal
        show={showDeleteModal}
        onCancel={cancelDeleteWarningHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <Fragment>
            <Button inverse onClick={cancelDeleteWarningHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteModal}>
              DELETE
            </Button>
          </Fragment>
        }
      >
        <p>
          Are you sure you want to delete this one? it can't be undone
          thereafter.
        </p>
      </Modal>
      <li className="place-item">
        {isLoading && <LoadingSpinner asOverlay />}
        <Card>
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.isLoggedin && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.isLoggedin && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </Fragment>
  );
};

export default PlaceItem;
