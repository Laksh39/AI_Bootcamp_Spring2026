/*
  # Create progress tracking table

  1. New Tables
    - `progress`
      - `id` (uuid, primary key)
      - `user_id` (text, unique identifier for device/browser)
      - `mission_day` (integer, 1-15)
      - `completed` (boolean)
      - `signed` (boolean)
      - `tool` (text, null or 'Claude'/'Gemini'/'Pi')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `progress` table
    - Add policy for users to read/write their own progress by user_id
*/

CREATE TABLE IF NOT EXISTS progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  mission_day integer NOT NULL CHECK (mission_day >= 1 AND mission_day <= 15),
  completed boolean DEFAULT false,
  signed boolean DEFAULT false,
  tool text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, mission_day)
);

ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON progress FOR SELECT
  USING (auth.uid()::text = user_id OR user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can insert own progress"
  ON progress FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can update own progress"
  ON progress FOR UPDATE
  USING (auth.uid()::text = user_id OR user_id = current_setting('app.user_id', true))
  WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can delete own progress"
  ON progress FOR DELETE
  USING (auth.uid()::text = user_id OR user_id = current_setting('app.user_id', true));

CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_progress_mission_day ON progress(mission_day);
