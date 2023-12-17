import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import "../styles/place.css";

export default function ShowReviewStarComments(rating) {
  if (rating == 1)
    return (
      <div className="starRow">
        <AiFillStar />
        <AiOutlineStar />
        <AiOutlineStar />
        <AiOutlineStar />
        <AiOutlineStar />
      </div>
    );
  if (rating == 2)
    return (
      <div className="starRow">
        <AiFillStar />
        <AiFillStar />
        <AiOutlineStar />
        <AiOutlineStar />
        <AiOutlineStar />
      </div>
    );
  if (rating == 3)
    return (
      <div className="starRow">
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
        <AiOutlineStar />
        <AiOutlineStar />
      </div>
    );
  if (rating == 4)
    return (
      <div className="starRow">
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
        <AiOutlineStar />
      </div>
    );
  if (rating == 5)
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
