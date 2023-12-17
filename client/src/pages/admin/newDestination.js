import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/home/navigation";
import Redirect from "../redirectLoading/redirect";
import Footer from "../../components/home/footer";
import "../../styles/pages/newDestination.css";

export default function NewDestination() {
  const [name, setName] = useState(``);
  const [image, setImage] = useState(``);
  const [description, setDescription] = useState(``);
  const [nature, setNature] = useState(false);
  const [towns, setTowns] = useState(false);
  const [history, setHistory] = useState(false);
  const [entertainment, setEntertainment] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(``);

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  //This page is available only if username is admin

  const handleAddDestination = async (e) => {
    e.preventDefault();

    let category = [];
    if (nature) category = ["nature"];
    if (towns) category = [...category, "towns"];
    if (history) category = [...category, "history"];
    if (entertainment) category = [...category, "entertainment"];

    //Posts new destination
    try {
      const response = await fetch(`http://localhost:4000/api/destination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name, image, description, category }),
      });

      const responseJson = await response.json();

      if (responseJson.status === `success`) {
        setAdded(true);
      } else if (responseJson.status === `fail`) {
        setError(`${responseJson.error}`);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } catch (err) {
      setError(`Can't save new destination. Please try again later`);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (user?.username !== `admin`)
    return <Redirect message={`Only admin have access to this page`} />;
  else if (added) {
    return (
      <Redirect message={`${name} is succesfully added to destinations list`} />
    );
  } else if (error === `Can't save new destination. Please try again later`) {
    return <Redirect message={error} />;
  } else
    return (
      <>
        <Navigation />
        <div className="newDestination">
          <div className="newDestinationTitle">Add new destination:</div>
          <div className="newDestinationError">{error}</div>
          <form className="newDestinationForm" onSubmit={handleAddDestination}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              value={name}
              maxLength={20}
              onChange={(e) => setName(e.target.value)}
              id="name"
              required
            ></input>
            <label htmlFor="img">Image link:</label>
            <input
              type="text"
              value={image}
              maxLength={500}
              onChange={(e) => setImage(e.target.value)}
              id="img"
              required
            ></input>
            <div className="newDestinationImageDescription">
              The best aspect ratio for the image would be 1.5:1
            </div>
            <label htmlFor="description">Description:</label>
            <textarea
              value={description}
              rows={4}
              cols={40}
              maxLength={500}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              required
            ></textarea>
            <label>Please select destinations category:</label>
            <fieldset>
              <div>
                <input
                  type="checkbox"
                  name="type"
                  id="nature"
                  value={nature}
                  onChange={() => setNature(nature ? false : true)}
                />
                <label htmlFor="nature">Nature</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="type"
                  id="towns"
                  value={towns}
                  onChange={() => setTowns(towns ? false : true)}
                />
                <label htmlFor="towns">Towns</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="type"
                  id="history"
                  value={history}
                  onChange={() => setHistory(history ? false : true)}
                />
                <label htmlFor="history">History</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="type"
                  id="entertainment"
                  value={entertainment}
                  onChange={() =>
                    setEntertainment(entertainment ? false : true)
                  }
                />
                <label htmlFor="entertainment">Entertainment</label>
              </div>
            </fieldset>
            <button className="newDestinationButtons" type="submit">
              Submit
            </button>
            <button className="newDestinationButtons" onClick={handleGoBack}>
              Go Back
            </button>
          </form>
        </div>
        <Footer />
      </>
    );
}
