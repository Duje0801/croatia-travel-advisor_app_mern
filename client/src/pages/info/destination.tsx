import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../../components/home/navigation";
import { UserContext } from "../../context/userContext";
import ShowStars from "../../components/stars/showStars";
import DestinationAdminOptions from "../../components/destination/destinationAdminOptions";
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
  const [destination, setDestination] = useState<IDestination | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [editQuestion, setEditQuestion] = useState<boolean>(false);
  const [deleteQuestion, setDeleteQuestion] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>(``);
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
  const navigate = useNavigate();

  const { state } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get(`http://localhost:4000/api/destination/${params.id}`)
        .then((res) => {
          const data: IDestination = res.data.data;
          setDestination(data);
          setIsLoading(false);
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

  const handleEditDestination = (): void => {
    setEditQuestion(editQuestion ? false : true);
  };

  const handleDeleteDestination = (): void => {
    setDeleteQuestion(deleteQuestion ? false : true);
  };

  const handleBackClick = (): void => {
    navigate(-1);
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
                  : ShowStars(destination.averageRating)}
                <div className="destinationGoBackEditDivs">
                  {state.user?.username === `admin` && (
                    <DestinationAdminOptions
                      handleEditDestination={handleEditDestination}
                      handleDeleteDestination={handleDeleteDestination}
                    />
                  )}
                  <button
                    className="destinationInfoButtons"
                    onClick={handleBackClick}
                  >
                    Back
                  </button>
                </div>
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
          {deleteError && <div className="destinationError">{deleteError}</div>}
          {deleteQuestion && (
            <DeleteDestination
              destinationId={destination.id}
              destinationName={destination.name}
              handleDeleteDestination={handleDeleteDestination}
              setIsDeleted={setIsDeleted}
              setDeleteError={setDeleteError}
            />
          )}
          {editQuestion && state.user?.username === `admin` && (
            <EditDestination {...valuesToShare} />
          )}
          <div className="destinationDescription">
            {destination.description}
          </div>
          {destination.reviews?.length > 0 && (
            <div className="destinationReviewsTitle">Reviews:</div>
          )}
          <Reviews
            destination={destination}
            setDestination={setDestination}
            setError={setError}
          />
        </>
        <Footer />
      </div>
    );
  } else return <Redirect message={"Something went wrong"} />;
}
