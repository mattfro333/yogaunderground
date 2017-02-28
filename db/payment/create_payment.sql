INSERT INTO Payment
(name, amount, date, userid)
VALUES
($1, $2, $3, $4)
RETURNING *;
