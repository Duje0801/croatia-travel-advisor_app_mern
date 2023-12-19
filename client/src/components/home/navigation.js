import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../../img/logo.png";
import SideMenu from "./sideMenu";
import { routes } from "../../routes/routes";
import "../../styles/components/navigation.css";

export default function Navigation() {
  const [openMenu, setOpenMenu] = useState(false);

  const { user, dispatch } = useContext(UserContext);

  const navigate = useNavigate();

  const isSignedIn = () => {
    //If user is  logged in
    if (user)
      return (
        <div>
          <div className="navHelloMessage">Hi, {user.username}!</div>{" "}
          <div className="navAdminButtons">
            {user?.username === `admin` ? (
              <>
                <button onClick={handleToAllUsers}>Users</button>
                <button onClick={handleAddNewDestination}>
                  Add new destination
                </button>
              </>
            ) : (
              <button onClick={handleToMyProfile}>My profile</button>
            )}
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>
      );
    //If user is not logged in
    else
      return (
        <div className="navLogIn" onClick={handleLogIn}>
          Log in
        </div>
      );
  };

  const handleTitleClick = () => {
    navigate(routes.home);
  };

  const handleLogIn = () => {
    navigate(routes.logIn);
  };

  const handleToAllUsers = () => {
    navigate(routes.allUsers);
  };

  const handleAddNewDestination = () => {
    navigate(routes.newDestination);
  };

  const handleToMyProfile = () => {
    navigate(`${routes.user}/${user.username}`);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    dispatch({ type: "DELETE" });
  };

  return (
    <div>
      <div className="nav">
        <RxHamburgerMenu
          className="navIcon"
          onClick={() => setOpenMenu(true)}
        />
        <div className="navCentral" onClick={handleTitleClick}>
          <img src={logo} alt="logo"></img>
          <div>Croatia Travel Advisor</div>
        </div>
        <div className="navCentralList">
          <ul>
            <li>Nature</li>
            <li>Towns</li>
            <li>History</li>
            <li>Entertainment</li>
          </ul>
        </div>
        <div className="navLogIn">{isSignedIn()}</div>
      </div>
      <SideMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />
    </div>
  );
}
