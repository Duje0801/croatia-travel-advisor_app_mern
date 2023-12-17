import { useNavigate } from "react-router-dom";
import Navigation from "../../components/homeComponents/navigation";
import Footer from "../../components/homeComponents/footer";
import { useEffect } from "react";

export default function TermsOfUse() {
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
        <div className="footerCategoryTitle">Terms of Use:</div>
        <div className="footerCategoryText">
          <div>
            <p>
              <b>Welcome to Croatia Travel Advisor!</b>
            </p>

            <p>
              By using our website, you agree to the following terms and
              conditions in full. If you disagree with any part of these terms,
              please do not use our website.
            </p>
          </div>
          <div>
            <b>Intellectual Property:</b>
            <p>
              a. The content published on the Croatia Travel Advisor website,
              including texts, images, logos, and graphics, is the property of
              Croatia Travel Advisor and is protected by copyright and other
              intellectual property laws. Reproduction, distribution, or use of
              the content without explicit written permission from Croatia
              Travel Advisor is not permitted.
            </p>
            <p>
              b. Users may share the content of the website through social media
              or other communication channels using the available sharing
              features.
            </p>
          </div>
          <div>
            <b>Limitations of Liability:</b>
            <p>
              a. Croatia Travel Advisor does not guarantee the accuracy,
              completeness, or reliability of the information found on the
              website. Use the information at your own risk.
            </p>
            <p>
              b. Croatia Travel Advisor is not liable for any damages or losses
              arising from the use or inability to use the website or its
              services.
            </p>
          </div>
          <div>
            <b>Links to External Websites:</b>
            <p>
              The Croatia Travel Advisor website may contain links to external
              websites that are not under the control of Croatia Travel Advisor.
              Croatia Travel Advisor is not responsible for the content or
              privacy practices of those websites.
            </p>
          </div>
          <div>
            <b>User Privacy:</b>
            <p>
              Croatia Travel Advisor respects user privacy. The collection, use,
              and disclosure of user personal data are governed by our Privacy
              Policy.
            </p>
          </div>
          <div>
            Changes to the Terms of Use:
            <p>
              {" "}
              Croatia Travel Advisor reserves the right to modify these terms of
              use at any time. We recommend periodically reviewing the terms of
              use to stay informed.
            </p>
          </div>
        </div>
        <div className="footerGoBackButtonDiv">
          <button onClick={handleGoBack}>Go Back</button>
        </div>
      </div>
      <Footer />
    </>
  );
}
