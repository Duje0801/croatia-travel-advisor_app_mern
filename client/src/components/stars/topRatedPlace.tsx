import { FaMedal } from "react-icons/fa";

export default function TopRatedPlace(place: number): JSX.Element {
  if (place == 1)
    return (
      <div className="place">
        <FaMedal className="placeIcon" style={{ color: `gold` }} />
        Best Choice!
      </div>
    );
  else if (place == 2)
    return (
      <div className="place">
        <FaMedal className="placeIcon" style={{ color: `silver` }} />
        2nd Best Choice!{" "}
      </div>
    );
  else if (place == 3)
    return (
      <div className="place">
        <FaMedal className="placeIcon" style={{ color: `#CD7F32` }} />
        3rd Best Choice!{" "}
      </div>
    );
  else return <div></div>;
}
