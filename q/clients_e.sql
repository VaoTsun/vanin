select id, vardas, pavarde,dob::text,lytis, diagnoze, papildoma_info
from doc.clients 
where id = $1 
;
