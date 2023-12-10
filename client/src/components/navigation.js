import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideMenu from "./sideMenu";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../img/logo.png";
import { routes } from "../routes/routes";
import "../styles/navigation.css";

export default function Navigation() {
  const [openMenu, setOpenMenu] = useState(false);

  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate(routes.home);
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
        <div>Log In</div>
      </div>
      <SideMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />
    </div>
  );
}
