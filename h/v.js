var v = {
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
  var k = v.gets.like;
  k = k || '%';
	loadJSON(
		"/db?q=c&pqa="+k
		, function (e) {
				var k = Object.keys(e.rows);
				var h = '<table>';
        h += '<tr style="background-color: grey;"><td ><a href="e?id=0&rel=clients" style="background-color:white;font-size:14px;">&#8478;</a></td><td>vardas</td><td>pavardė</td><td>vizitai</td>'
          + '<td>gimimo data</td><td>amžius</td><td>lytis</td><td>diagnozė</td><td>papildoma info</td><td><img src="skrepka.jpg" style="width:20px;"></td></tr>';
				for (var i=0;i<e.rows.length;i++) {
					h += '<tr title="' 
            + e.rows[i].added+'"><td><a href="e?id='+e.rows[i]["id"]+'&rel=clients" style="background-color:white;font-size:12px;">' 
            + e.rows[i]["id"]+'</a></td><td>' 
						+ e.rows[i]["vardas"]+'</td><td>' 
						+ e.rows[i]["pavardė"]+'</td>' 
              + '<td><a href="?rel=visits&cid='+e.rows[i]["id"]+'&like='+v.gets.like+'" style="font-size:14px;color:white;">' 
              + e.rows[i]["vizitai"]+'</a></td><td>' 
						+ e.rows[i]["gimimo data"]+'</td><td>' 
						+ e.rows[i]["amžius"]+'</td><td>'
						+ e.rows[i]["lytis"]+'</td><td>'					
						+ e.rows[i]["diagnozė"]+'</td><td>'
						+ e.rows[i]["papildoma info"]+'</td><td>'
						+ e.rows[i]["prisegtukas"]+'</td>'
            + '</tr>';
				}
				h += '</table>';
				document.getElementById("tbl").innerHTML = h;
				//console.log(e);
				//console.log(h);
			}
		, null
		, null
	);
}


