require.config({
	packages: ['assetViewer'],
/*
	packages: [{
		name: 'assetViewer',
		location: 'scripts/assetViewer',
		main: 'ui_overlay'
	}],
*/
	paths: {
		'damas': "/js/damas",
		'utils': "utils",
		'ui_log': "ui_log",
		'ui_view': "ui_view",
		'ui_upload': 'generic-ui/scripts/uiComponents/ui_upload',
		'ui_editor': 'generic-ui/scripts/uiComponents/ui_editor',
		'ui_search': 'generic-ui/scripts/uiComponents/ui_search',
		'rsync': 'rsync',
		'servers': 'servers',
		'domReady': '//cdn.rawgit.com/requirejs/domReady/2.0.1/domReady'
	},
	urlArgs: "v=" +  (new Date()).getTime()
});
		//'domReady': '//raw.githubusercontent.com/requirejs/domReady/latest/domReady'

window.processHash = true;

window.addEventListener("hashchange", function() {
	process_hash();
});

window.addEventListener('damasapi:error', function(e){
	alert(e.detail.text);
});

window.addEventListener('resize', function(){
	var cell = document.querySelector('#header');
	var menu = document.querySelector('#layer0Menu');
	menu.style.width = Math.min(cell.clientWidth,1536)+'px'; // force fix idk why
	cell.style.minHeight = menu.clientHeight+'px';
	var panels = document.querySelectorAll('.layerPanel');
	for (var i=0; i<panels.length; i++) {
		if (panels[i].firstChild && panels[i].firstChild.style && window.getComputedStyle(panels[i].firstChild).position === 'fixed') {
			panels[i].firstChild.style.width = panels[i].clientWidth+'px';
		}
	}
});

require(['domReady'], function (domReady) {
	domReady(function () {
		UI_resize_all();
	});
});

UI_resize_all = function() {
		var ev = new Event('resize');
		window.dispatchEvent(ev);
		//var panel = document.querySelector('.layerPanel');
}

process_hash = function() {
	//if(/#graph=/.test(location.hash))
	var keys = getHash();
	if (!window.processHash) {
		return;
	}
	if (/#view=/.test(window.previousHash)) {
		// we where in a viewer
		window.previousHash = location.hash;
		return;
	}
	if (/#view=/.test(location.hash)) {
		// view process is in ui_view.js
		return;
	}
	for (var elem of document.querySelectorAll('#layer0Menu .selected')) {
		elem.classList.remove('selected');
	}
	if (keys.hasOwnProperty('users')) {
		document.querySelector('#but_users').classList.add('selected');
		show_users();
		//window.previousHash = location.hash;
		return;
	}
	if (keys.hasOwnProperty('locks')) {
		document.querySelector('#but_locks').classList.add('selected');
		show_locks();
		//window.previousHash = location.hash;
		return;
	}
	if (/#files/.test(location.hash)) {
		document.querySelector('#but_files').classList.add('selected');
		document.querySelector('#contents').innerHTML = '';
	}
	if (/#servers/.test(location.hash)) {
		document.querySelector('#but_servers').classList.add('selected');
		document.querySelector('#contents').innerHTML = '';
		show_servers();
	}
	if (/#rsync/.test(location.hash)) {
		//document.querySelector('#but_servers').classList.add('selected');
		document.querySelector('#contents').innerHTML = '';
		rsync.draw();
	}
	if (/#log/.test(location.hash) || location.hash === '' ) {
		document.querySelector('#but_log').classList.add('selected');
		show_log();
	}
	window.previousHash = location.hash;
	//window.previousHash.push(location.hash);
};



