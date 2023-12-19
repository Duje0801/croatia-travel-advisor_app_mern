import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/home/navigation";
import ShowReviewStarComments from "../../components/stars/showReviewStarComments";
import DeleteDeactivateUser from "../../components/profile/deleteDeactivateUser";
import Redirect from "../redirectLoading/redirect";
import Pagination from "../../components/pagination/pagination";
import DateString from "../../logic/dateString";
import { routes } from "../../routes/routes";
import axios from "axios";
import "../../styles/pages/userProfile.css";
import "../../styles/components/reviews.css";

export default function UserProfile() {
  const [userProfile, setUserProfile] = useState({});
  const [openDeleteQuestion, setDeleteQuestion] = useState(false);
  const [openActivateQuestion, setActivateQuestion] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(``);

  const params = useParams();
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return;
      else {
        axios
          .get(`http://localhost:4000/api/user/find/${params.id}`, {
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${user.token}`,
            },
          })
          .then((res) => {
            setUserProfile(res.data.data);
          })
          .catch((err) => {
            if (err?.response?.data?.error) {
              setError(`${err.response.data.error}`);
            } else {
              setError(`Can't find user, please try again later`);
            }
          });
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };
    fetchData();
  }, [params.id, user]);

  const handleDelete = () => {
    setDeleteQuestion(openDeleteQuestion ? false : true);
    setActivateQuestion(false);
  };

  const handleActivate = () => {
    setActivateQuestion(openActivateQuestion ? false : true);
    setDeleteQuestion(false);
  };

  const handleChangeEmail = () => {
    navigate(routes.updateEmail);
  };

  const handleChangePassword = () => {
    navigate(routes.updatePassword);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleRedirectDestination = (name) => {
    navigate(`${routes.destination}/${name}`);
  };

  if (!user) {
    return <Redirect message={"Only users can see this page"} />;
  } else if (user?.username !== `admin` && userProfile?.active === false) {
    return <Redirect message={"User is not active anymore"} />;
  } else if (error && !isDeleted) return <Redirect message={error} />;
  else if (isDeleted) {
    return (
      <Redirect
        message={`${
          user?.username === `admin` ? `User` : `Your profile`
        } is successfully deleted`}
      />
    );
  } else if (userProfile?.username) {
    const startSlice = page * 5 - 5;
    const endSlice = page * 5;
    const reviewsToShow = userProfile?.reviews.slice(startSlice, endSlice);

    const reviewsMapped =
      userProfile?.reviews &&
      reviewsToShow.map((review, i) => {
        return (
          <div className="userProfileReview" key={i}>
            <div>
              <b>In {review.destination.name}</b>
            </div>
            <div
              className="userProfileReviewBox"
              onClick={() => handleRedirectDestination(review.destination.name)}
            >
              <div>
                <div className="userProfileReviewTitle">
                  {review.user.username} on {DateString(review.createdAt)}
                </div>
                <div>{ShowReviewStarComments(review.rating)}</div>
                <div className="userProfileReviewTitle">{review.title}</div>
              </div>
            </div>
            <div>{review.text}</div>
          </div>
        );
      });

    return (
      <>
        <Navigation />
        <div className="userProfile">
          <div className="userProfileHeader">
            <div>
              <div className="userProfileTitle"> {userProfile.username}</div>
              {user.username === `admin` ? (
                <div className="userProfileActive">
                  <div
                    className={
                      userProfile.active
                        ? `userIsActiveBox`
                        : `userIsNotActiveBox`
                    }
                  ></div>
                  {userProfile.active ? `User is active` : `User is not active`}
                </div>
              ) : null}
            </div>
            <div className="userProfileButtonsDiv">
              {user.username === userProfile.username &&
              user.username !== `admin` ? (
                <>
                  <button
                    onClick={() => handleChangeEmail()}
                    className="userProfileButton"
                  >
                    Change Email
                  </button>
                  <button
                    onClick={() => handleChangePassword()}
                    className="userProfileButton"
                  >
                    Change Password
                  </button>{" "}
                </>
              ) : null}
              {user.username === `admin` && userProfile.username !== `admin` ? (
                <button
                  className="userProfileButton"
                  onClick={() => handleActivate()}
                >
                  {!userProfile?.active ? `Activate` : `Deactivate`}
                </button>
              ) : null}
              {(userProfile.username === user.username ||
                user.username === `admin`) &&
              userProfile.username !== `admin` ? (
                <button
                  className="userProfileButton"
                  onClick={() => handleDelete(userProfile.id)}
                >
                  Delete
                </button>
              ) : null}
              <button
                className="userProfileButton"
                onClick={() => handleBack()}
              >
                Back
              </button>
            </div>
          </div>
          <div className="userProfileError">{error}</div>
          {openDeleteQuestion ? (
            <DeleteDeactivateUser
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              handleNoAnswer={handleDelete}
              operation={`delete`}
              setIsDeleted={setIsDeleted}
              setActivateQuestion={setActivateQuestion}
              setError={setError}
            />
          ) : null}
          {openActivateQuestion ? (
            <DeleteDeactivateUser
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              handleNoAnswer={handleActivate}
              operation={!userProfile?.active ? `activate` : `deactivate`}
              setIsDeleted={setIsDeleted}
              setActivateQuestion={setActivateQuestion}
              setError={setError}
            />
          ) : null}
          <div className="userProfileData">
            <div className="userProfileUserInfoTitle">User info:</div>
            {user.username === userProfile.username ||
            user.username === `admin` ? (
              <div>
                <b>Email address:</b> {userProfile.email}
              </div>
            ) : null}
            <div>
              <b>Profile created at:</b> {DateString(userProfile.createdAt)}
            </div>
            <div>
              <b>Number of reviews:</b> {userProfile.reviews.length}
            </div>
          </div>
          {userProfile.reviews?.length > 0 && (
            <>
              <div className="userProfileReviewsTitle">Reviews:</div>
              <div>{reviewsMapped}</div>
              <Pagination
                totalLength={userProfile.reviews.length}
                itemsPerPage={5}
                page={page}
                setPage={setPage}
              />
            </>
          )}
        </div>
      </>
    );
  }
}
