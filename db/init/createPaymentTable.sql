CREATE TABLE IF NOT EXISTS Payment(
  paymentId SERIAL PRIMARY KEY,
  name VARCHAR(50),
  amount VARCHAR(50),
  date VARCHAR(50),
  userid INTEGER REFERENCES users (userid)
)
