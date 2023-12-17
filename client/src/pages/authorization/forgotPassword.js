import { useState } from "react";
import Navigation from "../../components/navigation";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes/routes";

export default function ForgotPassword() {
  const [email, setEmail] = useState(``);
  const [isSended, setIsSended] = useState(false);
  //On this page error state displays errors and messages to users
  const [error, setError] = useState(``);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError(`Sending mail...`);

      const response = await fetch(
        `http://localhost:4000/api/user/forgotPassword`,
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseJson = await response.json();

      if (responseJson.status === `success`) {
        setEmail(``);
        setIsSended(true);
        setError(`Token has been sent to your email`);
      } else if (responseJson.status === `fail`) {
        setEmail(``);
        setError(responseJson.error);
      }
    } catch (err) {
      setError(`Something went wrong`);
    }
  };

  const handleGoToRedirectPassword = () => {
    navigate(routes.resetPassword);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

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
              style={{ color: `#00af87` }}
            >
              restart password page
            </span>
            .
          </div>
        ) : (
          <form className="signUpForm" onSubmit={handleSubmit}>
            <label htmlFor="email">Please type your email:</label>

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
