import { faker } from '@faker-js/faker';

export interface EventData {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  start: Date;
  end: Date;
}

export const createEventData = (): EventData => ({
  id: faker.datatype.uuid(),
  title: faker.lorem.words(),
  thumbnail: faker.image.nature(),
  description: faker.lorem.paragraphs(),
  start: faker.date.recent(),
  end: faker.date.soon(),
});

export interface UserData {
  id: string;
  name: string;
  photo: string;
  events: EventData[];
}

export const createUserData = (): UserData => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  photo: faker.image.avatar(),
  events: faker.datatype.array().map(() => createEventData()),
});
