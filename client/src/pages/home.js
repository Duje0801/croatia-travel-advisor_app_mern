import { useEffect, useState } from "react";
import HomePageWelcome from "../data/homePageWelcome";
import Navigation from "../components/navigation";
import SearchBar from "../components/searchBar";
import TopRatedTrendingContainer from "../components/topRatedTrendingContainer";
import "../styles/home.css";

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
    </>
  );
}
