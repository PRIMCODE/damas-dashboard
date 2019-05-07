	function show_servers(){


		function html_cell(switche, title){
			var c = document.createElement('span');
			c.innerHTML = '&nbsp;';
			c.setAttribute('title', title);
			c.style.cursor = 'default';
			if (switche) {
				c.classList.add('synced');
			}
			else {
				c.classList.add('cellError');
			}
			return c;

		}


			var out = document.querySelector('#contents');
			damas.search('_id:/^sit\/.*/', function( serversids ){
				//damas.read(conf.servers, function(servers){
				damas.read(serversids, function(servers){
				var table = document.createElement('table');
				var thead = document.createElement('thead');
				var th1 = document.createElement('th');
				var th2 = document.createElement('th');
				var th3 = document.createElement('th');
				var th4 = document.createElement('th');
				var th5 = document.createElement('th');
				table.appendChild(thead);
				thead.appendChild(th1);
				thead.appendChild(th2);
				thead.appendChild(th3);
				thead.appendChild(th4);
				thead.appendChild(th5);
				table.classList.add('servers');
				table.classList.add('users');
				th1.classList.add('servername');
				th1.innerHTML = 'server';
				th2.innerHTML = 'processes';
				th3.innerHTML = 'status';
				th4.innerHTML = 'files';
				th5.innerHTML = 'type';
				//th2.setAttribute('colspan','2');
				//th3.setAttribute('colspan','2');
				//th4.setAttribute('colspan','2');
				//th5.innerHTML = 'duration';
				out.innerHTML = '<h1>Servers</h1>';
				out.appendChild(table);
					for (var i=0; i<servers.length; i++) {
						var tbody = document.createElement('tbody');
						var tr1 = document.createElement('tr');
						var tr2 = document.createElement('tr');
						var tr3 = document.createElement('tr');
						var tr4 = document.createElement('tr');

						var tr1td1 = document.createElement('td');
						tr1td1.setAttribute('rowspan','4');
						var tr1td2 = document.createElement('td');
						var tr1td3 = document.createElement('td');
						var tr1td4 = document.createElement('td');
						var tr1td5 = document.createElement('td');

						var tr2td2 = document.createElement('td');
						var tr2td3 = document.createElement('td');
						var tr2td4 = document.createElement('td');
						var tr2td5 = document.createElement('td');

						var tr3td2 = document.createElement('td');
						var tr3td3 = document.createElement('td');

						var tr4td1 = document.createElement('td');

						table.appendChild(tbody);
						tbody.appendChild(tr1);
						tbody.appendChild(tr2);
						tbody.appendChild(tr3);
						tbody.appendChild(tr4);

						tr1.appendChild(tr1td1);
						tr1.appendChild(tr1td2);
						tr1.appendChild(tr1td3);
						tr1.appendChild(tr1td4);
						tr1.appendChild(tr1td5);

						tr2.appendChild(tr2td2);
						tr2.appendChild(tr2td3);
						tr2.appendChild(tr2td4);

						tr3.appendChild(tr3td2);
						tr3.appendChild(tr3td3);

						tr4.appendChild(tr4td1);

						tr4td1.setAttribute('colspan','5');

						// LINE 1
						tr1td1.style.paddingRight="1ex";
						tr1td1.classList.add('username');
						tr1td1.style.whiteSpace="nowrap";
						//tr.setAttribute('title', JSON_tooltip(servers[i]));
						//if (servers[i].rsync_exit == 0 || servers[i].rsync_exit === undefined) {
						//if (servers[i].exit_emission == 0 && servers[i].exit_reception == 0) {
						tr1td5.innerHTML = (servers[i].caseinsensitive === true)? 'Windows':'';
						/*
						if (!servers[i].exit_emission & !servers[i].exit_reception & !servers[i].exit_scan) {
							td1.innerHTML = '<span class="synced">&nbsp;</span> ';
						}
						else {
							td1.innerHTML = '<span class="cellError">&nbsp;</span> ';
						}
						*/

						var do_chk = function ( value, active, cb ) {
							var c = document.createElement('input');
							//var l = document.createElement('label');
							//l.innerHTML='off';
							c.type = 'checkbox';
							//c.setAttribute('type','checkbox');
							//alert(value);
							c.checked = value;
							if (value === true) {
								c.setAttribute('checked','checked');
								//l.innerHTML='on';
							}
							if (active === false) {
								c.disabled = true;
								//c.setAttribute('disabled','disabled');
							}
							c.addEventListener('change', function(e){alert('rty')});
							return c;
						}

						tr1td1.innerHTML += servers[i].name;

						tr1td2.appendChild(do_chk(servers[i].asset_emission, servers[i].active, function(e){
							alert('qwe');
							damas.update( { '_id':servers[i]._id, 'asset_emmision': e.target.checked }, function(n){
								if (null===n){
									e.target.checked = !e.target.checked;
								}
							});
							
						
						}));
						tr1td2.innerHTML += ' emitter';

						if (undefined !== servers[i].last_emission) {
							tr1td3.appendChild(html_cell(!servers[i].exit_emission, human_time(new Date(servers[i].last_emission))));
							tr1td3.innerHTML += " ";
							var a = document.createElement('a');
							a.setAttribute('title','emitted files');
							a.href = '#search={"origin":"'+servers[i].name+'","synced_online":{"$exists":true}}&sort=synced_online&order=-1';
							a.innerHTML = html_time(new Date(servers[i].last_emission));
							tr1td3.appendChild(a);
						}

						var a = document.createElement('a');
						a.href = '#search={"origin":"'+servers[i].name+'","synced_online":{"$exists":false},"_id":"REGEX_/"}&sort=time';
						a.innerHTML = 'emission';
						tr1td4.appendChild(a);

						tr2td2.appendChild(do_chk(servers[i].asset_reception, servers[i].active, function(){}));
						tr2td2.innerHTML += ' receiver';

						var a = document.createElement('a');
						a.href = '#search={"synced_'+servers[i].name+'":{"$exists":false},"origin":{"$ne":"'+servers[i].name+'"},"deleted":{"$ne":true},"sync_disabled":{"$ne":true},"_id":"REGEX_^/" }';
						a.innerHTML = 'reception';
						tr2td4.appendChild(a);

						tr3td2.appendChild(do_chk(servers[i].asset_scan, servers[i].active, function(){}));
						tr3td2.innerHTML += ' scan';

						tr2td3.appendChild(html_cell(!servers[i].exit_reception, human_time(new Date(servers[i].last_reception))));
						tr2td3.innerHTML += " ";
						var a = document.createElement('a');
						a.setAttribute('title','received files');
						a.href = '#search={"synced_'+servers[i].name+'":{"$exists":true}}&sort=synced_'+servers[i].name;
						a.innerHTML = html_time(new Date(servers[i].last_reception));
						tr2td3.appendChild(a);

						if (servers[i] === null) {
							continue;
						}

						if (undefined !== servers[i].exit_scan) {
							tr3td3.appendChild(html_cell(!servers[i].exit_scan, human_time(new Date(servers[i].last_scan))));
							tr3td3.innerHTML += " ";
							var str = '<span style="white-space: nowrap">';
							if (servers[i].last_scan){
								str += html_time(new Date(servers[i].last_scan));
								//str += ' ('+servers[i].exit_scan+')';
							}
							else {
								//td4.innerHTML = '_';
							}
							if (servers[i].scan_duration){
								str += ' (';
								var minutes = Math.floor(servers[i].scan_duration/1000/60);
								if (0<minutes){
									str += minutes+'\'';
								}
								str += servers[i].scan_duration/1000 % 60+'\")';
							}
							str += '</span><br/>';
							tr3td3.innerHTML += str;
							//else {
								//td4.innerHTML = '_';
							//}
						}

						(function (node){
							if (require.specified('ui_editor')) {
								tr1td1.addEventListener('click', function(){
									initEditor(node);
								});
							}
						}(servers[i]));


						if (servers[i].active !== false){
							var errordiv = document.createElement('div');
							errordiv.classList.add('errortext');
							tr4td1.appendChild(errordiv);
							if (servers[i].stderr_emission){
								errordiv.innerHTML += '<em>emission:</em>'+servers[i].stderr_emission+'<br/>';
							}
							if (servers[i].stderr_reception){
								errordiv.innerHTML += '<em>reception:</em><br/>'+servers[i].stderr_reception+'<br/>';
							}
								if (servers[i].stderr_scan){
								errordiv.innerHTML += '<br/><em>scan:</em><br/>'+servers[i].stderr_scan+'<br/>';
							}
							tr4td1.innerHTML += '</div><br/>';
						}
					}
			})});

			/*
			if (conf.syncKeys) {
				for (let sync of conf.syncKeys) {
					var str_title = sync.replace('synced_','')+'\n';
					var h3 = document.createElement('h3');
					h3.innerHTML = str_title;
					out.appendChild(h3);
				}
			}
			*/
		}




	function prompt_publish (){
			var file = prompt('Publish file\n- publish a file using its exact path in the project\n- publish one directory and its content using a trailing slash \n(eg: /wf/sc/sc0027/sc0027-sh0020/ren/wf_sc0027-sh0020_ren_12/Stb/ )  ', '/wf/sc/');
			if (null !== file) {
				var origin = prompt('Origin', 'onyx');
				if (null !== origin) {
					var comment = prompt('Message', 'published from web');
					if (null !== comment) {
						damas.create({
							'_id': file,
							origin: origin,
							online: '1',
							comment: comment
						}, function(n1){
							/*
							damas.create({
								'#parent': file,
								origin: origin,
								comment: comment
							}, function(n1){
								});
							*/
							alert('publish done!');
						});
					}
				}
			}
		}
