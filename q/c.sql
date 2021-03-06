select distinct clients.id,vardas, pavarde "pavardė" ,count(visits.*) over (partition by client) as "vizitai", to_char(dob,'YYYY.MM.DD')::text "gimimo data"
, date_trunc('day',justify_interval(now() - dob))::text "amžius", added, lytis, diagnoze "diagnozė",papildoma_info "papildoma info", '' "prisegtukas"
from doc.clients 
left outer join doc.visits on visits.client = clients.id
where (vardas like concat('%',$1::text,'%') or pavarde like concat('%',$1::text,'%') )
and clients.id > 0
order by 1
;
