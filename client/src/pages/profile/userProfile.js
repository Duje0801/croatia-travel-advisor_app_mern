import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/home/navigation";
import ShowReviewStarComments from "../../components/stars/showReviewStarComments";
import DeleteDeactivateUserQuestion from "../../components/profile/deleteDeactivateUserQuestion";
import Redirect from "../redirectLoading/redirect";
import Pagination from "../../components/pagination/pagination";
import { routes } from "../../routes/routes";
import "../../styles/pages/userProfile.css";
import "../../styles/components/reviews.css";

export default function UserProfile() {
  const [userProfile, setUserProfile] = useState({});
  const [page, setPage] = useState(1);
  const [openDeleteQuestion, setDeleteQuestion] = useState(false);
  const [openActivateQuestion, setActivateQuestion] = useState(false);
  const [deleteId, setDeleteId] = useState(``);
  const [activateId, setActivateId] = useState(``);
  const [isUserActive, setIsUserActive] = useState(``);
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState(``);

  const params = useParams();
  const navigate = useNavigate();

  const { user, dispatch } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return;
      else {
        try {
          const response = await fetch(
            `http://localhost:4000/api/user/find/${params.id}`,
            {
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${user.token}`,
              },
            }
          );
          const responseJson = await response.json();
          if (responseJson.status === `success`) {
            setUserProfile(responseJson.user);
            setIsUserActive(
              responseJson.user.active ? `User is active` : `User is not active`
            );
          } else if (responseJson.status === `fail`) {
            setError(`${responseJson.error}`);
          }
        } catch (err) {
          setError(`Something went wrong please try again later`);
        }
      }
    };
    fetchData();
  }, [params.id, user, isUserActive]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDelete = (id) => {
    setDeleteQuestion(openDeleteQuestion ? false : true);
    setActivateQuestion(false);
    setDeleteId(id);
  };

  const handleActivate = (id) => {
    setActivateQuestion(openActivateQuestion ? false : true);
    setDeleteQuestion(false);
    setActivateId(id);
  };

  const handleFinalDeleteUser = async () => {
    try {
      let query;
      if (user.username === `admin`) {
        query = fetch(`http://localhost:4000/api/user/deleteUser`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ id: deleteId }),
        });
      } else if (user.username === userProfile.username) {
        query = fetch(`http://localhost:4000/api/user/deleteMe`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        });
      }
      const response = await query;
      const responseJson = await response.json();

      if (responseJson.status === `success`) {
        if (user.username === `admin`) {
          setIsDeleted(true);
        } else {
          setIsDeleted(true);
          localStorage.removeItem("user");
          dispatch({ type: "DELETE" });
        }
      } else if (responseJson.status === `fail`) {
        setError(`${responseJson.error}`);
      }
    } catch (err) {
      setError(`Something went wrong please try again later`);
    }
  };

  const handleFinalActivateUser = async () => {
    try {
      const url = userProfile.active ? `de` : ``;
      const response = await fetch(
        `http://localhost:4000/api/user/${url}activateUser`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ id: activateId }),
        }
      );
      const responseJson = await response.json();

      if (responseJson.status === `success`) {
        if (!userProfile.active) {
          setIsUserActive(`User is active`);
        } else {
          setIsUserActive(`User is not active`);
        }
        setActivateQuestion(false);
      } else if (responseJson.status === `fail`) {
        setError(`${responseJson.error}`);
      }
    } catch (err) {
      setError(`Something went wrong please try again later`);
    }
  };

  const handleChangeEmail = () => {
    navigate(routes.updateEmail);
  };

  const handleChangePassword = () => {
    navigate(routes.updatePassword);
  };

  const handleRedirectDestination = (name) => {
    navigate(`${routes.destination}/${name}`);
  };

  const date = (createdAt) => {
    const dateAndTime = createdAt.split("T");
    const date = dateAndTime[0].split("-");
    const time = dateAndTime[1].split(":");
    return `${time[0]}:${time[1]} ${date[2]}.${date[1]}.${date[0]}`;
  };

  if (error && !isDeleted) return <Redirect message={error} />;
  else if (isDeleted) {
    return (
      <Redirect
        message={`${
          user?.username === `admin` ? `User` : `Your profile`
        } is successfully deleted`}
      />
    );
  } else if (!user) {
    return <Redirect message={"Only users can see this page"} />;
  } else if (user?.username !== `admin` && userProfile?.active === false) {
    return <Redirect message={"User is not active anymore"} />;
  } else if (userProfile?.username) {
    const startSlice = page * 5 - 5;
    const endSlice = page * 5;
    const reviewsToShow = userProfile.reviews.slice(startSlice, endSlice);

    const reviewsMapped =
      userProfile?.reviews &&
      reviewsToShow.map((review, i) => {
        return (
          <div className="review" key={i}>
            <div
              className="reviewBox"
              onClick={() => handleRedirectDestination(review.destination.name)}
            >
              <div>
                <div className="reviewTitle">
                  {review.user.username} on {date(review.createdAt)}
                </div>
                <div>{ShowReviewStarComments(review.rating)}</div>
                <div>
                  <b>In {review.destination.name}</b>
                </div>
                <div className="reviewTitle">{review.title}</div>
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
            <div className="userProfileTitle">{userProfile.username}</div>
            <div className="userProfileButtonsDiv">
              {user?.username === `admin` &&
              userProfile.username !== `admin` ? (
                <button
                  className="userProfileButton"
                  onClick={() => handleActivate(userProfile.id)}
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
              </button>

              <button
                className="userProfileButton"
                onClick={() => handleGoBack()}
              >
                Go Back
              </button>
            </div>
          </div>
          <div className="userProfileError">{error}</div>
          {openDeleteQuestion ? (
            <DeleteDeactivateUserQuestion
              userProfile={userProfile}
              handleYesAnswer={handleFinalDeleteUser}
              handleNoAnswer={handleDelete}
              operation={`delete`}
            />
          ) : null}
          {openActivateQuestion ? (
            <DeleteDeactivateUserQuestion
              userProfile={userProfile}
              handleYesAnswer={handleFinalActivateUser}
              handleNoAnswer={handleActivate}
              operation={!userProfile?.active ? `activate` : `deactivate`}
            />
          ) : null}
          {user.username === `admin` ? (
            <div className="userActive">
              <div
                className={
                  userProfile.active ? `userIsActiveBox` : `userIsNotActiveBox`
                }
              ></div>
              <b>{isUserActive}</b>
            </div>
          ) : null}
          <div className="userProfileData">
            {user.username === userProfile.username ||
            user.username === `admin` ? (
              <div>
                <b>Email address:</b> {userProfile.email}
              </div>
            ) : null}
            <div>
              <b>Profile created at:</b> {date(userProfile.createdAt)}
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
