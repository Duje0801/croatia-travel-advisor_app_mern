import { useNavigate } from "react-router-dom";
import { routes } from "../routes/routes";
import "../styles/footer.css";

export default function Footer() {
  const navigate = useNavigate();

  const handleClick = (value) => {
    if (value === `TermsOfUse`) navigate(routes.termsOfUse);
    else if (value === `AboutUs`) navigate(routes.aboutUs);
  };

  return (
    <div className="footer">
      <ul>
        <li onClick={() => handleClick("TermsOfUse")}>Terms of use</li>
        <li onClick={() => handleClick("AboutUs")}>About Us</li>
        <li>Contact</li>
      </ul>
    </div>
  );
}
