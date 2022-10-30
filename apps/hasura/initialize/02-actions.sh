#!/usr/bin/env bash

echo DEFINING ACTIONS!!!!!!!!!

echo '####' define custom type for output
curl -X POST localhost:8080/v1/metadata \
    -H 'Content-Type: application/json' \
    -H 'X-Hasura-Role: admin' \
    -d '
{
    "type": "set_custom_types",
    "args": {
        "scalars": [],
        "enums": [],
        "input_objects": [],
        "objects": [
            {
                "name": "RegisterEventOutput",
                "fields": [
                    {
                        "name": "registeredEventID",
                        "type": "Int"
                    }
                ]
            }
        ]
    }
}
'
echo
echo
echo



echo '####' define custom types relations ships
curl -X POST localhost:8080/v1/metadata \
    -H 'Content-Type: application/json' \
    -H 'X-Hasura-Role: admin' \
    -d '
{
    "type": "set_custom_types",
    "args": {
        "scalars": [],
        "enums": [],
        "input_objects": [],
        "objects": [
            {
                "name": "RegisterEventOutput",
                "fields": [
                    {
                        "name": "registeredEventID",
                        "type": "Int"
                    }
                ],
                "relationships": [
                    {
                        "name": "registeredEvent",
                        "type": "object",
                        "remote_table": "events",
                        "field_mapping": {
                            "registeredEventID": "id"
                        }
                    }
                ]
            }
        ]
    }
}
'
echo
echo
echo


echo '####' define register action handler
curl -X POST localhost:8080/v1/metadata \
    -H 'Content-Type: application/json' \
    -H 'X-Hasura-Role: admin' \
    -d '
{
    "type":"create_action",
    "args":{
        "name":"register",
        "definition":{
            "kind":"synchronous",
            "type":"mutation",
            "arguments":[
                {
                    "name":"userID",
                    "type":"String!"
                },
                {
                    "name":"eventID",
                    "type":"ID!"
                }
            ],
            "output_type":"RegisterEventOutput!",
            "handler":"{{ACTION_BASE_URL}}/event/register",
            "timeout":60
        }
    }
}
'
echo
echo
echo
