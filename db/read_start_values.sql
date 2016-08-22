SELECT limit_name AS name, limit_value AS value
FROM tax_limits
UNION
SELECT std_deduction_name, std_deduction
FROM std_deductions as sd
JOIN file_status as fs
ON fs.file_status_id = sd.status_id
WHERE fs.status = $1;
