#!/usr/bin/env bash

curl -X POST http://localhost:8080/v1/metadata \
     -H 'Content-Type: application/json' \
     -H 'X-Hasura-Role: admin' \
     -d '
{
  "type": "pg_add_source",
  "args": {
    "name": "test_database_dayo",
    "configuration": {
      "connection_info": {
        "database_url": {
          "from_env": "PG_DATABASE_URL"
        },
        "pool_settings": {
          "retries": 1,
          "idle_timeout": 180,
          "max_connections": 50
        }
      }
    }
  }
}
'
