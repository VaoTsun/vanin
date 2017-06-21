var pg = require('pg')

var dbe = {
	  "dbl" : {
		  "host" : "10.1.10.100"
		, "name" : "d7phfnujevb7sf"
		, "port" : "5432"
		, "user" : "ecebcdmrniewwx"
		, "pass" : "q"
	}
    , "db" : {
		  "host" : "ec2-54-83-43-118.compute-1.amazonaws.com"
		, "name" : "d7phfnujevb7sf"
		, "port" : "5432"
		, "user" : "ecebcdmrniewwx"
		, "pass" : "yVvbUsSu5CFULxc8PuvXL_AqD_"
	}
	, simpleQuery : function(_s,_p,_c) {return Q(_s,_p,_c);} 
};

function Q(_s,_p,callback) {
	var conString = "postgres://"+dbe.db.user+":"+dbe.db.pass+"@"+dbe.db.host+":"+dbe.db.port+"/"+dbe.db.name+"?ssl=true";
	pg.connect(conString, function(err, client, done) {
	  if(err) {
		return console.error('error fetching client from pool', err);
	  }
		dbe.result = {rows:[]};
    if (typeof(_p) !== '[object Array]') {
      _p = Array(_p);
    }
    //console.log(_p);dbe.result = _p; callback();return true;
	  client.query(_s, _p,function(err, result) {
		done();
		if(err) {
      dbe.result.rows[0] = {"ERROR":err};
		  console.error('error running query as '+dbe.db.user);
		  console.log(err);
		}
    if (dbe.result.command != 'SELECT') {
      dbe.result.rows[0] = {"SQL_STMT":dbe.result.command};
    }
    if (dbe.result.rows.length < 1) {
      dbe.result.rows[0] = {};
      for (var fi = 0; fi<dbe.result.fields.length;fi++) {
        dbe.result.rows[0][dbe.result.fields[fi].name] = 'NO_DATA';
      }
      //dbe.result = {"rows":[{"EXCEPTION":"NO_DATA"}]};
    }
    dbe.result = result;
		callback();
	  });
	});
}

module.exports = dbe;