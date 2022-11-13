import { UseTabsProps } from '@chakra-ui/react';
import { Controller, Post, Req, Body } from '@nestjs/common';

import { AppService } from './app.service';

const axios = require('axios');

type Input<T> = { input: T };
type RegisterInput = Input<{ userID: UserID; eventID: EventID }>;
type setRegisterEventTicketInput = Input<{ userID: UserID; eventID: EventID; ticket: string }>;

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
    let register = await this.findEventRegistration(userID, eventID);
    return register !== null;
  }

  async findEventRegistration(userID: UserID, eventID: EventID): Promise<{ id: number, user_id: UserID, event_id: EventID, ticket: string } | null> {
    let result = await this.requestQuery<{ user_participant_event: [{ id: number, user_id: UserID, event_id: EventID, ticket: string }] }>(
      `
query {
  user_participant_event(where:{user_id:{_eq:\"${userID}\"} event_id:{_eq:${eventID}}}){
      id
      user_id
      event_id
      ticket
  }
}
`)
    if (result.user_participant_event.length != 1) {
      return null;
    }
    return result.user_participant_event[0];
  }

  async setRegisterEventTicket(userID: UserID, eventID: EventID, ticket: string): Promise<number | null> {
    let register = await this.findEventRegistration(userID, eventID);
    if (register === null) {
      return null;
    }
    let register_id = register.id;
    let result = await this.requestMutation<{ update_user_participant_event_by_pk: { id: number } | null }>(
      `
mutation {
  update_user_participant_event_by_pk(pk_columns: {id: ${register_id}} _set:{ticket:\"${ticket}\"}){
    id
  }
}
`);
    if (result.update_user_participant_event_by_pk === null) {
      return null
    }
    return result.update_user_participant_event_by_pk.id
  }


  @Post('/hasura/event/set_register_ticket')
  async SetRegisterEventTicket(
    @Body() body: setRegisterEventTicketInput
  ): Promise<{
    registration_id: number | null
  }> {
    let { input } = body;
    let { userID, eventID, ticket } = input;
    let result = await this.setRegisterEventTicket(userID, eventID, ticket);
    return {
      registration_id: result
    };
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
