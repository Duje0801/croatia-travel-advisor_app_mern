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

  const handleClick = (value) => {
    if (value === `newDestination`) navigate(routes.newDestination);
    else if (value === `allUsers`) navigate(routes.allUsers);
    else if (value === `home`) navigate(routes.home);
    else if (value === `termsOfUse`) navigate(routes.termsOfUse);
    else if (value === `aboutUs`) navigate(routes.aboutUs);
    else if (value === `contact`) navigate(routes.contact);
    else navigate(`${routes.category}/${value}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      {user?.username === `admin` ? (
        <ul className="sideMenuList">
          <li onClick={() => handleClick(`newDestination`)}>
            Add new destination
          </li>
          <li onClick={() => handleClick(`allUsers`)}>
            All Users List
          </li>
        </ul>
      ) : null}
      <ul className="sideMenuList">
        <li onClick={() => handleClick(`home`)}>Home</li>
        <li onClick={() => handleClick(`topRated`)}>Top Rated</li>
        <li onClick={() => handleClick(`trending`)}>Trending</li>
        <li onClick={() => handleClick(`nature`)}>Nature</li>
        <li onClick={() => handleClick(`towns`)}>Towns</li>
        <li onClick={() => handleClick(`history`)}>History</li>
        <li onClick={() => handleClick(`entertainment`)}>Entertainment</li>
      </ul>
      <ul className="sideMenuList">
        <li onClick={() => handleClick(`termsOfUse`)}>Terms of use</li>
        <li onClick={() => handleClick(`aboutUs`)}>About Us</li>
        <li onClick={() => handleClick(`contact`)}>Contact</li>
      </ul>
    </div>
  );
}
