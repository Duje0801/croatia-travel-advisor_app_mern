import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../img/logo.png";
import "../styles/navigation.css";

export default function Navigation() {
  return (
    <div>
      <div className="nav">
        <RxHamburgerMenu />
        <div className="navCentral">
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
    </div>
  );
}
