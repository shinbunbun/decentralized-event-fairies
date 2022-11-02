import { useRecoilValue } from 'recoil';
import { EventListCard } from '../components/EventListCard';
import { getAllEvents } from '../lib';

function HomePage() {
  const events = useRecoilValue(getAllEvents(null));

  return <EventListCard events={events} />;
}

export default HomePage;
