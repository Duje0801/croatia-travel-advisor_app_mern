import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";
import "../../styles/components/place.css";

export default function ShowDestinationStars(avgRating: number): JSX.Element {
  if (avgRating === 0)
    return (
      <div className="starRow">
        <BsStarFill /> Not rated yet
      </div>
    );
  else if (avgRating >= 1 && avgRating < 1.5)
    return (
      <div className="starRow">
        <BsStarFill />
        <BsStar />
        <BsStar />
        <BsStar />
        <BsStar />
      </div>
    );
  else if (avgRating >= 1.5 && avgRating < 2)
    return (
      <div className="starRow">
        <BsStarFill />
        <BsStarHalf />
        <BsStar />
        <BsStar />
        <BsStar />
      </div>
    );
  else if (avgRating >= 2 && avgRating < 2.5)
    return (
      <div className="starRow">
        <BsStarFill />
        <BsStarFill />
        <BsStar />
        <BsStar />
        <BsStar />
      </div>
    );
  else if (avgRating >= 2.5 && avgRating < 3)
    return (
      <div className="starRow">
        <BsStarFill />
        <BsStarFill />
        <BsStarHalf />
        <BsStar />
        <BsStar />
      </div>
    );
  else if (avgRating >= 3 && avgRating < 3.5)
    return (
      <div className="starRow">
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStar />
        <BsStar />
      </div>
    );
  else if (avgRating >= 3.5 && avgRating < 4)
    return (
      <div className="starRow">
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStarHalf />
        <BsStar />
      </div>
    );
  else if (avgRating >= 4 && avgRating <= 4.5)
    return (
      <div className="starRow">
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStar />
      </div>
    );
  else
    return (
      <div className="starRow">
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
        <BsStarFill />
      </div>
    );
}
