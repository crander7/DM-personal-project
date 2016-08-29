select bottom as from, top as to, plus, rate_val as rate
from brackets as b
join tax_rates as tr
on tr.tax_rates_id = b.rate_id
join file_status as fs
on fs.file_status_id = b.status_id
where fs.status = $1;
