create schema doc;
--alter user
DROP TABLE  doc.clients cascade;
--pavardė vardas, gimimo data, автоматом дает его amžius, lytis, diagnozė, papildoma info и prisegtukas
create table doc.clients(id serial primary key, added timestamptz default now(), vardas text, pavarde text, dob date, lytis text, diagnoze text, papildoma_info text);
--
DROP TABLE  doc.visits cascade;
create table doc.visits (id serial, client int references doc.clients(id), dov date/* date of visit*/ default now(), weight float, height float, kkal int, fiz_act int, tsf int, mac int, ssf int,humetus int, femur int);


drop table doc.clients;
drop table doc.visits;

insert into doc.clients (name,dob) select 'Ania','2000-09-19';
insert into doc.clients (name,dob) select /*'Ваня'*/,'1975-04-09';
insert into doc.visits (client,weight,height, kkal, fiz_act, tsf, mac) select 1,39,148,1689,3,34,96;

select id,name,dob, date_trunc('day',justify_interval(now() - dob)) amzius
from doc.clients


select id,name "name:utf",dob, date_trunc('day',justify_interval(now() - dob)) amzius
from doc.clients


insert into doc.clients (name) select 'Ваня';


show server_encoding;
set client_encoding to 'UTF8';

select * from doc.clients
insert into doc.clients(name) select 'Ваня'

select id,name ,to_char(dob,'YYYY.MM.DD')::text dob, date_trunc('day',justify_interval(now() - dob))::text amzius 
from doc.clients 
where 'd' <> '' 
and name like concat('%','аня','%')
;

create table doc.c as select * from doc.clients






create or replace function doc.update(rel text,att text,val text,id int) returns json as 
$$
declare
begin
        execute format ('update doc.%I set %I = %L where id = %s',rel,att,val,id);
        RETURN '{}';
end;
$$ language plpgsql
;
