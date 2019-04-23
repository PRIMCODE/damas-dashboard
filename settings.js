settings = {};

settings.draw = function(){
	var out = document.querySelector('#contents');
	var h = document.createElement('h1');
	h.innerHTML = 'Settings';
	out.appendChild(h);

	damas.read("rsyncGlobalParameters", function(conf){
		if (null === conf) {
			div.innerHTML = "rsync_config not found"
		}
		var h = document.createElement('h2');
		h.innerHTML = 'Tracker';
		out.appendChild(h);
		if (require.specified('ui_editor')) {
			h.addEventListener('click', function(){
				initEditor(conf);
			});
		}
		var div = document.createElement('ul');
		out.appendChild(div);
		let li;
		//div.appendChild(settings.show_line(conf, 'active', 'boolean', false));
		//div.appendChild(settings.show_line(conf, 'rsync_limit_asset_ul', 'number', false));
		//div.appendChild(settings.show_line(conf, 'rsync_limit_asset_dl', 'number', false));
		//div.appendChild(settings.show_line(conf, 'rsync_excl', 'text', ''));
		//div.appendChild(settings.show_line(conf, 'rsync_up', 'text', ''));
		//div.appendChild(settings.show_line(conf, 'rsync_scan', 'text', ''));
		//div.appendChild(settings.show_line(conf, 'rsync_dl', 'text', ''));
		//div.appendChild(settings.show_line(conf, 'rsync_daemon_options', 'text', ''));
		//div.appendChild(settings.show_line(conf, 'rsync_delete', 'text', ''));
		div.appendChild(li = settings.show_line(conf, 'rsaPublicKey', 'text_multiline', '________'));
		var ta = li.querySelector('textarea');
		ta.style.width = '100%';
		ta.style.height = 'auto';
		ta.style.height = (ta.scrollHeight+4)+'px';
		div.appendChild(settings.show_line(conf, 'emailReports', 'boolean', false));

		var h2 = document.createElement('h2');
		h2.innerHTML= 'File discovery';
		out.appendChild(h2);
		var div_agents = document.createElement('div');
		out.appendChild(div_agents);
		var div = document.createElement('ul');
		out.appendChild(div);

		//div.appendChild(settings.show_line(conf, 'enableScans', 'boolean', false));
		//damas.read( damas.search_mongo({_id:"REGEX_^sit\/"}).ids, function(servers){
		damas.search_mongo({_id:"REGEX_^sit\/"},{},0,0, function(serverIds){
			damas.read(serverIds.ids, function(servers){
				for (var i=0; i<servers.length; i++) {
					//settings.show_server(servers[i], out);
					div.appendChild(settings.show_key(servers[i], 'asset_scan', 'boolean', false, servers[i].name));
				}
			});
		});
		div.appendChild(li = settings.show_line(conf, 'includePatternRules', 'text_multiline', '________'));
		var ta = li.querySelector('textarea');
		ta.style.width = '100%';
		ta.style.height = 'auto';
		ta.style.height = (ta.scrollHeight+4)+'px';
		div.appendChild(li = settings.show_line(conf, 'excludePatternRules', 'text_multiline', '________'));
		var ta = li.querySelector('textarea');
		ta.style.width = '100%';
		ta.style.height = 'auto';
		ta.style.height = (ta.scrollHeight+4)+'px';
		//div.appendChild(settings.show_line(conf, 'scanArguments', 'text', '___'));
		div.appendChild(settings.show_line(conf, 'ignoreExistingFiles', 'boolean', false));
		div.appendChild(settings.show_line(conf, 'sleepBetweenScans', 'number', false));


		settings.show_rsync_servers();
	});

/*
	var h = document.createElement('h2');
	h.innerHTML = 'Add Server';
	out.appendChild(h);
	var f = document.createElement('form');
	f.addEventListener('submit', function(e){
		var node = {};
		node._id = "sit/" + this.elements.name.value;
		node.name = this.elements.name.value;
		node.email = this.elements.email.value;
		node.rsync_url = this.elements.url.value;
		if (this.elements.port.value){
			node.rsync_args = "-e 'ssh -p " + this.elements.port.value + "'";
		}
		if (this.elements.password.value){
			node.rsync_env = 'export RSYNC_PASSWORD="' + this.elements.password.value + '"';
		}
		e.preventDefault();
		damas.create(node, function(res){
			alert(JSON.stringify(res));
		});
		return false;
	});
	var i1 = document.createElement('input');
	var i2 = document.createElement('input');
	var i3 = document.createElement('input');
	var i4 = document.createElement('input');
	var i5 = document.createElement('input');
	i1.name = 'name';
	i1.placeholder = 'site name';
	i1.required = true;
	i2.name = 'email';
	i2.placeholder = 'email';
	i2.type = 'email';
	i2.required = true;
	i3.name = 'url';
	i3.placeholder = 'url';
	i3.required = true;
	i4.name = 'password';
	i4.placeholder = 'password';
	i5.name = 'port';
	i5.placeholder = 'port';

	var button = document.createElement('input');
	button.type = 'submit';
	f.appendChild(i1);
	f.appendChild(document.createElement('br'));
	f.appendChild(i2);
	f.appendChild(document.createElement('br'));
	f.appendChild(i3);
	f.appendChild(document.createElement('br'));
	f.appendChild(i4);
	f.appendChild(document.createElement('br'));
	f.appendChild(i5);
	f.appendChild(document.createElement('br'));
	f.appendChild(button);
	out.appendChild(f);
*/
}

