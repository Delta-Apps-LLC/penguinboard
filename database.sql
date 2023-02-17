-- TABLES

CREATE TABLE "user"
(
  "userid" SERIAL NOT NULL,
  "firstname" VARCHAR NOT NULL,
  "lastname" VARCHAR NOT NULL,
  "email" VARCHAR NOT NULL,
  "password" VARCHAR NOT NULL,
  "avatar" VARCHAR,
  PRIMARY KEY ("userid"),
  UNIQUE ("email")
);

CREATE TABLE "board"
(
  "boardid" SERIAL NOT NULL,
  "title" VARCHAR NOT NULL,
  "recipientemail" VARCHAR NOT NULL,
  "recipientname" VARCHAR NOT NULL,
  "link" VARCHAR NOT NULL,
  "sender" VARCHAR,
  "sent" BOOLEAN NOT NULL DEFAULT false,
  "expiration" VARCHAR NOT NULL DEFAULT '0',
  "image" VARCHAR,
  "ispublic" BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY ("boardid"),
  UNIQUE ("link")
);

CREATE TABLE "post"
(
  "postid" SERIAL NOT NULL,
  "message" VARCHAR NOT NULL,
  "from" VARCHAR NOT NULL,
  "gif" VARCHAR,
  "boardid" INT NOT NULL,
  PRIMARY KEY ("postid"),
  FOREIGN KEY ("boardid") REFERENCES "board"("boardid") ON DELETE CASCADE
);

CREATE TABLE "reset_code"
(
  "codeid" SERIAL NOT NULL,
  "code" VARCHAR NOT NULL,
  "codeemail" VARCHAR NOT NULL,
  "codeexpiration" VARCHAR NOT NULL,
  PRIMARY KEY ("codeid"),
  UNIQUE ("code")
);

-- VIEWS
create or replace view get_user_data as
	select * from "user";

create or replace view get_managed_boards as
	select * from board where sent = false;

create or replace view get_my_boards as
	select * from board where sent = true;

create or replace view get_board_posts as
	select p.postid, p.message, p.boardid, p.from, p.gif, b.link
	from post p inner join board b
	on p.boardid = b.boardid;

create or replace view get_board_data as
	select * from board;

create or replace view get_public_boards as
	select * from board 
	where ispublic = true and sent = false
	order by recipientname asc;

-- ROLES, GRANTS

CREATE ROLE authenticator NOINHERIT;
CREATE ROLE admins;
CREATE ROLE anonymous;

GRANT anonymous, admins TO authenticator;

GRANT USAGE, UPDATE, SELECT ON SEQUENCE reset_code_codeid_seq TO anonymous;
GRANT USAGE ON SEQUENCE post_postid_seq TO anonymous;
GRANT SELECT, UPDATE ON ALL TABLES IN SCHEMA public TO anonymous;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admins;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admins;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO admins;

GRANT EXECUTE ON FUNCTION
  login(varchar, varchar),
  signup(varchar, varchar, varchar, varchar)
  TO anonymous;
-- 

-- FUNCTIONS

-- Setup JWT generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TYPE IF EXISTS jwt_token CASCADE;
CREATE TYPE jwt_token AS (
  token text
);

CREATE OR REPLACE FUNCTION url_encode(data bytea) RETURNS text LANGUAGE sql AS $$
    SELECT translate(encode(data, 'base64'), E'+/=\n', '-_');
$$;

CREATE OR REPLACE FUNCTION algorithm_sign(signables text, secret text, algorithm text)
RETURNS text LANGUAGE sql AS $$
WITH
  alg AS (
    SELECT CASE
      WHEN algorithm = 'HS256' THEN 'sha256'
      WHEN algorithm = 'HS384' THEN 'sha384'
      WHEN algorithm = 'HS512' THEN 'sha512'
      ELSE '' END AS id)
SELECT url_encode(hmac(signables, secret, alg.id)) FROM alg;
$$;

CREATE OR REPLACE FUNCTION sign(payload json, secret text, algorithm text DEFAULT 'HS256')
RETURNS text LANGUAGE sql AS $$
WITH
  header AS (
    SELECT url_encode(convert_to('{"alg":"' || algorithm || '","typ":"JWT"}', 'utf8')) AS data
    ),
  payload AS (
    SELECT url_encode(convert_to(payload::text, 'utf8')) AS data
    ),
  signables AS (
    SELECT header.data || '.' || payload.data AS data FROM header, payload
    )
SELECT
    signables.data || '.' ||
    algorithm_sign(signables.data, secret, algorithm) FROM signables;
$$;
--

CREATE OR REPLACE FUNCTION
public.signup(email varchar, "password" varchar, firstname varchar, lastname varchar) RETURNS VOID
AS $$
  INSERT INTO "user" (email, "password", firstname, lastname) VALUES
    (signup.email, signup.password, signup.firstname, signup.lastname);
$$ LANGUAGE sql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION
public.login(email varchar, "password" varchar) RETURNS jwt_token
  LANGUAGE plpgsql SECURITY DEFINER
  AS $$
DECLARE
  _role NAME;
  result jwt_token;
BEGIN
  SELECT "user".userid FROM "user" WHERE "user".email=login.email AND "user".password=login.password INTO _role;
  IF _role IS NULL THEN
    RAISE invalid_password USING message = 'invalid user or password';
  END IF;

  SELECT sign(
      row_to_json(r), current_setting('app.settings.jwt_secret')
    ) AS token
    from (
      SELECT 'admins' AS role, login.email AS email, _role AS user_id,
         extract(epoch from now())::integer + 3600*60*60 as exp
    ) r
    INTO result;

  RETURN result;
END;
$$