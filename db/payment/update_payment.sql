UPDATE
SET
name = COALESCE($2, name),
amount = COALESCE($3, amount),
date = COALESCE($4, date),
userid = COALESCE($5, userid)

WHERE paymentId = $1
RETURNING *;
