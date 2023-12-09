import { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import SearchBarImg from "../img/SearchBarImg.jpg";
import axios from "axios";

export default function SearchBar() {
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(``);

  const handleSearch = (inputText) => {
    //If the number of characters was 2 or more and now is 0 or 1, no search results appear
    if (inputText.length < 2) {
      setError(``);
      setSearchResults([]);
      return;
    }

    axios
      .get(`http://localhost:4000/api/destination/search/${inputText}`)
      .then((res) => setSearchResults(res.data.destinations))
      .catch((err) =>
        setError(`Search is not working properly. Please try again later.`)
      );
  };

  const searchResultsMapped = searchResults.map((destination, i) => {
    return (
      <div
        key={i}
        className={
          searchResults.length < 2
            ? "homeSearchResultsSingle"
            : "homeSearchResultsMultiple"
        }
      >
        {destination.name}
      </div>
    );
  });

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
            maxLength={10}
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
