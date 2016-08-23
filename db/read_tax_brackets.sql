SELECT rate_val AS rate, plus, bottom
FROM tax_rates AS tr
JOIN brackets AS b
ON b.rate_id = tr.tax_rates_id
JOIN file_status as fs ON b.status_id = fs.file_status_id
WHERE $1 BETWEEN bottom AND top
AND fs.status = $4
UNION ALL
SELECT rate_val as rate, plus, bottom
FROM tax_rates AS tr
JOIN brackets AS b
ON b.rate_id = tr.tax_rates_id
JOIN file_status as fs
ON b.status_id = fs.file_status_id
WHERE $2 BETWEEN bottom AND top
AND fs.status = $4
UNION ALL
SELECT rate_val as rate, plus, bottom
FROM tax_rates AS tr
JOIN brackets AS b
ON b.rate_id = tr.tax_rates_id
JOIN file_status as fs
ON b.status_id = fs.file_status_id
WHERE $3 BETWEEN bottom AND top
AND fs.status = $4;
