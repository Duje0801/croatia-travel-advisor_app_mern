import { useEffect, useState } from "react";
import HomePageWelcome from "../data/homePageWelcome";
import Navigation from "../components/home/navigation";
import SearchBar from "../components/home/searchBar";
import Footer from "../components/home/footer";
import TopRatedTrendingContainer from "../components/home/topRatedTrendingContainer";
import "../styles/pages/home.css";

export default function Home() {
  const [randomText, setRandomText] = useState(`Welcome...`);

  useEffect(() => {
    setInterval(() => {
      setRandomText(HomePageWelcome());
    }, 10000);
  }, []);

  return (
    <>
      <Navigation />
      <div className="homeMessageText">{randomText}</div>
      <SearchBar />
      <TopRatedTrendingContainer value="topRated" />
      <TopRatedTrendingContainer value="trending" />
      <Footer />
    </>
  );
}
