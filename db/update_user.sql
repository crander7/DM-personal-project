UPDATE users
SET name = $1, type = $2
WHERE fb_id = $3;
