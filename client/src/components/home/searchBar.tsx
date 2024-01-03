import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearchAlt2 } from "react-icons/bi";
import SearchBarImg from "../../img/SearchBarImg.jpg";
import { ISearchResults } from "../../interfaces/ISearchResults";
import { routes } from "../../routes/routes";
import axios from "axios";

export default function SearchBar(): JSX.Element {
  const [searchResults, setSearchResults] = useState<ISearchResults[]>([]);
  const [error, setError] = useState<string>(``);

  const navigate = useNavigate();

  const handleSearch = (inputText: string): void => {
    //If the number of characters was 2 or more and now is 0 or 1, no search results appear
    if (inputText.length < 2) {
      setError(``);
      setSearchResults([]);
      return;
    }

    axios
      .get(
        `https://croatia-travel-advisor-app-mern.onrender.com/api/destination/search/${inputText}`
      )
      .then((res) => setSearchResults(res.data.destinations))
      .catch((error) =>
        setError(`Search is not working properly. Please try again later.`)
      );
  };

  const handleClick = (value: string): void => {
    navigate(`${routes.destination}/${value}`);
  };

  const searchResultsMapped: JSX.Element[] = searchResults.map(
    (destination, i) => {
      return (
        <div
          key={i}
          className={
            searchResults.length < 2
              ? "homeSearchResultsSingle"
              : "homeSearchResultsMultiple"
          }
          onClick={() => handleClick(destination.name)}
        >
          {destination.name}
        </div>
      );
    }
  );

  return (
    <div className="homeContainer">
      <img
        src={SearchBarImg}
        className="homeContainerImg"
        alt="Search Bar Image"
      ></img>
      <div className="homeSearchBar">
        <form>
          <div className="homeSearchBarIcon">
            <BiSearchAlt2 />
          </div>
          <input
            type="text"
            placeholder="Explore places to go..."
            maxLength={15}
            onChange={(e) => handleSearch(e.target.value)}
          ></input>
          <button type="submit">Submit</button>
        </form>
      </div>
      {searchResults && (
        <div className="homeSearchResults">{searchResultsMapped}</div>
      )}
      {error && <div className="homeSearchError">{error}</div>}
    </div>
  );
}
