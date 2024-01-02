import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryDescription from "../../data/categoryDescription";
import Navigation from "../../components/home/navigation";
import Redirect from "../redirectLoading/redirect";
import Loading from "../redirectLoading/loading";
import ShowStars from "../../components/stars/showStars";
import Pagination from "../../components/pagination/pagination";
import Footer from "../../components/home/footer";
import { IDestination } from "../../interfaces/IDestination";
import { routes } from "../../routes/routes";
import axios from "axios";
import "../../styles/pages/category.css";

function Category(): JSX.Element {
  const [categoryDestinations, setCategoryDestinations] = useState<
    IDestination[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [destinationsNo, setDestinationsNo] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>(``);

  const navigate = useNavigate();
  const params = useParams();

  useEffect((): void => {
    //Every time page is changed, window is scrolling to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get(
          `https://croatia-travel-advisor-app-mern.onrender.com/api/destination/category/${params.id}?page=${page}`
        )
        .then((res) => {
          const data = res.data;
          setCategoryDestinations(data.data);
          setDestinationsNo(data.quantity);
          setIsLoading(false);
        })
        .catch((err) => {
          if (err?.response?.data?.error) {
            setError(`${err.response.data.error}`);
          } else {
            setError(`Something went wrong`);
          }
        });
    };
    fetchData();
  }, [params.id, page]);

  const handleGoBack = (): void => {
    navigate(-1);
  };

  const handleRedirectToDestination = (destinationName: string): void => {
    navigate(`${routes.destination}/${destinationName}`);
  };

  const categoryDestinationsMapped: JSX.Element[] = categoryDestinations.map(
    (destination: IDestination, i) => {
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
            onClick={() => handleRedirectToDestination(destination.name)}
          ></img>
          <div className="categoryDestinationRight">
            <div className="categoryDestinationTitleRight">
              {destination.name}
            </div>
            <div>
              {destination.averageRating === 0 ? (
                <div className="categoryDestinationNotRated">Not rated yet</div>
              ) : (
                ShowStars(destination.averageRating)
              )}{" "}
              <div className="categoryDestinationNoReviewRight">
                {destination.ratingQuantity > 1
                  ? `${destination.ratingQuantity} reviews`
                  : `${destination.ratingQuantity} review`}
              </div>
            </div>
            <div className="categoryDestinationDescriptionRight">
              {destination.description}
            </div>
            <button
              onClick={() => handleRedirectToDestination(destination.name)}
            >
              See more...
            </button>
          </div>
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
                {params.id!.charAt(0).toUpperCase() +
                  params
                    .id!.slice(1)
                    .split(/(?=[A-Z])/)
                    .join(` `)}
              </div>
              <button onClick={handleGoBack}>Go back</button>
            </div>
            <p className="categoryDescription">
              {CategoryDescription(params.id!)}
            </p>
            <div>
              <>{categoryDestinationsMapped}</>
            </div>
            <Pagination
              totalLength={destinationsNo}
              itemsPerPage={5}
              page={page}
              setPage={setPage}
            />
          </div>
        </div>
        <Footer />
      </div>
    );
}

export default Category;
