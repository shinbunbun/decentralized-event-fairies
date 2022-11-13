import { UseTabsProps } from '@chakra-ui/react';
import { Controller, Post, Req, Body } from '@nestjs/common';

import { AppService } from './app.service';

const axios = require('axios');

type Input<T> = { input: T };
type RegisterInput = Input<{ userID: UserID; eventID: EventID }>;

type UserID = string;
type EventID = number;

@Controller()
export class HasuraController {
  constructor(private readonly appService: AppService) {}

  @Post('/hasura')
  async getData(@Body() body: Input<{ n: number }>): Promise<number> {
    let { input } = body;
    let { n } = input;

    await this.requestQuery<{ Events: { id: EventID } }>(
      `query { Events { id } }`
    ).then((res) => {
      console.log(res, 'desu!!!!!!!!!!!!!');
    });

    return n * 2;
  }

  @Post('/hasura/event/register')
  async registerEvent(
    @Body() body: RegisterInput
  ): Promise<{ registeredEventID: number }> {
    console.log(body);

    let { input } = body;
    let { userID, eventID } = input;

    if (!(await this.isExistsEventByID(eventID))) {
      return {
        registeredEventID: null,
      };
    }
    if (!(await this.isExistsUserByID(userID))) {
      return {
        registeredEventID: null,
      };
    }
    if (await this.alreadyRegistered(userID, eventID)) {
      return {
        registeredEventID: eventID,
      };
    }

    let registered = await this.requestMutation<{
      insert_user_participant_event_one: any;
    }>(
      `
mutation {
  insert_user_participant_event_one(object:{user_id:\"${userID}\" event_id:${eventID}}){
    id
  }
}
`
    ).then((res) => res.insert_user_participant_event_one != null);

    if (!registered) {
      return {
        registeredEventID: null,
      };
    }
    return {
      registeredEventID: eventID,
    };
  }

  async isExistsUserByID(id: UserID): Promise<boolean> {
    return this.requestQuery<{ getUser: any }>(
      `
query {
  getUser(id:"${id}") {
    id
  }
}
`
    ).then((res) => res.getUser != null);
  }

  async isExistsEventByID(id: EventID): Promise<boolean> {
    return this.requestQuery<{ getEvent: any }>(
      `
query {
  getEvent(id:${id}) {
    id
  }
}
`
    ).then((res) => res.getEvent != null);
  }

  async alreadyRegistered(userID: UserID, eventID: EventID): Promise<boolean> {
    return this.findEventRegistration(userID, eventID) !== undefined;
  }

  async findEventRegistration(userID: UserID, eventID: EventID): Promise<{ id: number, user_id: UserID, event_id: EventID }> {
    let registers = await this.registeredLists();
    return registers.find((x) => x.event_id == eventID && x.user_id == userID);
  }

  async registeredLists(): Promise<
    [{ id: number; user_id: UserID; event_id: EventID }]
  > {
    return this.requestQuery<{
      user_participant_event: [
        { id: number; user_id: UserID; event_id: EventID }
      ];
    }>(
      `
query{
  user_participant_event{
    id
    user_id
    event_id
  }
}
`
    ).then((x) => x.user_participant_event);
  }

  async requestQuery<T>(query: string): Promise<T> {
    return this.request<T>(query);
  }

  async requestMutation<T>(mutation: string): Promise<T> {
    return this.request<T>(mutation);
  }

  async request<T>(req: string): Promise<T> {
    return axios
      .post('http://localhost:8080/v1/graphql', {
        query: req,
      })
      .then((x) => x.data.data);
  }
}
