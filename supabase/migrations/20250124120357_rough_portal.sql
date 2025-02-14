/*
  # Security Guard Tour Tracking Schema

  1. New Tables
    - guards
      - id (uuid, primary key)
      - email (text, unique)
      - name (text)
      - created_at (timestamp)
    
    - checkpoints
      - id (uuid, primary key)
      - name (text)
      - nfc_id (text, unique)
      - location (text)
      - sequence (integer)
      - expected_time (time)
      - created_at (timestamp)
    
    - checkpoint_scans
      - id (uuid, primary key)
      - guard_id (uuid, references guards)
      - checkpoint_id (uuid, references checkpoints)
      - timestamp (timestamp)
      - location (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated guards
*/

-- Create guards table
CREATE TABLE IF NOT EXISTS guards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create checkpoints table
CREATE TABLE IF NOT EXISTS checkpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  nfc_id text UNIQUE NOT NULL,
  location text NOT NULL,
  sequence integer NOT NULL,
  expected_time time NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create checkpoint_scans table
CREATE TABLE IF NOT EXISTS checkpoint_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guard_id uuid REFERENCES guards(id) NOT NULL,
  checkpoint_id uuid REFERENCES checkpoints(id) NOT NULL,
  timestamp timestamptz NOT NULL,
  location text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE guards ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkpoint_scans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Guards can view their own data"
  ON guards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Guards can view all checkpoints"
  ON checkpoints
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Guards can insert their own scans"
  ON checkpoint_scans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = guard_id);

CREATE POLICY "Guards can view their own scans"
  ON checkpoint_scans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = guard_id);