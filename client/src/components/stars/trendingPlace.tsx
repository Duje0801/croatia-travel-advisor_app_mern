import { BsFillLightningChargeFill } from "react-icons/bs";

export default function TrendingPlace(place: number): JSX.Element {
  if (place === 1)
    return (
      <div className="place">
        <BsFillLightningChargeFill
          className="placeIcon"
          style={{ color: `gold` }}
        />
        1st in trending!
      </div>
    );
  else if (place === 2)
    return (
      <div className="place">
        <BsFillLightningChargeFill
          className="placeIcon"
          style={{ color: `silver` }}
        />
        2nd in trending!{" "}
      </div>
    );
  else if (place === 3)
    return (
      <div className="place">
        <BsFillLightningChargeFill
          className="placeIcon"
          style={{ color: `#CD7F32` }}
        />
        3rd in trending!{" "}
      </div>
    );
  else return <div></div>;
}
