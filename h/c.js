﻿var v = {
	wa: {"UtfFound":false}
	, gets: {}
};

function parseGet() {
        var vars= {};
        if(window.location.search.length!==0)
            window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value){
                key=decodeURIComponent(key);
                if(typeof vars[key]==="undefined") {vars[key]= decodeURIComponent(value);}
                else {vars[key]= [].concat(vars[key], decodeURIComponent(value));}
            });
        v.gets = vars;
        return vars;
};

parseGet();

function loadJSON(path, success, error, app) {
	var xhr = new XMLHttpRequest();
	if (path.substr(0,4) != 'http') {
		path = window.location.origin + path;
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				if (success) {
					var json = IsJsonString(xhr.responseText);
					//console.log(d);
					var d = json.obj;
						success(d,app);
				}
			} else {
				if (error)
					error(xhr);
			}
		}
	};
	xhr.open("GET", path, true);
	xhr.send();
}

function IsJsonString(str) {
	var m = new Object({"exc" : "not json","string":str,"obj":{}});
    try {
        var r = JSON.parse(str);
    } catch (e) {
    	console.log(m);
        return m;
    }
    return new Object({"obj":r,"string":JSON.stringify(str,null,2)});
}

function clients() {
	loadJSON(
		"/db?q=c&pqa=%"
		, function (e) {
				var k = Object.keys(e.rows);
				var h = '<table>';
				for (var i=0;i<e.rows.length;i++) {
					h += '<tr title="' 
            + e.rows[i].added+'"><td>' 
            + e.rows[i]["id"]+'</td><td>' 
						+ e.rows[i]["vardas"]+'</td><td>' 
						+ e.rows[i]["pavardė"]+'</td><td>' 
						+ e.rows[i]["gimimo data"]+'</td><td>' 
						+ e.rows[i]["amžius"]+'</td>'
						+ e.rows[i]["lytis"]+'</td>'					
						+ e.rows[i]["diagnozė"]+'</td>'
						+ e.rows[i]["papildoma info"]+'</td>'
						+ e.rows[i]["prisegtukas"]+'</td>'
            + '</tr>';
				}
				h += '</table>';
				document.getElementById("l").innerHTML = h;
				//console.log(e);
			}
		, null
		, null
	);
  return null;
}



