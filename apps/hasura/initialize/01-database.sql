CREATE TABLE IF NOT EXISTS public.users(
       id TEXT PRIMARY KEY,
       name TEXT NOT NULL,
       email TEXT NOT NULL,
       image TEXT NULL
);

CREATE TABLE IF NOT EXISTS public.events(
       id SERIAL PRIMARY KEY,
       title TEXT NOT NULL,
       start_time DATE NOT NULL,
       end_time DATE NOT NULL,
       description TEXT NULL,
       thumbnail TEXT NULL
);

CREATE TABLE IF NOT EXISTS public.user_admin_event(
       id SERIAL PRIMARY KEY,
       user_id  TEXT REFERENCES public.users(id) NOT NULL,
       event_id INTEGER REFERENCES public.events(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_participant_event(
       id SERIAL PRIMARY KEY,
       user_id TEXT REFERENCES public.users(id) NOT NULL,
       event_id INTEGER REFERENCES public.events(id) NOT NULL,
       ticket TEXT NULL,
);