//
// main
//
settings.show_rsync_servers = function(){
	var out = document.querySelector('#contents');
	var h = document.createElement('h2');
	h.innerHTML = 'Agents';
	out.appendChild(h);
	damas.read( damas.search_mongo({_id:"REGEX_^sit\/"}).ids, function(servers){
		for (var i=0; i<servers.length; i++) {
			settings.show_server(servers[i], out);
		}
	});
}

//
// editable server
//
settings.show_server = function(server, out) {
	var h4 = document.createElement('h3');
	h4.innerHTML = server.name;
	out.appendChild(h4);
	var div = document.createElement('ul');
	out.appendChild(div);
	if (require.specified('ui_editor')) {
		h4.addEventListener('click', function(){
			initEditor(server);
		});
	}
	//div.appendChild(settings.show_line(server, 'name', 'text', ''));
	//div.appendChild(settings.show_line(server, 'active', 'boolean', false));
	//div.appendChild(settings.show_line(server, 'email', 'text', false));
	div.appendChild(settings.show_line(server, 'emission', 'boolean', false));
	div.appendChild(settings.show_line(server, 'reception', 'boolean', false));
	//div.appendChild(settings.show_line(server, 'asset_scan', 'boolean', false));
	//div.appendChild(settings.show_line(server, 'asset_delete', 'boolean', false));
	div.appendChild(settings.show_line(server, 'url', 'text', ''));
	div.appendChild(settings.show_line(server, 'rsync_args', 'text', '_'));
	div.appendChild(settings.show_line(server, 'rsync_env', 'text', '_'));
	return div;
}

settings.show_value = function(server, keyname, defaultType, defaultValue)
{
	var input;
	if (defaultType === "boolean" ) {
		input = document.createElement('input');
		input.type = 'checkbox';
		input.checked = server[keyname];
		input.addEventListener('change',function(e){
			let server2 = {};
			server2._id = server._id;
			server2[keyname] = e.target.checked;
			damas.update(server2, function(res){
				if (res === null){
					input.checked = !input.checked;
				}
			});
		});
	}
	return input;
}

settings.show_key = function(server, keyname, defaultType, defaultValue, title)
{
	var w = document.createElement('span');
	var value = settings.show_value(server, keyname, defaultType, defaultValue);
	var span = document.createElement('span');
	span.innerHTML = title || keyname;
	w.appendChild(value);
	w.appendChild(span);
	return w;
}

//
// editable key line
//
settings.show_line = function(server, keyname, defaultType, defaultValue, title)
{
	var li = document.createElement('li');
	if (defaultType === "boolean" ) {
		var input = document.createElement('input');
		input.type = 'checkbox';
		input.checked = server[keyname];
		li.appendChild(input);
		var span = document.createElement('span');
		span.innerHTML = title || keyname;
		li.appendChild(span);
		input.addEventListener('change',function(e){
			var server2 = {};
			server2._id = server._id;
			server2[keyname] = e.target.checked;
			damas.update(server2, function(res){
				if (res === null){
					input.checked = !input.checked;
				}
			});
		});
	}
	if (defaultType === "text" ) {
		li.innerHTML = keyname + ": ";
		var span = document.createElement('span');
		span.innerHTML = server[keyname] || defaultValue;
		li.appendChild(span);
		span.addEventListener('click',function(e){
			var input = document.createElement('input');
			input.value = this.innerHTML;
			input.style.width = this.offsetWidth+'px';
			this.parentNode.insertBefore(input, this);
			input.focus();
			input.select();
			this.style.display = 'none';
			input.addEventListener('blur',function(e){
				this.nextSibling.style.display = 'inline';
				this.parentNode.removeChild(this);
			});
			input.addEventListener('change',function(e){
				var server2 = {};
				server2._id = server._id;
				server2[keyname] = this.value;
				damas.update(server2, function(res){
					if (res != null){
						e.target.nextSibling.innerHTML = e.target.value;
						e.target.blur();
					}
				});

			});
		});
	}
	if (defaultType === "number" ) {
		li.innerHTML = keyname + ": ";
		var span = document.createElement('span');
		span.innerHTML = server[keyname];
		li.appendChild(span);
		span.addEventListener('click',function(e){
			var input = document.createElement('input');
			input.value = this.innerHTML;
			input.style.width = this.offsetWidth+'px';
			this.parentNode.insertBefore(input, this);
			input.focus();
			this.style.display = 'none';
			input.addEventListener('blur',function(e){
				this.nextSibling.style.display = 'inline';
				this.parentNode.removeChild(this);
			});
			input.addEventListener('change',function(e){
				var server2 = {};
				server2._id = server._id;
				server2[keyname] = parseInt(this.value);
				damas.update(server2, function(res){
					if (res != null){
						e.target.nextSibling.innerHTML = e.target.value;
						e.target.blur();
					}
				});

			});
		});
	}
	if (defaultType === "text_multiline" ) {
		li.innerHTML = keyname + ": ";
		var ta = document.createElement('textarea');
		ta.innerHTML = server[keyname];
		li.appendChild(ta);
		ta.addEventListener('change',function(e){
			var server2 = {};
			server2._id = server._id;
			server2[keyname] = this.value;
			damas.update(server2, function(res){
				if (res != null){
				}
			});

		});

	}
	return li;
}


