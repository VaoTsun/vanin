select id,vardas, pavarde "pavardė" ,to_char(dob,'YYYY.MM.DD')::text "gimimo data"
, date_trunc('day',justify_interval(now() - dob))::text "amžius", added, lytis, diagnoze "diagnozė",papildoma_info "papildoma info", '' "prisegtukas"
from doc.clients 
where name like concat('%',$1::text,'%') 
;