define(['domReady', "damas", "utils", "rsync", "servers"], function (domReady, damas, rsync, servers) {
	//require(["./conf.json"]);
	require(["ui_log", "ui_view"], function () {
	require(["assetViewer"]);
	require(["ui_upload"]);
	require(["ui_editor"]);
	require(["ui_search"]);
	//var rsync = require(["rsync"]);
	//require(["scripts/assetViewer/ui_overlay"]);
	//require(["assetViewer"]);
	window.damas = damas;
	//loadCss('console.css');
	//loadCss('console_design.css');
	//loadCss('console_mono.css');

	// load conf
	var xobj = new XMLHttpRequest();
	//xobj.overrideMimeType("application/json");
	xobj.open('GET', 'conf.json', false);
	xobj.send(null);
	conf = JSON.parse(xobj.responseText);

	damas_connect('/api/', function (res) {
		if (!res) {
			//window.location='/signIn?back=console';
			window.location='/signIn';
		}
		if (res){
			if (damas.user)
			{
				document.querySelector('.username').innerHTML = damas.user.username;
				document.querySelector('#signOut').style.display = 'inline-block';
				document.querySelector('#signIn').style.display = 'none';
				document.querySelector('#authInfo').style.display = 'inline-block';
			}
			//document.querySelector('#menubar2').style.display = 'block';
			//show_log();
			process_hash();
			//window.previousHash = '';
		}
		else
		{
			document.querySelector('#connection').style.display = 'block';
		}

/*
				var button = document.getElementById('but_locks');
				button.addEventListener('click', function(e){
					show_locks();
				});
				var button = document.getElementById('but_users');
				button.addEventListener('click', function(e){
					show_users();
				});
*/


				/* UI */
				var signOut = document.getElementById('signOut');
				signOut.addEventListener('click', function( e ){
					damas.signOut( function(e){
						localStorage.removeItem("token");
						localStorage.removeItem("user");
						document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
						//window.location='/signIn?back=console'
						document.location.reload();
					});
				});


/*
window.show_users = show_users;
window.show_locks = show_locks;
window.show_log = show_log;
*/

	});

	});
});



		function show_upqueues(){
			damas.search_mongo({_id:'REGEX_/', synced_online:{$exists:false}}, {_id:1},0,0, function(assets){
				alert(assets.count);
				out.innerHTML += assets.count;
			});
		}

		function show_users(){
			//damas.search('username:/.*/', function(res){
			damas.search_mongo({'username':'REGEX_.*'}, {"username":1},0,0, function(res){
				damas.read(res.ids, function(users){
					window.users = users;
					var out = document.querySelector('#contents');
					var table = document.createElement('table');
					var thead = document.createElement('thead');
					var th1 = document.createElement('th');
					var th2 = document.createElement('th');
					var th3 = document.createElement('th');
					var th4 = document.createElement('th');
					var th5 = document.createElement('th');
					table.classList.add('users');
					th1.classList.add('username');
					th2.classList.add('email');
					th3.classList.add('userclass');
					th4.classList.add('lastlogin');
					th4.classList.add('time');
					th1.innerHTML = 'username &utrif;';
					th2.innerHTML = 'email';
					th3.innerHTML = 'class';
					th4.innerHTML = 'last login';
					thead.appendChild(th1);
					thead.appendChild(th2);
					thead.appendChild(th3);
					thead.appendChild(th4);
					thead.appendChild(th5);
					table.appendChild(thead);
					out.innerHTML = '<h1>Users</h1>';
					out.appendChild(table);
					for (var i=0; i<users.length; i++) {
						var tbody = document.createElement('tbody');
						var tr = document.createElement('tr');
						var td1 = document.createElement('td');
						var td2 = document.createElement('td');
						var td3 = document.createElement('td');
						var td4 = document.createElement('td');
						var td5 = document.createElement('td');
						table.appendChild(tbody);
						tbody.appendChild(tr);
						tr.appendChild(td1);
						tr.appendChild(td2);
						tr.appendChild(td3);
						tr.appendChild(td4);
						tr.appendChild(td5);
						td1.classList.add('username');
						td2.classList.add('email');
						td3.classList.add('userclass');
						td4.classList.add('lastlogin');
						td4.classList.add('time');
						tr.setAttribute('title', JSON_tooltip(users[i]));
						var a = document.createElement('a');
						a.innerHTML= users[i].username;
						a.href = '#search={"author":"'+users[i].username+'"}&sort=time';
						td1.appendChild(a);
						td2.innerHTML= users[i].email;
						td3.innerHTML= users[i].class;
						if (users[i].lastlogin){
							td4.innerHTML= html_time(new Date(users[i].lastlogin));
						}
						var inp = document.createElement('input');
						inp.type = 'checkbox';
						inp.style.marginTop = '0';
						inp.style.marginBottom = '0';
						inp.checked = users[i].email_daily_report;
						inp.json = users[i];
						td5.appendChild(inp);
						inp.title = 'email_daily_report';
						inp.addEventListener('click', function(e){
							e.target.json.email_daily_report = e.target.checked;
							damas.update(e.target.json);
						});
						var b = document.createElement('i');
						b.classList.add('fa');
						b.classList.add('fa-pencil');
						b.style.cursor = 'pointer';
						b.style.verticalAlign = 'top';
						td5.appendChild(b);
						(function (node){
							if (require.specified('ui_editor')) {
								b.addEventListener('click', function(){
									initEditor(node);
								});
							}
						}(users[i]));
					}
				});
			});
		}

		function show_locks(){
			//damas.search('lock:/.*/', function(res){
			damas.search_mongo({'lock':'REGEX_.*'}, {"lock":1},0,0, function(res){
				damas.read(res.ids, function(assets){
					var out = document.querySelector('#contents');
					var table = document.createElement('table');
					var thead = document.createElement('thead');
					var tbody = document.createElement('tbody');
					var th1 = document.createElement('th');
					var th2 = document.createElement('th');
					table.classList.add('locks');
					th1.classList.add('lock');
					th2.classList.add('file');
					th1.innerHTML = 'lock &xdtri;';
					th2.innerHTML = 'file';
					thead.appendChild(th1);
					thead.appendChild(th2);
					table.appendChild(thead);
					table.appendChild(tbody);
					out.innerHTML = '';
					out.appendChild(table);
					for (var i=0; i<assets.length; i++) {
						var file = assets[i].file || assets[i]['#parent'];
						var a = '<a href="#view=/api/file'+file+'"><span class="nomobile">'+file.split('/').slice(0,-1).join('/')+'/</span>'+file.split('/').pop()+'</a>';
						var tr = document.createElement('tr');
						var td1 = document.createElement('td');
						var td2 = document.createElement('td');
						td1.classList.add('lock');
						td2.classList.add('file');
						tr.setAttribute('title', JSON_tooltip(assets[i]));
						td1.innerHTML= assets[i].lock;
						td2.innerHTML= a;
						tr.appendChild(td1);
						tr.appendChild(td2);
						tbody.appendChild(tr);
						(function (node){
							if (require.specified('ui_editor')) {
								tr.addEventListener('click', function(){
									initEditor(node);
								});
							}
						}(assets[i]));
					}
				});
			});
		}


