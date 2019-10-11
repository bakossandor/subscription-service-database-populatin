CREATE TABLE newsletters(
   id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
   user_id uuid NOT NULL,
   name VARCHAR (128) NOT NULL,
   created_on TIMESTAMPTZ NOT NULL DEFAULT now(),
   uri TEXT UNIQUE NOT NULL,
   subs_total_num INTEGER DEFAULT 0,
   FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);