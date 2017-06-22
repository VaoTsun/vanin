select *
from doc.visits 
where client = $1
and id > 0
order by id
;
