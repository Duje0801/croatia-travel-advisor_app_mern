import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/home/navigation";
import Redirect from "../redirectLoading/redirect";
import axios from "axios";

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

    axios
      .patch(
        `http://localhost:4000/api/user/updateEmail`,
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
            authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        setIsEmailChanged(true);
        const data = res.data.data;
        const updatedUserInfo = {
          email: data.email,
          username: data.username,
          token: user.token,
        };
        dispatch({ type: "SET", payload: updatedUserInfo });
        localStorage.setItem("user", JSON.stringify(updatedUserInfo));
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          setError(`${err.response.data.error}`);
        } else setError("Something went wrong, please try again later.");
      });
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
