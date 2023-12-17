import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../img/logo.png";
import SideMenu from "./sideMenu";
import { routes } from "../../routes/routes";
import "../styles/navigation.css";

export default function Navigation() {
  const [openMenu, setOpenMenu] = useState(false);

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const isSignedIn = () => {
    //If user is  logged in
    if (user)
      return <div className="navHelloMessage">Hi, {user.username}!</div>;
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

  return (
    <div>
      <div className="nav">
        <RxHamburgerMenu onClick={() => setOpenMenu(true)} />
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
