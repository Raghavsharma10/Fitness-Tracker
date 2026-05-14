-- Run this against your Neon (or any PostgreSQL) database when using DATABASE_URL.
-- Example: psql "$DATABASE_URL" -f scripts/schema.sql

CREATE TABLE IF NOT EXISTS progress_records (
  user_id TEXT NOT NULL,
  program_type TEXT NOT NULL,
  program_id TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, program_type, program_id, metric_name)
);

CREATE INDEX IF NOT EXISTS idx_progress_records_user_program
  ON progress_records (user_id, program_type, program_id);
