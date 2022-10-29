import { faker } from '@faker-js/faker';

import { EventOverviewCard } from '../components/EventOverviewCard';
import { EventDetailCard } from '../components/EventDetailCard';

interface EventData {
  title: string;
  thumbnail: string;
  description: string;
  start: Date;
  end: Date;
}

function EventDetailPage() {
  const eventData: EventData = {
    title: faker.lorem.words(),
    thumbnail: faker.image.nature(),
    description: faker.lorem.paragraphs(),
    start: faker.date.recent(),
    end: faker.date.soon(),
  };

  return (
    <>
      <EventOverviewCard {...eventData} />
      <EventDetailCard {...eventData} />
    </>
  );
}

export default EventDetailPage;
