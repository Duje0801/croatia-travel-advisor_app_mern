export default function HomeContainersText({ value, handleClick }) {
  if (value === `topRated`) {
    return (
      <div className="homeContainerText">
        Travelers Choice, Best Things to Do in Croatia
        <div>See our best reviewed locations!</div>
        <button onClick={() => handleClick(value)}>See the list</button>
      </div>
    );
  } else {
    return (
      <div className="homeContainerText homeTrendingBlackColor">
        Currently trending.
        <div>
          See a diverse range of experiences for every type of traveler!
        </div>
        <button onClick={() => handleClick(value)}>See the list</button>
      </div>
    );
  }
}
