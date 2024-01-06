import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryDescription from "../../data/categoryDescription";
import Navigation from "../../components/navigation/navigation";
import DestinationsList from "../../components/category/destinationsList";
import Redirect from "../redirectLoading/redirect";
import Loading from "../redirectLoading/loading";
import Pagination from "../../components/pagination/pagination";
import Footer from "../../components/home/footer";
import { IDestination } from "../../interfaces/IDestination";
import axios from "axios";
import "../../styles/pages/category.css";

export default function Category(): JSX.Element {
  const [categoryDestinations, setCategoryDestinations] = useState<
    IDestination[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [prevPage, setPrevPage] = useState<number>(1);
  const [prevParamsId, setPrevParamsId] = useState<string>(``);
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
          `https://croatia-travel-advisor-app-mern.onrender.com/api/destination/category/${
            params.id
          }?page=${page === prevPage ? 1 : page}`
        )
        .then((res) => {
          const data = res.data;
          setCategoryDestinations(data.data);
          setDestinationsNo(data.quantity);
          setIsLoading(false);
          setPrevParamsId(`${params.id}`);
          setPrevPage(page);
          setPage(params.id === prevParamsId ? page : 1);
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
              <DestinationsList categoryDestinations={categoryDestinations} />
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
