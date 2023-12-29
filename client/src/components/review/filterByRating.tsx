import { useContext, useState } from "react";
import { DestinationContext } from "../../context/destinationContext";

export default function FilterByRating(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { filterRating, setFilterRating, setPage } =
    useContext(DestinationContext);

  const handleOpenRatingStars = (): void => {
    setIsOpen(isOpen ? false : true);
  };

  const handleFilterRating = (rating: number): void => {
    setFilterRating(rating);
    setPage(1);
  };

  return (
    <div className="reviewFilterRating">
      <div>
        Filter by rating{" "}
        <button
          onClick={() => handleOpenRatingStars()}
          className="reviewEditButton"
        >
          {isOpen ? "Close" : "Open"}
        </button>
      </div>
      {isOpen && (
        <div>
          <button
            onClick={() => handleFilterRating(5)}
            className={
              filterRating === 5
                ? "reviewEditButtonSelected"
                : "reviewEditButton"
            }
          >
            5
          </button>
          <button
            onClick={() => handleFilterRating(4)}
            className={
              filterRating === 4
                ? "reviewEditButtonSelected"
                : "reviewEditButton"
            }
          >
            4
          </button>
          <button
            onClick={() => handleFilterRating(3)}
            className={
              filterRating === 3
                ? "reviewEditButtonSelected"
                : "reviewEditButton"
            }
          >
            3
          </button>
          <button
            onClick={() => handleFilterRating(2)}
            className={
              filterRating === 2
                ? "reviewEditButtonSelected"
                : "reviewEditButton"
            }
          >
            2
          </button>
          <button
            onClick={() => handleFilterRating(1)}
            className={
              filterRating === 1
                ? "reviewEditButtonSelected"
                : "reviewEditButton"
            }
          >
            1
          </button>
          <button
            onClick={() => handleFilterRating(0)}
            className="reviewEditButton"
          >
            All
          </button>
        </div>
      )}
    </div>
  );
}
