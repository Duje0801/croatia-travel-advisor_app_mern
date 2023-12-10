import { useState, useEffect, useRef, useContext } from "react";
import { BsBackspace } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { routes } from "../routes/routes";
import "../styles/sideMenu.css";

export default function SideMenu({ openMenu, setOpenMenu }) {
  const [avoidSlideAtOpening, setAvoidSlideAtOpening] = useState(false);

  const { user, dispatch } = useContext(UserContext);

  const navigate = useNavigate();

  const elementRef = useRef();

  useEffect(() => {
    //Sets side menu opening
    if (openMenu) {
      elementRef.current.classList.add(`sideMenuToRight`);
      elementRef.current.classList.remove(`sideMenuToLeft`);
      setAvoidSlideAtOpening(true);
    } else if (avoidSlideAtOpening) {
      elementRef.current.classList.add(`sideMenuToLeft`);
      elementRef.current.classList.remove(`sideMenuToRight`);
    }
  }, [openMenu]);

  const handleOpenMenu = () => {
    setOpenMenu(false);
  };

  const handleLogIn = () => {
    navigate(routes.logIn);
  };

  const handleLogOut = () => {
    localStorage.removeItem("user");
    dispatch({ type: "DELETE" });
  };

  return (
    <div ref={elementRef} className="sideMenu">
      <div className="sideMenuBackButtonDiv">
        <BsBackspace className="sideMenuBackButton" onClick={handleOpenMenu} />
      </div>
      {!user ? (
        <button className="sideMenuLogInButton" onClick={handleLogIn}>
          Log In
        </button>
      ) : (
        <button className="sideMenuLogInButton" onClick={handleLogOut}>
          Log Out
        </button>
      )}
      <ul className="sideMenuList">
        <li>Home</li>
        <li>Top Rated</li>
        <li>Trending</li>
        <li>Nature</li>
        <li>Towns</li>
        <li>History</li>
        <li>Entertainment</li>
      </ul>
      <ul className="sideMenuList">
        <li>Terms of use</li>
        <li>About Us</li>
        <li>Contact</li>
      </ul>
    </div>
  );
}
