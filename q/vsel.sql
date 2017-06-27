select visits.*, mac-(3.1416 * TSF) mamc
, case 
  when tsf >= tsp.p5  and tsf < tsp.p10 then  'p5: >='||tsp.p5 
  when tsf >= tsp.p10 and tsf < tsp.p25 then 'p10: >='||tsp.p10 
  when tsf >= tsp.p25 and tsf < tsp.p50 then 'p25: >='||tsp.p25 
  when tsf >= tsp.p50 and tsf < tsp.p75 then 'p50: >='||tsp.p50 
  when tsf >= tsp.p75 and tsf < tsp.p90 then 'p75: >='||tsp.p75 
  when tsf >= tsp.p90 and tsf < tsp.p95 then 'p90: >='||tsp.p90 
  when tsf >= tsp.p95 then 'p95: >'||tsp.p95
  ELSE 'No match'
  END "tsfp"
from doc.visits 
join doc.clients on client = clients.id
join doc.tsp on tsp.lytis = clients.lytis and date_part('year',justify_interval(now() - dob)) >= tsp.nuo and date_part('year',justify_interval(now() - dob)) < tsp.iki
where client = $1
and visits.id > 0
order by visits.id
;