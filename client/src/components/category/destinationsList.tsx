import { useNavigate, useParams } from "react-router-dom";
import ShowDestinationStars from "../stars/showDestinationStars";
import TopRatedPlace from "../stars/topRatedPlace";
import TrendingPlace from "../stars/trendingPlace";
import { IDestination } from "../../interfaces/IDestination";
import { routes } from "../../routes/routes";

export default function DestinationsList(props: {
  categoryDestinations: IDestination[];
}): JSX.Element {
  const navigate = useNavigate();

  const params = useParams();

  const handleRedirectToDestination = (destinationName: string): void => {
    navigate(`${routes.destination}/${destinationName}`);
  };

  return (
    <div>
      {props.categoryDestinations.map((destination: IDestination, i) => {
        return (
          <div className="categoryDestination" key={i}>
            <div className="categoryDestinationTitle">
              <div className="categoryDestinationTitleName">
                {destination.name}
                {ShowDestinationStars(destination.averageRating)}
              </div>
            </div>
            <img
              src={destination.image}
              alt={destination.name}
              className="categoryImage"
              onClick={() => handleRedirectToDestination(destination.name)}
            ></img>
            <div className="categoryPlace">
              {params.id === `topRated` ? TopRatedPlace(i + 1) : null}{" "}
              {params.id === `trending` ? TrendingPlace(i + 1) : null}
            </div>
            <div className="categoryDestinationRight">
              <div className="categoryDestinationTitleRight">
                {destination.name}
              </div>
              <div>
                {destination.averageRating === 0 ? (
                  <div className="categoryDestinationNotRated">
                    Not rated yet
                  </div>
                ) : (
                  ShowDestinationStars(destination.averageRating)
                )}{" "}
                <div className="categoryDestinationNoReviewRight">
                  {destination.ratingQuantity > 1
                    ? `${destination.ratingQuantity} reviews`
                    : `${destination.ratingQuantity} review`}
                </div>
              </div>
              <div className="categoryDestinationDescriptionRight">
                {destination.description}
              </div>
              <button
                onClick={() => handleRedirectToDestination(destination.name)}
              >
                See more...
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
