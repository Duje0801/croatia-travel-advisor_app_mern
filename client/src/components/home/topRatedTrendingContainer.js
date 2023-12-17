import { useNavigate } from "react-router-dom";
import bestThingsToVisitImg from "../../img/bestThingsToVisit.jpg";
import trendingImg from "../../img/trending.jpg";
import HomeContainersText from "../../data/homeContainersText";
import { routes } from "../../routes/routes";

export default function TopRatedTrendingContainer({ value }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${routes.category}/${value}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="homeContainer">
      <img
        src={value === `topRated` ? bestThingsToVisitImg : trendingImg}
        className="homeContainerImg"
        alt="Best Things Image"
      ></img>
      <HomeContainersText value={value} handleClick={handleClick} />
    </div>
  );
}
