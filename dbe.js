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
	var conString = "postgres://"+dbe.db.user+":"+dbe.db.pass+"@"+dbe.db.host+":"+dbe.db.port+"/"+dbe.db.name+"?ssl=true&client_encoding=Unicode";
	pg.connect(conString, function(err, client, done) {
	  if(err) {
		return console.error('error fetching client from pool', err);
	  }
	  client.query(_s, _p,function(err, result) {
		done();
		if(err) {
		  return console.error('error running query as '+dbe.db.user, _s, err);
		}
		dbe.result = result;
		callback();
	  });
	});
}

module.exports = dbe;