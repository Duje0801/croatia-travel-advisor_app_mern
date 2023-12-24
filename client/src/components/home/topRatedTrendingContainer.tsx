import { useNavigate } from "react-router-dom";
import bestThingsToVisitImg from "../../img/bestThingsToVisit.jpg";
import trendingImg from "../../img/trending.jpg";
import HomeContainersText from "../../data/homeContainersText";
import { routes } from "../../routes/routes";

export default function TopRatedTrendingContainer(props: {
  value: string;
}): JSX.Element {
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate(`${routes.category}/${props.value}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="homeContainer">
      <img
        src={props.value === `topRated` ? bestThingsToVisitImg : trendingImg}
        className="homeContainerImg"
        alt="Best Things Image"
      ></img>
      <HomeContainersText value={props.value} handleClick={handleClick} />
    </div>
  );
}
