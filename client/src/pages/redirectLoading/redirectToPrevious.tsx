import { useNavigate } from "react-router-dom";
import Navigation from "../../components/navigation/navigation";
import Footer from "../../components/home/footer";
import "../../styles/pages/redirect.css";

export default function RedirectToPrevious(props: {
  message: string;
}): JSX.Element {
  const navigate = useNavigate();

  const handleHome = (): void => {
    navigate(-1);
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
              previous page
            </a>
            .
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
