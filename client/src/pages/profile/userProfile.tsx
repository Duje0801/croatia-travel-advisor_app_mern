import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/navigation/navigation";
import ShowReviewStarComments from "../../components/stars/showReviewStars";
import DeleteDeactivateUser from "../../components/profile/deleteDeactivateUser";
import Redirect from "../redirectLoading/redirect";
import Loading from "../redirectLoading/loading";
import Pagination from "../../components/pagination/pagination";
import DateString from "../../logic/dateString";
import { IUser } from "../../interfaces/IUser";
import { IReview } from "../../interfaces/IReview";
import { routes } from "../../routes/routes";
import axios from "axios";
import "../../styles/pages/userProfile.css";
import "../../styles/components/reviews.css";

export default function UserProfile(): JSX.Element {
  const [userProfile, setUserProfile] = useState<IUser | null>(null);
  const [openDeleteQuestion, setDeleteQuestion] = useState<boolean>(false);
  const [openActivateQuestion, setActivateQuestion] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string>(``);

  const params = useParams();
  const navigate = useNavigate();

  const { state } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!state.user?.token) return;
      else {
        axios
          .get(
            `https://croatia-travel-advisor-app-mern.onrender.com/api/user/find/${params.id}`,
            {
              headers: {
                "content-type": "application/json",
                authorization: `Bearer ${state.user.token}`,
              },
            }
          )
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
  }, [params.id, state.user]);

  const handleDelete = (): void => {
    setDeleteQuestion(openDeleteQuestion ? false : true);
    setActivateQuestion(false);
  };

  const handleActivate = (): void => {
    setActivateQuestion(openActivateQuestion ? false : true);
    setDeleteQuestion(false);
  };

  const handleChangeEmail = (): void => {
    navigate(routes.updateEmail);
  };

  const handleChangePassword = (): void => {
    navigate(routes.updatePassword);
  };

  const handleBack = (): void => {
    navigate(-1);
  };

  const handleRedirectDestination = (name: string, reviewId: string): void => {
    navigate(`${routes.destination}/${name}/${reviewId}`);
  };

  if (!state.user) {
    return <Redirect message={"Only users can see this page"} />;
  } else if (
    state.user?.username !== `admin` &&
    userProfile?.active === false
  ) {
    return <Redirect message={"User is not active anymore"} />;
  } else if (error && !isDeleted) return <Redirect message={error} />;
  else if (!userProfile) return <Loading />;
  else if (isDeleted) {
    return (
      <Redirect
        message={`${
          state.user?.username === `admin` ? `User` : `Your profile`
        } is successfully deleted`}
      />
    );
  } else {
    const startSlice: number = page * 5 - 5;
    const endSlice: number = page * 5;
    const reviewsToShow: IReview[] = userProfile?.reviews.slice(
      startSlice,
      endSlice
    );

    const reviewsMapped: JSX.Element[] =
      userProfile?.reviews &&
      reviewsToShow.map((review: IReview, i) => {
        return (
          <div
            className="userProfileReview"
            onClick={() =>
              handleRedirectDestination(review.destination.name, review._id)
            }
            key={i}
          >
            <div>
              <b>In {review.destination.name}</b>
            </div>
            <div className="userProfileReviewBox">
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
              {state.user.username === `admin` ? (
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
              {state.user.username === userProfile.username &&
              state.user.username !== `admin` ? (
                <>
                  <button onClick={() => handleChangeEmail()}>
                    Change Email
                  </button>
                  <button onClick={() => handleChangePassword()}>
                    Change Password
                  </button>{" "}
                </>
              ) : null}
              {state.user.username === `admin` &&
              userProfile.username !== `admin` ? (
                <button
                  className="userProfileButton"
                  onClick={() => handleActivate()}
                >
                  {!userProfile?.active ? `Activate` : `Deactivate`}
                </button>
              ) : null}
              {(userProfile.username === state.user.username ||
                state.user.username === `admin`) &&
              userProfile.username !== `admin` ? (
                <button
                  className="userProfileButton"
                  onClick={() => handleDelete()}
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
          <div className="userProfileUserInfoTitle">User info:</div>
          <div className="userProfileData">
            {state.user.username === userProfile.username ||
            state.user.username === `admin` ? (
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
