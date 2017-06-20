
var sql = "select id,name ,to_char(dob,'YYYY.MM.DD')::text dob, date_trunc('day',justify_interval(now() - dob))::text amzius from doc.clients where name like $1 or true"
var sql = "select setting,$1::text,c.name from pg_settings s join doc.clients c on true where s.name = 'client_encoding' and c.name not like '%nia'"

var _p = Array('Ваня');			
      
      var dbe = require(__dirname+'/dbe.js');
			dbe.simpleQuery(String(sql),_p,function() {
				//console.log(dbe.result);
				if (dbe.result.command != 'SELECT') {
					dbe.result.rows[0] = {"SQL_STMT":dbe.result.command};
				}

				var k = Object.keys(dbe.result.rows[0]);
			
				console.log(JSON.stringify(dbe.result,null,2));
			});

