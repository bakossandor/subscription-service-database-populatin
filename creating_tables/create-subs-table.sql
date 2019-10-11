CREATE TABLE subscribers(
   id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
   newsletter_id uuid NOT NULL,
   first_name VARCHAR (64),
   last_name VARCHAR (64),
   email VARCHAR (254) NOT NULL,
   created_on TIMESTAMPTZ NOT NULL DEFAULT now(),
   FOREIGN KEY (newsletter_id) REFERENCES newsletters(id) ON DELETE CASCADE,
   UNIQUE (newsletter_id, email)
);