import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import "../../styles/components/place.css";

export default function ShowReviewStars(rating: number): JSX.Element {
  if (rating === 1)
    return (
      <div className="starRow">
        <AiFillStar />
        <AiOutlineStar />
        <AiOutlineStar />
        <AiOutlineStar />
        <AiOutlineStar />
      </div>
    );
  else if (rating === 2)
    return (
      <div className="starRow">
        <AiFillStar />
        <AiFillStar />
        <AiOutlineStar />
        <AiOutlineStar />
        <AiOutlineStar />
      </div>
    );
  else if (rating === 3)
    return (
      <div className="starRow">
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
        <AiOutlineStar />
        <AiOutlineStar />
      </div>
    );
  else if (rating === 4)
    return (
      <div className="starRow">
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
        <AiOutlineStar />
      </div>
    );
  else if (rating === 5)
    return (
      <div className="starRow">
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
      </div>
    );
  else return <div></div>;
}
