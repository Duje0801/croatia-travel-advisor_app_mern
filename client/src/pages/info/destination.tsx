import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Navigation from "../../components/navigation/navigation";
import { UserContext } from "../../context/userContext";
import { DestinationContext } from "../../context/destinationContext";
import ShowDestinationStars from "../../components/stars/showDestinationStars";
import DestinationButtons from "../../components/destination/destinationButtons";
import DeleteDestination from "../../components/destination/deleteDestination";
import EditDestination from "../../components/destination/editDestination";
import Redirect from "../redirectLoading/redirect";
import Loading from "../redirectLoading/loading";
import Reviews from "../../components/review/reviews";
import Footer from "../../components/home/footer";
import { IDestination } from "../../interfaces/IDestination";
import axios from "axios";
import "../../styles/pages/destination.css";

export default function Destination(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [editQuestion, setEditQuestion] = useState<boolean>(false);
  const [deleteQuestion, setDeleteQuestion] = useState<boolean>(false);
  const [error, setError] = useState<string>(``);

  //Editing states
  const [editedImg, setEditedImg] = useState<string>(``);
  const [editedDescription, setEditedDescription] = useState<string>(``);
  const [editedNature, setEditedNature] = useState<boolean>(false);
  const [editedTowns, setEditedTowns] = useState<boolean>(false);
  const [editedHistory, setEditedHistory] = useState<boolean>(false);
  const [editedEntertainment, setEditedEntertainment] =
    useState<boolean>(false);

  const params = useParams();

  const { state } = useContext(UserContext);
  const {
    destination,
    setDestination,
    setReviews,
    setReviewsNo,
    filterRating,
    setFilterRating,
    destinationError,
    setDestinationError,
    page,
  } = useContext(DestinationContext);

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get(
          `https://croatia-travel-advisor-app-mern.onrender.com/api/destination/${
            params.id
          }${params?.reviewId ? `/${params.reviewId}` : ``}/?page=${page}`
        )
        .then((res) => {
          const data: IDestination = res.data.data;
          setDestination(data);
          setReviews(data.reviews);
          setReviewsNo(data.ratingQuantity);
          setFilterRating(0);
          setIsLoading(false);
          setDestinationError(``);
          // In case of editing destination info, all data is already fetched and given to states
          // that can be changed (edited) later
          setEditedImg(data.image);
          setEditedDescription(data.description);
          setEditedNature(data.category.includes(`nature`) ? true : false);
          setEditedTowns(data.category.includes(`towns`) ? true : false);
          setEditedHistory(data.category.includes(`history`) ? true : false);
          setEditedEntertainment(
            data.category.includes(`entertainment`) ? true : false
          );
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
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
  }, [params.id]);

  useEffect((): void => {
    //This function changes reviews to display in destination when pages or filterRating changes
    const fetchData = () => {
      axios
        .get(
          `https://croatia-travel-advisor-app-mern.onrender.com/api/review/destinationReviews/${params.id}/?page=${page}&rating=${filterRating}`
        )
        .then((res) => {
          setReviews(res.data.data);
          setReviewsNo(res.data.quantity);
        })
        .catch((err) => {
          if (err?.response?.data?.error) {
            setDestinationError(`${err.response.data.error}`);
          } else {
            setDestinationError(`Something went wrong`);
          }
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });
    };
    //To avoid fetching when page opens for first time, first five reviews
    //will already be there in the state destination (destination.reviews)
    if (!destination || params.reviewId) return;
    //params.reviewId blocks if user wants to see only one coment (link from user profile),
    //because this fetch will return 5 reviews
    fetchData();
  }, [page, filterRating]);

  const handleDeleteDestination = (): void => {
    setDeleteQuestion(deleteQuestion ? false : true);
  };

  if (error) return <Redirect message={error} />;
  else if (isDeleted) {
    return (
      <Redirect
        message={`Destination ${destination?.name} is successfully deleted`}
      />
    );
  } else if (isLoading) {
    return <Loading />;
  } else if (destination) {
    const valuesToShare = {
      destinationId: destination.id,
      setDestination,
      setEditQuestion,
      editedImg,
      setEditedImg,
      editedDescription,
      setEditedDescription,
      editedNature,
      setEditedNature,
      editedTowns,
      setEditedTowns,
      editedHistory,
      setEditedHistory,
      editedEntertainment,
      setEditedEntertainment,
    };

    return (
      <div>
        <Navigation />
        <>
          <div className="destination">
            <div className="destinationHeader">
              <img src={destination.image} alt={destination.name}></img>
              <div className="destinationHeaderName">{destination.name} </div>
            </div>
            <div className="destinationRatings">
              <div className="destinationAvgRating">
                {destination.averageRating === 0
                  ? `Not rated yet`
                  : ShowDestinationStars(destination.averageRating)}
                <DestinationButtons
                  editQuestion={editQuestion}
                  setEditQuestion={setEditQuestion}
                  handleDeleteDestination={handleDeleteDestination}
                />
              </div>
              <div className="destinationReviewsNumber">
                {destination.ratingQuantity
                  ? `${destination.ratingQuantity} ${
                      destination.ratingQuantity === 1 ? `review` : `reviews`
                    }`
                  : null}
              </div>
            </div>
          </div>
          {destinationError && (
            <div className="destinationError">{destinationError}</div>
          )}
          {deleteQuestion && (
            <DeleteDestination
              destinationId={destination.id}
              destinationName={destination.name}
              handleDeleteDestination={handleDeleteDestination}
              setIsDeleted={setIsDeleted}
              setError={setError}
            />
          )}
          {editQuestion && state.user?.username === `admin` && (
            <EditDestination {...valuesToShare} />
          )}
          <div className="destinationDescription">
            {destination.description}
          </div>
          <Reviews />
        </>
        <Footer />
      </div>
    );
  } else {
    return <Redirect message={"Something went wrong"} />;
  }
}
