INSERT INTO Payment
(amount, date, userid)
VALUES
($1, $2, $3)
RETURNING *;
