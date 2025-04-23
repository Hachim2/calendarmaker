--------------- ENUMS ---------------

--------------- TABLES ---------------

-- Profiles table
CREATE TABLE public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    email text,
    username text UNIQUE NOT NULL,
    birthdate date,
    organization text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    CONSTRAINT profiles_email_key UNIQUE (email),
    CONSTRAINT profiles_username_check CHECK (
        username ~ '^[a-zA-Z0-9_\-]{3,35}$'
    )
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);