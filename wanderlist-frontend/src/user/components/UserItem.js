import Avater from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import { Link } from "react-router-dom";

import "./UserItem.css";

const UserItem = (props) => {
  return (
    <li className="user-item">
      <div>
        <Card className="user-item__content">
          <Link to={`/${props.id}/places`}>
            <div className="user-item__image">
              <Avater image={props.image} alt={props.name} />
            </div>
            <div className="user-item__info">
              <h2>{props.name}</h2>
              <h3>
                {props.placeCount} {props.placeCount === 1 ? "place" : "places"}
              </h3>
            </div>
          </Link>
        </Card>
      </div>
    </li>
  );
};

export default UserItem;
