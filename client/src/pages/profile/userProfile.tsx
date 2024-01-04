import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/navigation/navigation";
import UserProfileHeader from "../../components/profile/userProfileHeader";
import UserProfileInfo from "../../components/profile/userProfileInfo";
import DeleteDeactivateUser from "../../components/profile/deleteDeactivateUser";
import UserProfileReviews from "../../components/profile/userProfileReviews";
import Redirect from "../redirectLoading/redirect";
import Loading from "../redirectLoading/loading";
import Pagination from "../../components/pagination/pagination";
import { IUser } from "../../interfaces/IUser";
import { IReview } from "../../interfaces/IReview";
import axios from "axios";
import "../../styles/pages/userProfile.css";
import "../../styles/components/reviews.css";

export default function UserProfile(): JSX.Element {
  const [userProfile, setUserProfile] = useState<IUser | null>(null);
  const [userReviews, setUserReviews] = useState<IReview[]>([]);
  const [reviewPage, setReviewPage] = useState<number>(1);
  const [prevReviewPage, setPrevReviewPage] = useState<number>(1);
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openDeleteQuestion, setDeleteQuestion] = useState<boolean>(false);
  const [openActivateQuestion, setActivateQuestion] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [error, setError] = useState<string>(``);

  const params = useParams();

  const { state } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!state.user?.token) return setIsLoading(false);
      else {
        axios
          .get(
            `https://croatia-travel-advisor-app-mern.onrender.com/api/user/find/${params.id}/?page=${reviewPage}`,
            {
              headers: {
                "content-type": "application/json",
                authorization: `Bearer ${state.user.token}`,
              },
            }
          )
          .then((res) => {
            if (prevReviewPage === reviewPage && userProfile === null)
              setUserProfile(res.data.data);
            setUserReviews(res.data.data.reviews);
            setReviewsCount(res.data.reviewsQuantity);
            setIsLoading(false);
            setPrevReviewPage(reviewPage);
          })
          .catch((err): any => {
            if (err?.response?.data?.error) {
              setError(`${err.response.data.error}`);
            } else {
              setError(`Can't find user, please try again later`);
            }
            setIsLoading(false);
          });
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };
    fetchData();
  }, [params.id, state.user, reviewPage]);

  const handleDelete = (): void => {
    setDeleteQuestion(openDeleteQuestion ? false : true);
    setActivateQuestion(false);
  };

  const handleActivate = (): void => {
    setActivateQuestion(openActivateQuestion ? false : true);
    setDeleteQuestion(false);
  };

  if (isLoading || (state.user && !userProfile && !error)) {
    return <Loading />;
  } else if (isDeleted) {
    return (
      <Redirect
        message={`${
          state.user?.username === `admin` ? `User` : `Your profile`
        } is successfully ${
          state.user?.username === `admin` ? `deleted` : `deactivated`
        }`}
      />
    );
  } else if (!isLoading && !state.user) {
    return <Redirect message={"Only users can see this page"} />;
  } else if (error) {
    return <Redirect message={error} />;
  } else if (
    state.user?.username !== `admin` &&
    userProfile?.active === false
  ) {
    return <Redirect message={"User is not active anymore"} />;
  } else if (state.user && userProfile) {
    return (
      <>
        <Navigation />
        <div className="userProfile">
          <UserProfileHeader
            userProfile={userProfile}
            handleActivate={handleActivate}
            handleDelete={handleDelete}
          />
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
          <UserProfileInfo
            userProfile={userProfile}
            reviewsCount={reviewsCount}
          />
          {reviewsCount > 0 && (
            <>
              <div className="userProfileReviewsTitle">Reviews:</div>
              <UserProfileReviews userReviews={userReviews} />
              <Pagination
                totalLength={reviewsCount}
                itemsPerPage={5}
                page={reviewPage}
                setPage={setReviewPage}
              />
            </>
          )}
        </div>
      </>
    );
  } else {
    return <Redirect message={"Something went wrong"} />;
  }
}
