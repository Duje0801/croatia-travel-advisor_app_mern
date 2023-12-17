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
  else if (category === `nature`) {
    return `Experience the harmonious blend of nature's beauty and human ingenuity
          in Croatia's towns, where stunning landscapes and charming architecture
          coexist in perfect harmony. From tranquil coastal towns nestled against
          the azure Adriatic Sea to picturesque mountain villages surrounded by
          lush forests, these places are an oasis of serenity. Breathe in the
          crisp mountain air, wander through lush botanical gardens, and take
          leisurely strolls along pristine beaches. Whether you seek breathtaking
          vistas or the soothing embrace of nature, Croatia's towns offer a
          sanctuary for those who long to be in sync with the natural world.`;
  } else if (category === `towns`) {
    return `Embark on a journey to discover the captivating towns of Croatia, where 
          history comes to life around every corner. Immerse yourself in the rich tapestry 
          of centuries-old architecture, as cobblestone streets lead you through charming squares
          and vibrant markets. Delight in the aroma of local delicacies wafting from family-run eateries, 
          and feel the warmth of the community as you engage with locals eager to share their stories. 
          From the sun-kissed terracotta rooftops to the echoes of ancient tales, each town beckons 
          with a unique charm that promises to leave an indelible mark on your heart. Uncover the 
          hidden gems of Croatia's towns with us, and let the past and present intertwine 
          in a truly unforgettable exploration.`;
  } else if (category === `history`) {
    return `Step into the past as you explore the historic towns of Croatia, each
          one a living testament to the legacy of generations gone by. Wander
          through cobblestone pathways that have witnessed centuries of stories
          unfold, as architectural marvels whisper tales of conquests and
          triumphs. Admire majestic castles, walk along ancient city walls, and
          stand in awe of intricately adorned cathedrals that stand as witnesses
          to the passage of time. With every step, you'll be transported to eras
          long past, making history come alive in the most immersive way possible.
        `;
  } else {
    return `Dive into a world of vivacious entertainment in Croatia's towns, where culture 
          and festivity unite to create unforgettable experiences. From lively street performances 
          to traditional music echoing through charming alleys, the pulse of these towns will have 
          you dancing to their rhythm. Discover quaint theaters hosting captivating performances 
          and bustling nightlife that brings the streets alive after dusk. Immerse yourself in the 
          energy of local festivals and celebrate alongside welcoming locals who know how to have a 
          good time. Let us guide you through the tapestry of entertainment that awaits, promising a 
          symphony of joy and cultural celebration.`;
  }
}
