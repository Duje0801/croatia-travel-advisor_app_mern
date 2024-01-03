import { useNavigate } from "react-router-dom";
import Navigation from "../../components/navigation/navigation";
import Footer from "../../components/home/footer";
import { routes } from "../../routes/routes";
import "../../styles/pages/redirect.css";

export default function Redirect(props: { message: string }): JSX.Element {
  const navigate = useNavigate();

  const handleHome = (): void => {
    navigate(routes.home);
  };

  return (
    <>
      <Navigation />
      <div className="redirectBox">
        <div>
          <div>{props.message}.</div>
          <div>
            Go to{" "}
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
