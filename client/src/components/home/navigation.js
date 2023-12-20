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
                <button onClick={() => redirect(`userList`)}>Users</button>
                <button onClick={() => redirect(`addNewDestination`)}>
                  Add new destination
                </button>
              </>
            ) : (
              <button onClick={() => redirect(`myProfile`)}>My profile</button>
            )}
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>
      );
    //If user is not logged in
    else
      return (
        <div className="navLogIn" onClick={() => redirect(`logIn`)}>
          Log in
        </div>
      );
  };

  const redirect = (to) => {
    if (to === `home`) navigate(routes.home);
    else if (to === `logIn`) navigate(routes.logIn);
    else if (to === `userList`) navigate(routes.userList);
    else if (to === `addNewDestination`) navigate(routes.newDestination);
    else if (to === `myProfile`) navigate(`${routes.user}/${user.username}`);
    else if (to === `nature`) navigate(`${routes.category}/${to}`);
    else if (to === `towns`) navigate(`${routes.category}/${to}`);
    else if (to === `history`) navigate(`${routes.category}/${to}`);
    else if (to === `entertainment`) navigate(`${routes.category}/${to}`);
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
        <div className="navCentral" onClick={() => redirect(`home`)}>
          <img src={logo} alt="logo"></img>
          <div>Croatia Travel Advisor</div>
        </div>
        <div className="navCentralList">
          <ul>
            <li onClick={() => redirect(`nature`)}>Nature</li>
            <li onClick={() => redirect(`towns`)}>Towns</li>
            <li onClick={() => redirect(`history`)}>History</li>
            <li onClick={() => redirect(`entertainment`)}>Entertainment</li>
          </ul>
        </div>
        <div className="navLogIn">{isSignedIn()}</div>
      </div>
      <SideMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />
    </div>
  );
}
