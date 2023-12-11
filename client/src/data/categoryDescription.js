export default function CategoryDescription(category) {
  if (category === `topRated`) {
    return `Delve into a selection of the most highly acclaimed travel spots, as recognized by fellow 
            explorers. Uncover unparalleled experiences and sought-after locales that have garnered exceptional 
            reviews and ratings from the travel community. Embark on journeys to these celebrated destinations 
            to enjoy the pinnacle of travel encounters, encompassing breathtaking landscapes, cultural treasures, 
            and unforgettable adventures, all spotlighted based on their outstanding traveler feedback.`;
  } else if (category === `trending`) {
    return `Explore the latest buzzworthy travel destinations that are capturing the attention of wanderers 
            worldwide. Immerse yourself in the freshest and most talked-about locales, curated based on their rising 
            popularity and the excitement they're generating within the travel community. Embark on a journey to 
            these trending hotspots to be at the forefront of travel trends, experiencing emerging cultural gems, 
            captivating landscapes, and unique adventures that are currently stealing the spotlight in the world of travel.`;
  }
}
