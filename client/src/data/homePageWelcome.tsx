export default function HomePageWelcome(): string {
  const randomText = Math.trunc(Math.random() * 5) + 1;
  if (randomText === 1) return `Build Trip in Few Minutes...`;
  else if (randomText === 2) return `Your Ultimate Travel Guide...`;
  else if (randomText === 3) return `Navigate Croatia with Ease...`;
  else if (randomText === 4) return `Unlock Croatia's Secrets...`;
  else return `Embark on Epic Journeys...`;
}
