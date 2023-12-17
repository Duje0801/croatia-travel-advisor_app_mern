import { useNavigate } from "react-router-dom";
import { routes } from "../../routes/routes";
import "../../styles/components/footer.css";

export default function Footer() {
  const navigate = useNavigate();

  const handleClick = (value) => {
    if (value === `TermsOfUse`) navigate(routes.termsOfUse);
    else if (value === `AboutUs`) navigate(routes.aboutUs);
    else if (value === `Contact`) navigate(routes.contact);
  };

  return (
    <div className="footer">
      <ul>
        <li onClick={() => handleClick("TermsOfUse")}>Terms of use</li>
        <li onClick={() => handleClick("AboutUs")}>About Us</li>
        <li onClick={() => handleClick("Contact")}>Contact</li>
      </ul>
    </div>
  );
}
