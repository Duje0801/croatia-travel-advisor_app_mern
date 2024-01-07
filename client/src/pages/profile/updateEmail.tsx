import { FormEvent, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/navigation/navigation";
import RedirectToHome from "../redirectLoading/redirectToHome";
import RedirectToPrevious from "../redirectLoading/redirectToPrevious";
import Loading from "../redirectLoading/loading";
import axios from "axios";

export default function UpdateEmail(): JSX.Element {
  const [oldEmail, setOldEmail] = useState<string>(``);
  const [newEmail, setNewEmail] = useState<string>(``);
  const [password, setPassword] = useState<string>(``);
  const [isEmailChanged, setIsEmailChanged] = useState<boolean>(false);
  const [notLogged, setNotLogged] = useState<boolean>(false);
  const [error, setError] = useState<string>(``);

  const navigate = useNavigate();

  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    //Checking is user logged in, while waiting loading page will be displayed,
    //if user is logged in it will show redirect page,
    //else it will show update email form
    if (state.user === null) setNotLogged(true);
  }, [state]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    axios
      .patch(
        `https://croatia-travel-advisor-app-mern.onrender.com/api/user/updateEmail`,
        {
          data: {
            oldEmail,
            newEmail,
            password,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${state.user?.token}`,
          },
        }
      )
      .then((res) => {
        setIsEmailChanged(true);
        const data = res.data.data;
        if (!state.user?.token) {
          setPassword(``);
          return setError(`Something went wrong, please try again later.`);
        } else {
          const updatedUserInfo = {
            email: data.email,
            username: data.username,
            token: state.user.token,
          };
          dispatch({ type: "SET", payload: updatedUserInfo });
          localStorage.setItem("user", JSON.stringify(updatedUserInfo));
        }
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          setError(`${err.response.data.error}`);
        } else {
          setError("Something went wrong, please try again later.");
        }
        setPassword(``);
      });
  };

  const handleGoBack = (): void => {
    navigate(-1);
  };

  if (isEmailChanged) {
    return <RedirectToPrevious message={"Email is successfully changed"} />;
  } else if (!state.user && !notLogged) {
    return <Loading />;
  } else if (!state.user && notLogged) {
    return (
      <RedirectToHome message={"You don't have permission to view this page"} />
    );
  } else {
    return (
      <>
        <Navigation />
        <div className="signUp">
          <div className="signUpTitle">Change Email:</div>
          <div className="signUpError">{error}</div>
          <form className="signUpForm" onSubmit={handleSubmit}>
            <label htmlFor="oldEmail">Old Email:</label>
            <input
              type="email"
              onChange={(e) => setOldEmail(e.target.value)}
              maxLength={30}
              value={oldEmail}
              id="oldEmail"
            ></input>
            <label htmlFor="newEmail">New Email:</label>
            <input
              type="text"
              onChange={(e) => setNewEmail(e.target.value)}
              maxLength={30}
              value={newEmail}
              id="newEmail"
            ></input>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              maxLength={15}
              value={password}
              id="password"
            ></input>
            <button type="submit">Submit</button>
          </form>
          <button onClick={handleGoBack}>Go Back</button>
        </div>
      </>
    );
  }
}
