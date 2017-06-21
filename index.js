
var express = require('express')
	, fs = require('fs')
	, pg = require('pg')
	, q = require(__dirname+'/dbe.js')
;
//var iconv = require('iconv');  
var querystring = require('querystring');
var crypto = require('crypto');


var app = express();
var types = require('pg').types
types.setTypeParser(20, function(val) {
  //remember: all values returned from the server are either NULL or a string
  return val === null ? null : parseInt(val)
})

if (process.argv[2]) {
	fs.readFile(process.argv[2],function (err, str){
		if (err) {
			console.log(err);
		}
		delete require.cache[require.resolve(process.argv[2])]
		var privateConf = require(process.argv[2]);
		q.central = privateConf.central;
	})
}


var go = {
	  "module" : ""
	, "extension" : ""
	, "cut" : {
		  "/" : "/h/index.html"
		, "/clicks" : "/h/table.html"
		, "/raindrops" : "/h/raindrops.html"
		, "/vanin" : "/h/vanin.html"
		, "/favicon.ico" : "favicon.ico"
	}
	, "localHosts" : ['10.0.1.11','127.0.0.1','10.0.36.1','10.0.64.5','10.0.36.8']
};

function showHtml(_name,res) {
	fs.readFile(_name,function (err, html){
		returnHtml(html,res);
	})
}

function returnHtml (_html,res) {//console.log(_html);
  res.charset = 'UTF8';
	res.writeHead(200, {'Content-Type': 'text/html','Content-Length':Buffer.byteLength(_html, 'utf8')});
	res.write(_html);
	res.end();
		//response.send(html);
	return null;
}

function shortLink (req,res) {
	//console.log(JSON.stringify(go));
	if ( go.module == '/proxy') {
		console.log(req.query.url,req.url);
		var request = require('request');
		request(decodeURIComponent(req.query.url), function (error, response, body) {
			  if (!error && response.statusCode == 200) {
				returnHtml (body,res);
				} else {
				returnHtml (JSON.stringify({"url":req.url,"err":error,"resp": response},null,2),res);
			  }
		});
		
		return true;
	} 
	if ( go.module == '/timestamp') {
		console.log(mq);
		var d = new Date;
		returnHtml (JSON.stringify({"ts":d.getTime(),"obj":d}),res);
		return true;
	} 
	if ( go.module == '/db') { //console.log(req.query.sm);
		fs.readFile(__dirname+'/q/'+req.query.q+'.sql',function (err, sql){
			var ks = Object.keys(req.query);
			for (var i=0;i<ks.length;i++) {
				if (ks[i] != 'q') {
					var re = new RegExp("__"+ks[i]+"__","g");
					sql = String(sql).replace(re, req.query[ks[i]]);
				}
			}
			if (err) {
				return console.log(err);
				//return returnHtml(String(err),res);
			}
			var dbe = require(__dirname+'/dbe.js'); 
			dbe.simpleQuery(String(sql),req.query.pqa,function() {/*pqa for parametrized query argument*/
				returnHtml(JSON.stringify(dbe.result,null,2),res);
				//returnHtml(dbe.result,res);
			});
		})
		return true;
	} 
	
	if ( typeof(go.cut[go.module]) != 'undefined' ) {
		return showHtml(__dirname+go.cut[go.module],res);
	} 
	returnHtml (req.url+'?.. Not sure what you want me to do... :/',res);
	return null;
}

app.set('port', (process.env.PORT || 3344));
app.use(express.static(__dirname + '/public'));

app.get('/*', function(req, res) {
	//console.log(req.connection.remoteAddress,req.headers);
	go.module = req.url.split('?')[0];
/*
	if ( go.localHosts.indexOf(req.connection.remoteAddress) < 0 && req.url != '/timestamp') {

		q.simpleQuery("insert into h_views (t,ip,headers,url) select clock_timestamp(),'"+req.connection.remoteAddress+"','"+JSON.stringify(req.headers, null,2)+"'::json ,'"+req.url+"'",null,function() {
			return null;
		});
	}
*/	
	if (String(req.url).indexOf('.') < 0 /* (|| String(req.url).split(".").length - 1) */ || String(req.url).indexOf('/proxy') > -1 || String(req.url).indexOf('/c?q=') > -1) {
		/*
		if ( req.url == '/db' ) {
			Q("select now(),* from h_views order by t desc limit 9",function() {
				//console.log(JSON.stringify(go.db.rslt, null,2));
				returnHtml (JSON.stringify(go.db.rslt, null,2),res)
			});
		}
		*/
		shortLink (req,res);
		return null;
		} else {
		go.extension = req.url.split('.')[req.url.split('.').length-1];
	
	
		var extension = req.url.split('.')[req.url.split('.').length-1];
		var permit = false;

		if (['gif','png','jpg','jpeg'].indexOf(extension) >-1 ) {
			var type = 'image/'+extension;
			var bin = 'binary';
			permit = true;
		}
		if (extension == 'html' ) {
			var type = 'text/'+extension;
			var bin = '';
			permit = true;
		}
		if ((extension == 'js' || extension == 'json') && ['/index.js','/gr.js','/config.js','/classifiers.json'].indexOf(req.url) < 0) {
			var type = 'application/javascript';
			var bin = '';
			permit = true;
		}
		if ( permit == true ) {
			fs.readFile(__dirname+'/'+req.url,function (err, data){
				console.log(err);
				if (data) {
					if (type == 'application/javascript') {
						data=String(data);
					}
					res.writeHead(200, {'Content-Type': type,'Content-Length':data.length});
					res.end(data, bin);
// 					/console.log(data);
					return true;
					} else {
					res.end('file' + req.url+' not found... And you what expected?..');
				}
			})
			return true;
			} else {
			returnHtml (req.url+'?.. What you want me to do?.. :/',res)
			return null;
		}
	}
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

