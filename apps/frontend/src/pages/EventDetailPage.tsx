import { createEventData } from '../lib';
import { EventOverviewCard } from '../components/EventOverviewCard';
import { EventDetailCard } from '../components/EventDetailCard';

function EventDetailPage() {
  const eventData = createEventData();

  return (
    <>
      <EventOverviewCard {...eventData} />
      <EventDetailCard {...eventData} />
    </>
  );
}

export default EventDetailPage;
