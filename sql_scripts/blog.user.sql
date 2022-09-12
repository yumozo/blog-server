CREATE TABLE user_account (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE,
  email VARCHAR(30) UNIQUE,
  password_hash VARCHAR(32) NOT NULL,
  registration_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMPTZ,
  bio VARCHAR
);