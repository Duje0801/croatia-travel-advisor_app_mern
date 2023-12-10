import bestThingsToVisitImg from "../img/bestThingsToVisit.jpg";
import trendingImg from "../img/trending.jpg";
import HomeContainersText from "../data/homeContainersText";

export default function TopRatedTrendingContainer({ value }) {
  return (
    <div className="homeContainer">
      <img
        src={value === `topRated` ? bestThingsToVisitImg : trendingImg}
        className="homeContainerImg"
        alt="Best Things Image"
      ></img>
      <HomeContainersText value={value} />
    </div>
  );
}
