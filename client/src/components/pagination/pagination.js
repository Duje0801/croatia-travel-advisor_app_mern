export default function Pagination({ totalLength, itemsPerPage, page, setPage }) {
  const numberOfPages = Math.ceil(totalLength / itemsPerPage);

  //If number of destinations is less then 6, pages list will not appear
  if (totalLength < (itemsPerPage + 1)) return <div></div>;
  //If number of destinations is higher then 25, not all pages will appear
  //for example if 10 pages exists (1, 2, ... ,7 , ... , 10) will appear
  else if (totalLength > (itemsPerPage * 5)) {
    return (
      <div className="pages">
        <div onClick={() => setPage(page === 1 ? 1 : page - 1)}>Previous</div>
        <div
          style={{ backgroundColor: page === 1 ? `#00af87` : "" }}
          onClick={() => setPage(1)}
        >
          1
        </div>
        {page === 1 || page === 2 ? (
          <div
            style={{ backgroundColor: page === 2 ? `#00af87` : "" }}
            onClick={() => setPage(2)}
          >
            2
          </div>
        ) : (
          <div>...</div>
        )}
        {page === 1 ||
        page === 2 ||
        page === numberOfPages ||
        page === numberOfPages - 1 ? null : (
          <div
            style={{ backgroundColor: `#00af87` }}
            onClick={() => setPage(page)}
          >
            {page}
          </div>
        )}
        {page === numberOfPages || page === numberOfPages - 1 ? (
          <div
            style={{
              backgroundColor: page === numberOfPages - 1 ? `#00af87` : "",
            }}
            onClick={() => setPage(numberOfPages - 1)}
          >
            {numberOfPages - 1}
          </div>
        ) : (
          <div>...</div>
        )}
        <div
          style={{ backgroundColor: page === numberOfPages ? `#00af87` : "" }}
          onClick={() => setPage(numberOfPages)}
        >
          {numberOfPages}
        </div>
        <div
          onClick={() =>
            setPage(page === numberOfPages ? numberOfPages : page + 1)
          }
        >
          Next
        </div>
      </div>
    );
  }
  //If number of destinations is between 6 and 25, all pages will appear (from 1 to 5)
  else {
    let pagesArray = [];

    for (let i = 1; i <= numberOfPages; i++) {
      pagesArray = [...pagesArray, i];
    }
    return (
      <div className="pages">
        <div onClick={() => setPage(page === 1 ? 1 : page - 1)}>Previous</div>
        {pagesArray.map((el, i) => {
          return (
            <div
              style={{ backgroundColor: page === el ? `#00af87` : "" }}
              onClick={() => setPage(el)}
              key={i}
            >
              {el}
            </div>
          );
        })}
        <div
          onClick={() =>
            setPage(page === numberOfPages ? numberOfPages : page + 1)
          }
        >
          Next
        </div>
      </div>
    );
  }
}
