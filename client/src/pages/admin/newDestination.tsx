import { useContext, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navigation from "../../components/navigation/navigation";
import Redirect from "../redirectLoading/redirect";
import Footer from "../../components/home/footer";
import axios from "axios";
import "../../styles/pages/newDestination.css";

export default function NewDestination(): JSX.Element {
  const [name, setName] = useState<string>(``);
  const [image, setImage] = useState<string>(``);
  const [description, setDescription] = useState<string>(``);
  const [nature, setNature] = useState<string>(``);
  const [towns, setTowns] = useState<string>(``);
  const [history, setHistory] = useState<string>(``);
  const [entertainment, setEntertainment] = useState<string>(``);
  const [added, setAdded] = useState<boolean>(false);
  const [error, setError] = useState<string>(``);

  const { state } = useContext(UserContext);

  const navigate = useNavigate();

  //This page is available only if username is admin

  const handleAddDestination = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    let category: string[] = [];
    if (nature) category = [nature];
    if (towns) category = [...category, towns];
    if (history) category = [...category, history];
    if (entertainment) category = [...category, entertainment];

    //Posts new destination

    axios
      .post(
        `https://croatia-travel-advisor-app-mern.onrender.com/api/destination`,
        {
          data: { name, image, description, category },
        },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${state.user?.token}`,
          },
        }
      )
      .then((res) => {
        setAdded(true);
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
          setError(`${err.response.data.error}`);
        } else {
          setError(`Can't add new destination, please try again later.`);
        }
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (state.user?.username !== `admin`)
    return <Redirect message={`Only admin have access to this page`} />;
  else if (added) {
    return (
      <Redirect message={`${name} is succesfully added to destinations list`} />
    );
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
              maxLength={30}
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
                  onChange={() => setNature(nature ? `` : `nature`)}
                />
                <label htmlFor="nature">Nature</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="type"
                  id="towns"
                  value={towns}
                  onChange={() => setTowns(towns ? `` : `towns`)}
                />
                <label htmlFor="towns">Towns</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="type"
                  id="history"
                  value={history}
                  onChange={() => setHistory(history ? `` : `history`)}
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
                    setEntertainment(entertainment ? `` : `entertainment`)
                  }
                />
                <label htmlFor="entertainment">Entertainment</label>
              </div>
            </fieldset>
            <button className="newDestinationButtons" type="submit">
              Submit
            </button>
            <button className="newDestinationButtons" onClick={handleBack}>
              Back
            </button>
          </form>
        </div>
        <Footer />
      </>
    );
}
