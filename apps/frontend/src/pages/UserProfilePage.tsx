import { useRecoilValue } from 'recoil';
import { useParams } from 'react-router-dom';

import { getUserData } from '../lib';
import { Loading } from '../components/Loading';
import { UserProfileCard } from '../components/UserProfileCard';
import { EventListCard } from '../components/EventListCard';

function UserProfilePage() {
  const { userId } = useParams();
  const user = useRecoilValue(getUserData({ userId }));

  // TODO: throw promise
  if (user === null) {
    return <Loading />;
  }

  return (
    <>
      <UserProfileCard {...user} />
      <EventListCard events={[]} />
    </>
  );
}

export default UserProfilePage;
