CREATE TABLE IF NOT EXISTS users
(
  userid SERIAL PRIMARY KEY,
  username VARCHAR(40),
  password VARCHAR(40),
  authid VARCHAR(255)

   )
