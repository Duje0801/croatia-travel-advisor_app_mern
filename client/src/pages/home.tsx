import { useEffect, useState } from "react";
import HomePageWelcome from "../data/homePageWelcome";
import Navigation from "../components/navigation/navigation";
import SearchBar from "../components/home/searchBar";
import TopRatedTrendingContainer from "../components/home/topRatedTrendingContainer";
import Footer from "../components/home/footer";
import "../styles/pages/home.css";

export default function Home(): JSX.Element {
  const [randomText, setRandomText] = useState<string>(`Welcome...`);

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
