import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

export default function Contact() {
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
        <div className="footerCategoryTitle">Contact Us:</div>
        <div className="footerCategoryText">
          <p>
            We value your feedback and are here to assist you. Please don't
            hesitate to reach out to us with any inquiries or concerns regarding
            your travel experiences in Croatia.
          </p>
          <p>
            Our dedicated support team is available to provide assistance and
            address any questions you may have. Contact Information:
          </p>

          <p>
            <b>Email:</b>{" "}
            <a href="mailto:info@croatiatraveladvisor.com">
              info@croatiatraveladvisor.com
            </a>
          </p>
          <p>
            <b>Phone:</b> +1234567890{" "}
          </p>

          <p>
            We strive to respond to all inquiries promptly and ensure that your
            needs are met. Whether you have queries about recommended
            destinations, travel arrangements, or suggestions for improving our
            services, we are eager to hear from you.{" "}
          </p>

          <p>
            You can also stay connected with us through our social media
            channels for updates, travel tips, and exciting promotions:
          </p>
          <p>
            <b>Facebook:</b>{" "}
            <a href="https://facebook.com/">
              facebook.com/croatiatraveladvisor
            </a>
          </p>
          <p>
            <b>Twitter:</b>{" "}
            <a href="https://twitter.com/">twitter.com/croatiaadvisor</a>
          </p>
          <p>
            <b>Instagram:</b>{" "}
            <a href="https://www.instagram.com/">
              instagram.com/croatiatraveladvisor
            </a>
          </p>

          <p>
            We look forward to assisting you and making your Croatia travel
            experience truly remarkable.
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
