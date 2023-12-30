import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DestinationContext } from "../../../context/destinationContext";
import { routes } from "../../../routes/routes";

export default function WriteReviewNoUser(): JSX.Element {
  const navigate = useNavigate();

  const { reviewsNo } = useContext(DestinationContext);

  //If the destination already has been reviewed
  if (reviewsNo > 0) {
    return (
      <div className="reviewWriteSignIn">
        Please{" "}
        <span
          className="reviewWriteSignInSpan"
          onClick={() => navigate(routes.logIn)}
        >
          log in
        </span>{" "}
        to review this destination.
      </div>
    );
  }
  //If the destination has not yet been reviewed
  else {
    return (
      <div className="reviewWriteSignIn">
        {" "}
        <span
          className="reviewWriteSignInSpan"
          onClick={() => navigate(routes.logIn)}
        >
          Log in
        </span>{" "}
        and be the first to review this destination.
      </div>
    );
  }
}
