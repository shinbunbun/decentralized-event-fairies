import { createUserData } from '../lib';
import { UserProfileCard } from '../components/UserProfileCard';
import { EventListCard } from '../components/EventListCard';

function UserProfilePage() {
  const data = createUserData();

  return (
    <>
      <UserProfileCard {...data} />
      <EventListCard {...data} />
    </>
  );
}

export default UserProfilePage;
