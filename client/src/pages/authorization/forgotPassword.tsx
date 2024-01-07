import { FormEvent, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/navigation/navigation";
import Redirect from "../redirectLoading/redirect";
import Loading from "../redirectLoading/loading";
import { routes } from "../../routes/routes";
import axios from "axios";

export default function ForgotPassword(): JSX.Element {
  const [email, setEmail] = useState<string>(``);
  const [isSended, setIsSended] = useState<boolean>(false);
  const [notLogged, setNotLogged] = useState<boolean>(false);
  //On this page error state displays errors and messages to users
  const [error, setError] = useState<string>(``);

  const { state } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    //Checking is user logged in, while waiting loading page will be displayed,
    //if user is logged in it will show redirect page,
    //else it will show restart password form
    if (state.user === null) setNotLogged(true);
  }, [state]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    setError(`Sending email (delivery can take up to 1 minute)...`);

    axios
      .post(
        `https://croatia-travel-advisor-app-mern.onrender.com/api/user/forgotPassword`,
        { data: { email } },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setEmail(``);
        setIsSended(true);
        setError(`Token has been sent to your email (please check spam mail)`);
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          setError(`${err.response.data.error}`);
        } else setError("Something went wrong, please try again later.");
      });
  };

  const handleGoToRedirectPassword = (): void => {
    navigate(routes.resetPassword);
  };

  const handleGoBack = (): void => {
    navigate(-1);
  };

  if (!state.user && !notLogged) {
    return <Loading />;
  } else if (state.user && notLogged) {
    return <Redirect message={"You are already logged in"} />;
  } else {
    return (
      <>
        <Navigation />
        <div className="signUp">
          <div className="signUpTitle">Forgot password:</div>
          <div className="signUpError">{error}</div>
          {isSended ? (
            <div className="forgotPasswordRedirect">
              Go to{" "}
              <span
                onClick={handleGoToRedirectPassword}
                className="forgotPasswordRedirectText"
              >
                restart password page
              </span>
              .
            </div>
          ) : (
            <form className="signUpForm" onSubmit={handleSubmit}>
              <label htmlFor="email">Please type your email</label>

              <div>
                After email confirmation, a password reset token will arrive in
                your mailbox
              </div>

              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                maxLength={30}
                value={email}
                id="email"
              ></input>
              <button type="submit">Submit</button>
            </form>
          )}
          <button onClick={handleGoBack}>Go Back</button>
        </div>
      </>
    );
  }
}
