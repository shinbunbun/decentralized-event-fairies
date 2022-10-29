import { useRecoilValue } from 'recoil';

import { getUserData } from '../lib';
import { UserProfileCard } from '../components/UserProfileCard';
import { EventListCard } from '../components/EventListCard';

function UserProfilePage() {
  const user = useRecoilValue(getUserData({ userId: 1 }));

  return (
    <>
      <UserProfileCard {...user} />
      <EventListCard events={[]} />
    </>
  );
}

export default UserProfilePage;
