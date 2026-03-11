CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('employer', 'worker')),
  location text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (LOWER(email));

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  location text NOT NULL DEFAULT 'Remote',
  pay text NOT NULL DEFAULT 'Negotiable',
  salary text,
  type text NOT NULL DEFAULT 'Full-Time' CHECK (type IN ('Full-Time', 'Part-Time', 'Contract', 'Gig', 'Live-In', 'Temporary')),
  posted_by text,
  requirements text[] NOT NULL DEFAULT '{}',
  contact_whatsapp text,
  employer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS jobs_created_at_idx ON jobs (created_at DESC);
CREATE INDEX IF NOT EXISTS jobs_location_idx ON jobs (location);
CREATE INDEX IF NOT EXISTS jobs_category_idx ON jobs (category);
CREATE INDEX IF NOT EXISTS jobs_type_idx ON jobs (type);

CREATE TABLE IF NOT EXISTS worker_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  service text NOT NULL,
  location text NOT NULL,
  bio text NOT NULL DEFAULT '',
  experience text NOT NULL DEFAULT '',
  skills text[] NOT NULL DEFAULT '{}',
  phone text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  rating numeric(3,2) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  jobs_done integer NOT NULL DEFAULT 0 CHECK (jobs_done >= 0),
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS worker_profiles_location_idx ON worker_profiles (location);
CREATE INDEX IF NOT EXISTS worker_profiles_service_idx ON worker_profiles (service);
