#!/usr/bin/env bash

sql=$(cat 01-database.sql | sed -z 's/\n/ /g')
echo "$sql"

curl -X POST http://localhost:8080/v2/query \
     -H 'Content-Type: application/json' \
     -H 'X-Hasura-Role: admin' \
     -d ' { "type": "run_sql", "args": { "source": "test_database_dayo", "sql": "'"$sql"'" } } ' \

echo
echo
echo
echo

curl -X POST http://localhost:8080/v1/metadata \
     -H 'Content-Type: application/json' \
     -H 'X-Hasura-Role: admin' \
     -d '
     {
         "type": "pg_track_table",
         "args": {
             "source": "test_database_dayo",
             "table": "users",
             "configuration": {
                 "custom_root_fields": {
                     "select": "Users",
                     "select_by_pk": "getUser",
                     "select_aggregate": "UserAggregate",
                     "insert": "createUsers",
                     "insert_one":"createUser",
                     "update": "updateUsers",
                     "update_by_pk": "updateUser",
                     "delete": "deleteUsers",
                     "delete_by_pk": "deleteUser"
                 }
             }
         }
     }
     '
echo

curl -X POST http://localhost:8080/v1/metadata \
     -H 'Content-Type: application/json' \
     -H 'X-Hasura-Role: admin' \
     -d '
     {
         "type": "pg_track_table",
         "args": {
             "source": "test_database_dayo",
             "table": "events",
             "configuration": {
                 "column_config": {
		     "start_time": {
	                 "custom_name": "start"
         	     },
         	     "end_time": {
         	         "custom_name": "end"
         	     }
                 },
                 "custom_root_fields": {
                     "select": "Events",
                     "select_by_pk": "getEvent",
                     "select_aggregate": "EventAggregate",
                     "insert": "createEvents",
                     "insert_one":"createEvent",
                     "update": "updateEvents",
                     "update_by_pk": "updateEvent",
                     "delete": "deleteEvents",
                     "delete_by_pk": "deleteEvent"
                 }
	     }
	 }
     }
     '
echo

curl -X POST http://localhost:8080/v1/metadata \
     -H 'Content-Type: application/json' \
     -H 'X-Hasura-Role: admin' \
     -d '
     {
         "type": "pg_track_table",
         "args": {
             "source": "test_database_dayo",
             "table": "user_admin_event"
         }
     }
     '
echo


curl -X POST http://localhost:8080/v1/metadata \
     -H 'Content-Type: application/json' \
     -H 'X-Hasura-Role: admin' \
     -d '
     {
         "type": "pg_track_table",
         "args": {
             "source": "test_database_dayo",
             "table": "user_participant_event"
         }
     }
     '
echo

curl -X POST http://localhost:8080/v1/metadata \
     -d '
{
  "type": "pg_create_object_relationship",
  "args": {
    "source": "test_database_dayo",
    "table": "user_admin_event",
    "name": "admin",
    "using": {
      "foreign_key_constraint_on" : "user_id"
    }
  }
}'
echo


curl -X POST http://localhost:8080/v1/metadata \
     -d '
{
  "type": "pg_create_array_relationship",
  "args": {
    "source": "test_database_dayo",
    "table": "events",
    "name": "event_admins",
    "using": {
      "foreign_key_constraint_on" : {
        "table": "user_admin_event",
        "column": "event_id"
      }
    }
  }
}'
echo


curl -X POST http://localhost:8080/v1/metadata \
     -d '
{
  "type": "pg_create_object_relationship",
  "args": {
    "source": "test_database_dayo",
    "table": "user_participant_event",
    "name": "participant",
    "using": {
      "foreign_key_constraint_on" : "user_id"
    }
  }
}'
echo


curl -X POST http://localhost:8080/v1/metadata \
     -d '
{
  "type": "pg_create_array_relationship",
  "args": {
    "source": "test_database_dayo",
    "table": "events",
    "name": "event_participants",
    "using": {
      "foreign_key_constraint_on" : {
        "table": "user_participant_event",
        "column": "event_id"
      }
    }
  }
}'
echo


curl -X POST http://localhost:8080/v1/metadata \
     -d '
{
  "type": "pg_create_array_relationship",
  "args": {
    "source": "test_database_dayo",
    "table": "users",
    "name": "user_participated_events",
    "using": {
      "foreign_key_constraint_on" : {
        "table": "user_participant_event",
        "column": "user_id"
      }
    }
  }
}'
echo
