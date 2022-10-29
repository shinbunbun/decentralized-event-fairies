import { faker } from '@faker-js/faker';

import { UserProfileCard } from '../components/UserProfileCard';

interface UserData {
  name: string;
  photo: string;
}

function UserProfilePage() {
  const data: UserData = {
    name: faker.name.fullName(),
    photo: faker.image.avatar(),
  };

  return <UserProfileCard {...data} />;
}

export default UserProfilePage;
