import Navigation from "../../components/home/navigation";
import "../styles/redirect.css";

export default function LoadingPage() {
  return (
    <>
      <Navigation />
      <div className="redirectBox">Loading...</div>
    </>
  );
}
