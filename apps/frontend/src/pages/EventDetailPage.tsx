import { useRecoilValue } from 'recoil';
import { useParams } from 'react-router-dom';

import { getEventData } from '../lib';
import { Loading } from '../components/Loading';
import { EventOverviewCard } from '../components/EventOverviewCard';
import { EventConfirmCard } from '../components/EventConfirmCard';
import { EventDetailCard } from '../components/EventDetailCard';

function EventDetailPage() {
  const { eventId } = useParams();
  const event = useRecoilValue(getEventData({ eventId }));

  // TODO: throw promise
  if (event === null) {
    return <Loading />;
  }

  return (
    <>
      <EventOverviewCard {...event} />
      <EventConfirmCard {...event} />
      <EventDetailCard {...event} />
    </>
  );
}

export default EventDetailPage;
