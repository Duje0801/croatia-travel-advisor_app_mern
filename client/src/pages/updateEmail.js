import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import Navigation from "../components/navigation";
import Redirect from "./redirect";

export default function UpdateEmail() {
  const [oldEmail, setOldEmail] = useState(``);
  const [newEmail, setNewEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [error, setError] = useState(``);

  const navigate = useNavigate();

  const { user, dispatch } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:4000/api/user/updateEmail",
        {
          method: "PATCH",
          body: JSON.stringify({
            oldEmail,
            newEmail,
            password,
          }),
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      const responseJson = await response.json();

      if (responseJson.status === `success`) {
        setIsEmailChanged(true);
        const updatedUserInfo = {
          email: responseJson.data.email,
          username: responseJson.data.username,
          token: user.token,
        };
        dispatch({ type: "SET", payload: updatedUserInfo });
        localStorage.setItem("user", JSON.stringify(updatedUserInfo));
      } else if (responseJson.status === `fail`) {
        setError(responseJson.error);
      }
    } catch (err) {
      setError(`Something went wrong, please try again later.`);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isEmailChanged)
    return <Redirect message={`Email is successfully changed`} />;
  else
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
              maxLength={20}
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
