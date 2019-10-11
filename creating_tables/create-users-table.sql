CREATE TABLE users(
   id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
   password VARCHAR (128) NOT NULL,
   first_name VARCHAR (64) NOT NULL,
   last_name VARCHAR (64) NOT NULL,
   email VARCHAR (254) UNIQUE NOT NULL,
   created_on TIMESTAMPTZ NOT NULL DEFAULT now(),
   privilege VARCHAR (10) NOT NULL DEFAULT 'user'
);