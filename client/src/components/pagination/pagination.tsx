import { Dispatch, SetStateAction } from "react";
import "../../styles/components/pagination.css";

export default function Pagination(props: {
  totalLength: number;
  itemsPerPage: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}): JSX.Element {
  const numberOfPages: number = Math.ceil(
    props.totalLength / props.itemsPerPage
  );

  //If number of destinations is less then 6, pages list will not appear
  if (props.totalLength < props.itemsPerPage + 1) return <div></div>;
  //If number of destinations is higher then 25, not all pages will appear
  //for example if 10 pages exists (1, 2, ... ,7 , ... , 10) will appear
  else if (props.totalLength > props.itemsPerPage * 5) {
    return (
      <div className="pages">
        <div
          onClick={() => props.setPage(props.page === 1 ? 1 : props.page - 1)}
        >
          Previous
        </div>
        <div
          style={{ backgroundColor: props.page === 1 ? `#00af87` : "" }}
          onClick={() => props.setPage(1)}
        >
          1
        </div>
        {props.page === 1 || props.page === 2 ? (
          <div
            style={{ backgroundColor: props.page === 2 ? `#00af87` : "" }}
            onClick={() => props.setPage(2)}
          >
            2
          </div>
        ) : (
          <div>...</div>
        )}
        {props.page === 1 ||
        props.page === 2 ||
        props.page === numberOfPages ||
        props.page === numberOfPages - 1 ? null : (
          <div
            style={{ backgroundColor: `#00af87` }}
            onClick={() => props.setPage(props.page)}
          >
            {props.page}
          </div>
        )}
        {props.page === numberOfPages || props.page === numberOfPages - 1 ? (
          <div
            style={{
              backgroundColor:
                props.page === numberOfPages - 1 ? `#00af87` : "",
            }}
            onClick={() => props.setPage(numberOfPages - 1)}
          >
            {numberOfPages - 1}
          </div>
        ) : (
          <div>...</div>
        )}
        <div
          style={{
            backgroundColor: props.page === numberOfPages ? `#00af87` : "",
          }}
          onClick={() => props.setPage(numberOfPages)}
        >
          {numberOfPages}
        </div>
        <div
          onClick={() =>
            props.setPage(
              props.page === numberOfPages ? numberOfPages : props.page + 1
            )
          }
        >
          Next
        </div>
      </div>
    );
  }
  //If number of destinations is between 6 and 25, all pages will appear (from 1 to 5)
  else {
    let pagesArray: number[] = [];

    for (let i = 1; i <= numberOfPages; i++) {
      pagesArray = [...pagesArray, i];
    }
    return (
      <div className="pages">
        <div
          onClick={() => props.setPage(props.page === 1 ? 1 : props.page - 1)}
        >
          Previous
        </div>
        {pagesArray.map((el, i) => {
          return (
            <div
              style={{ backgroundColor: props.page === el ? `#00af87` : "" }}
              onClick={() => props.setPage(el)}
              key={i}
            >
              {el}
            </div>
          );
        })}
        <div
          onClick={() =>
            props.setPage(
              props.page === numberOfPages ? numberOfPages : props.page + 1
            )
          }
        >
          Next
        </div>
      </div>
    );
  }
}
