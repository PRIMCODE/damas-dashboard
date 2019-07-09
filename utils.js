(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals
        root.ui_upload = factory();
    }
}(this, function () {

/**
 * Get a multiline text description of the element
 * @return {string} the text string of the element compound of its label, tags
 * and keys/values pairs, with \n carriage returns as line separators.
 */
JSON_tooltip = function ( obj )
{
    var text = '';
    var keys = Object.keys(obj).sort();
    for (i = 0; i < keys.length ; i++){
        text += " (" + typeof obj[keys[i]] + ") " + keys[i] + "  : " + obj[keys[i]];
        if (i !== keys.length - 1) {
            text += '\n';
        }
    }
    return text;
}

/**
 * Take care of the connection, on top of damas.js. The token is stored in the
 * localStorage.
 * @param {string} server_url
 * @param {function} callback 
 *
 */
damas_connect = function (server_url, callback)
{
    damas.server = server_url;
    if (localStorage){
        damas.token = localStorage.getItem("token");
        document.cookie = "token="+damas.token;
        damas.user = JSON.parse(localStorage.getItem("user"));
    }
    damas.verify(callback);
}

function loadCss(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

window.loadCss = loadCss;



function getHash() {
    if(!window.location.hash) return {};
    var hash = window.location.hash.slice(1);
    var array = hash.split("&");
    var result = {};
    for (var i = 0; i < array.length; i += 1) {
        var key = array[i].split("=");
        result[key[0]] = key[1];
    }
    return(result);
}

function doHash( obj ) {
    var arr = [];
    for (key in obj) {
        arr.push(key + '=' + obj[key]);
    }
    window.location.hash = arr.join('&');
}

window.getHash = getHash;
window.doHash = doHash;


human_size = function ( filesize )
{
    var t = typeof filesize;
    if( !( t === 'number' || t === 'string') )
        return "? Bytes";
    if (filesize>1024*1024*1024*1024)
        return (filesize/1024/1024/1024/1024).toFixed(2) + " TiB";
    if (filesize>1024*1024*1024)
        return (filesize/1024/1024/1024).toFixed(2) + " GiB";
    if (filesize>1024*1024)
        return (filesize/1024/1024).toFixed(2) + " MiB";
    if (filesize>1024)
        return (filesize/1024).toFixed(2) + " KiB";
    return filesize + " Bytes";
}

// dd/mm/yy hh:mm:ss
human_time = function ( time )
{
	if(time['getDate'] === undefined) return '??/??/?? ??:??:??';
    return ('00'+time.getDate()).slice(-2)+'/'+('00'+(time.getMonth()+1)).slice(-2)+'/'+('00'+(time.getYear())).slice(-2)+' '+('00'+time.getHours()).slice(-2)+':'+('00'+time.getMinutes()).slice(-2)+':'+('00'+time.getSeconds()).slice(-2);
}

html_time = function ( time )
{
	if(time['getDate'] === undefined) return '<span class="nomobile">??/??/?? </span>??:??:??';
    return '<span class="nomobile">'+('00'+time.getDate()).slice(-2)+'/'+('00'+(time.getMonth()+1)).slice(-2)+'/'+('00'+(time.getYear())).slice(-2)+' </span>'+('00'+time.getHours()).slice(-2)+':'+('00'+time.getMinutes()).slice(-2)+':'+('00'+time.getSeconds()).slice(-2);
}

human_filename_txt = function ( file )
{
	return '<span class="nomobile">'+file.split('/').slice(0,-1).join('/')+'/</span>'+file.split('/').pop();
}

human_filename_href = function ( file )
{
	// we want a real link to the file while firing the viewer when clicked
	var a = document.createElement('a');
	a.setAttribute('href', '/api/file'+file);
	a.addEventListener('click', function(e){
		e.preventDefault()
		window.location.hash = '#view='+file;
	});
	var path = document.createElement('span');
	path.className = 'nomobile';
	a.appendChild(path);

	if (file[file.length-1] === '/') {
		path.innerHTML = file.split('/').slice(0,-2).join('/')+'/';
		a.innerHTML += file.split('/').slice(-2,-1)+'/';
	}
	else {
		path.innerHTML = file.split('/').slice(0,-1).join('/')+'/';
		a.innerHTML += file.split('/').pop();
	}
	return a;
}


	showTimeline = function ( file ) {
		var m = conf.syncKeys.map(function(sk){return sk.replace('synced_','modified_');});
		var keys = conf.syncKeys.concat( ['time', 'file_mtime'] );
		var keys2 = m.concat(keys);
		console.log(keys);
		console.log(keys2);
		//var keysSorted = Object.keys(file).sort(function(a,b){return file[a],file[b]});

	}

}));


