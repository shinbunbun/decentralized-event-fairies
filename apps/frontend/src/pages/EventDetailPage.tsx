import { useRecoilValue } from 'recoil';

import { getEventData } from '../lib';
import { EventOverviewCard } from '../components/EventOverviewCard';
import { EventDetailCard } from '../components/EventDetailCard';

function EventDetailPage() {
  const event = useRecoilValue(getEventData({ eventId: 1 }));

  return (
    <>
      <EventOverviewCard {...event} />
      <EventDetailCard {...event} />
    </>
  );
}

export default EventDetailPage;
