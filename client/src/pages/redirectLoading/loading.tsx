import Navigation from "../../components/home/navigation";
import Footer from "../../components/home/footer";
import "../../styles/pages/redirect.css";

export default function Loading(): JSX.Element {
  return (
    <>
      <Navigation />
      <div className="redirectBox">Loading...</div>
      <Footer />
    </>
  );
}
