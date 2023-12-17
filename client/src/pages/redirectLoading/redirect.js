import Navigation from "../../components/home/navigation";
import Footer from "../../components/home/footer";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes/routes";
import "../styles/redirect.css";

export default function Redirect({message}) {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate(routes.home);
  };

  return (
    <>
      <Navigation />
      <div className="redirectBox">
        <div>
          <div>
            {message}. Go to{" "}
            <a className="redirectGoToHomePage" onClick={handleHome}>
              home page
            </a>
            .
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
