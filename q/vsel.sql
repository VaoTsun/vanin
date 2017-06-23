select *, mac-(3.1416 * TSF) mamc
from doc.visits 
where client = $1
and id > 0
order by id
;
