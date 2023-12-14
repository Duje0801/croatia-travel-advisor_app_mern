import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

export default function AboutUs() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Navigation />
      <div className="footerCategory">
        <div className="footerCategoryTitle">About Us:</div>
        <div className="footerCategoryText">
          <p>
            <b>Croatia Travel Advisor</b> is an interactive website that serves
            as a comprehensive guide for travelers exploring Croatia.{" "}
          </p>

          <p>
            Our journey began with a group of travel enthusiasts desire to share
            hidden gems with others. Recognizing the need for a comprehensive
            platform that offers reliable information and personalized
            recommendations, we embarked on a mission to create Croatia Travel
            Advisor.
          </p>

          <p>
            Offering a wide range of information, it provides users with
            detailed insights into popular destinations, attractions,
            accommodations, and local experiences throughout the country.{" "}
          </p>

          <p>
            With user-generated reviews, ratings, and recommendations, Croatia
            Travel Advisor empowers visitors to make informed decisions and plan
            their ideal Croatian itinerary.{" "}
          </p>

          <p>
            {" "}
            From stunning coastal towns and historical landmarks to vibrant
            cities and picturesque landscapes, the website showcases the diverse
            beauty and rich cultural heritage of Croatia, making it a valuable
            resource for anyone seeking an unforgettable travel experience in
            the country.
          </p>
        </div>
        <div className="footerGoBackButtonDiv">
          <button onClick={handleGoBack}>Go Back</button>
        </div>
      </div>
      <Footer />
    </>
  );
}
