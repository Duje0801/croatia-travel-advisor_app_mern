import {
  useState,
  useEffect,
  useRef,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { BsBackspace } from "react-icons/bs";
import { routes } from "../../routes/routes";
import "../../styles/components/sideMenu.css";

export default function SideMenu(props: {
  openMenu: boolean;
  setOpenMenu: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  const [avoidSlideAtOpening, setAvoidSlideAtOpening] =
    useState<boolean>(false);

  const { state, dispatch } = useContext(UserContext);

  const navigate = useNavigate();

  const elementRef = useRef<HTMLDivElement>(null);

  useEffect((): void => {
    //Sets side menu opening
    if (props.openMenu && elementRef.current) {
      elementRef.current.classList.add(`sideMenuToRight`);
      elementRef.current.classList.remove(`sideMenuToLeft`);
      setAvoidSlideAtOpening(true);
    } else if (avoidSlideAtOpening && elementRef.current) {
      elementRef.current.classList.add(`sideMenuToLeft`);
      elementRef.current.classList.remove(`sideMenuToRight`);
    }
  }, [props.openMenu]);

  const handleOpenMenu = (): void => {
    props.setOpenMenu(false);
  };

  const handleLogIn = (): void => {
    navigate(routes.logIn);
  };

  const handleLogOut = (): void => {
    localStorage.removeItem("user");
    dispatch({ type: "DELETE", payload: null });
  };

  const handleClick = (value: string): void => {
    if (value === `newDestination`) navigate(routes.newDestination);
    else if (value === `userList`) navigate(routes.userList);
    else if (value === `myProfile`)
      navigate(`${routes.user}/${state.user?.username}`);
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
      {!state.user ? (
        <button className="sideMenuLogInButton" onClick={handleLogIn}>
          Log In
        </button>
      ) : (
        <button className="sideMenuLogInButton" onClick={handleLogOut}>
          Log Out
        </button>
      )}
      {state.user && state.user?.username !== `admin` ? (
        <ul className="sideMenuList">
          <li onClick={() => handleClick(`myProfile`)}>My profile</li>
        </ul>
      ) : null}
      {state.user?.username === `admin` ? (
        <ul className="sideMenuList">
          <li onClick={() => handleClick(`newDestination`)}>
            Add new destination
          </li>
          <li onClick={() => handleClick(`userList`)}>User list</li>
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
