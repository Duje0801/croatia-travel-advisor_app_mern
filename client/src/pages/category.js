import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryDescription from "../data/categoryDescription";
import Redirect from "./redirect";
import Loading from "./loading";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import "../styles/category.css";

function Category() {
  const [categoryDestinations, setCategoryDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(``);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    //Every time page is changed, window is scrolling to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/destination/category/${params.id}`
        );
        const responseJson = await response.json();

        if (responseJson.status === `success`) {
          setCategoryDestinations(responseJson.data);
          setIsLoading(false);
        } else if (responseJson.status === `fail`) {
          setError(`Something went wrong. Please try again later`);
        }
      } catch {
        setError(`Something went wrong. Please try again later`);
      }
    };
    fetchData();
  }, [params.id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const categoryDestinationsMapped = categoryDestinations.map(
    (destination, i) => {
      return (
        <div className="categoryDestination" key={i}>
          <div className="categoryDestinationTitle">
            <div className="categoryDestinationTitleName">
              {destination.name}
            </div>
          </div>
          <img
            src={destination.image}
            alt={destination.name}
            className="categoryImage"
          ></img>
        </div>
      );
    }
  );

  if (error) {
    return <Redirect message={error} />;
  } else if (isLoading) {
    return <Loading />;
  } else
    return (
      <div>
        <Navigation />
        <div>
          <div className="category">
            <div className="categoryTitle">
              <div>
                {params.id.charAt(0).toUpperCase() +
                  params.id
                    .slice(1)
                    .split(/(?=[A-Z])/)
                    .join(` `)}
              </div>
              <button onClick={handleGoBack}>Go back</button>
            </div>
            <p className="categoryDescription">
              {CategoryDescription(params.id)}
            </p>
            <div>
              <>{categoryDestinationsMapped}</>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
}

export default Category;
