import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../components/navigation";
import { UserContext } from "../context/userContext";
import ShowStars from "../components/showStars";
import DestinationAdminOptions from "../components/destinationAdminOptions";
import DeleteDestinationQuestion from "../components/deleteDestinationQuestion";
import EditDestination from "../components/editDestination";
import Redirect from "./redirect";
import Loading from "./loading";
import Reviews from "./reviews";
import Footer from "../components/footer";
import { routes } from "../routes/routes";
import "../styles/destination.css";

export default function Destination() {
  const [destination, setDestination] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteQuestion, setDeleteQuestion] = useState(false);
  const [error, setError] = useState(``);

  //Editing states
  const [editedImg, setEditedImg] = useState(``);
  const [editedDescription, setEditedDescription] = useState(``);
  const [editedNature, setEditedNature] = useState(false);
  const [editedTowns, setEditedTowns] = useState(false);
  const [editedHistory, setEditedHistory] = useState(false);
  const [editedEntertainment, setEditedEntertainment] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/destination/${params.id}`
        );
        const responseJson = await response.json();
        const data = responseJson.data[0];
        setDestination(data);
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
      } catch (err) {
        if (err.message === `Can't find any destination`) {
          setError(err.message);
        } else {
          setError(`Can't load destination info, please try again later`);
        }
      }
    };
    fetchData();
  }, [params.id]);

  const handleGoBackClick = () => {
    navigate(-1);
  };

  const handleEditDestination = () => {
    editOpen ? setEditOpen(false) : setEditOpen(true);
  };

  const handleDeleteDestination = () => {
    setDeleteQuestion(deleteQuestion ? false : true);
  };

  const handleFinalDeleteDestination = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/destination/${params.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      const responseJson = await response.json();

      if (responseJson.status === `success`) {
        navigate(routes.home);
      } else if (responseJson.status === `fail`) {
        setError(`Can't delete this destination`);
      }
    } catch (err) {
      setError(`Can't delete this destination`);
      setDeleteQuestion(false);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  if (error) return <Redirect message={error} />;
  else {
    const valuesToShare = {
      setEditOpen,
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
      setDestination,
      setError,
    };

    return (
      <div>
        <Navigation />
        {destination ? (
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
                    <div
                      className="destinationInfoButtons"
                      onClick={handleGoBackClick}
                    >
                      Go Back
                    </div>
                    {user?.username === `admin` && (
                      <DestinationAdminOptions
                        handleEditDestination={handleEditDestination}
                        handleDeleteDestination={handleDeleteDestination}
                      />
                    )}
                  </div>
                </div>
                <div className="destinationReviewsNumber">
                  {destination.ratingQuantity
                    ? `${destination.ratingQuantity} ${
                        destination.ratingQuantity === 1 ? `review` : `reviews`
                      }`
                    : null}
                </div>
                {deleteQuestion && (
                  <DeleteDestinationQuestion
                    destination={destination}
                    handleFinalDeleteDestination={handleFinalDeleteDestination}
                    handleDeleteDestination={handleDeleteDestination}
                  />
                )}
              </div>
            </div>
            {error && <div className="destinationDeleteError">{error}</div>}
            {editOpen && user?.username === `admin` && (
              <EditDestination {...valuesToShare} />
            )}
            <div className="destinationDescription">
              {destination.description}
            </div>
            {destination.reviews?.length > 0 && (
              <div className="destinationReviewsTitle">Reviews:</div>
            )}
            <Reviews destination={destination} setDestination={setDestination}/>
          </>
        ) : (
          <Loading />
        )}
        <Footer />
      </div>
    );
  }
}
