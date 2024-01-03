import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import NavigationLogo from "./navigationLogo";
import CentralList from "./centralList";
import IsLogged from "./isLogged";
import SideMenu from "../home/sideMenu";
import { routes } from "../../routes/routes";
import "../../styles/components/navigation.css";

export default function Navigation(): JSX.Element {
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const { state } = useContext(UserContext);

  const navigate = useNavigate();

  const redirect = (to: string): void => {
    if (to === `home`) navigate(routes.home);
    else if (to === `logIn`) navigate(routes.logIn);
    else if (to === `userList`) navigate(routes.userList);
    else if (to === `addNewDestination`) navigate(routes.newDestination);
    else if (to === `myProfile`)
      navigate(`${routes.user}/${state.user?.username}`);
    else if (to === `nature`) navigate(`${routes.category}/${to}`);
    else if (to === `towns`) navigate(`${routes.category}/${to}`);
    else if (to === `history`) navigate(`${routes.category}/${to}`);
    else if (to === `entertainment`) navigate(`${routes.category}/${to}`);
  };

  return (
    <div>
      <div className="nav">
        <NavigationLogo redirect={redirect} setOpenMenu={setOpenMenu} />
        <CentralList redirect={redirect} />
        <IsLogged redirect={redirect} />
      </div>
      <SideMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />
    </div>
  );
}
