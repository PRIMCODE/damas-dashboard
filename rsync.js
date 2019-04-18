rsync = {};

rsync.draw = function(){
	var out = document.querySelector('#contents');
	var h = document.createElement('h1');
	h.innerHTML = 'Rsync';
	out.appendChild(h);
	var h = document.createElement('h2');
	h.innerHTML = 'Configuration';
	out.appendChild(h);

	var div = document.createElement('ul');
	out.appendChild(div);

	damas.read("rsync_config", function(conf){
		if (null === conf) {
			div.innerHTML = "rsync_config not found"
		}
		if (require.specified('ui_editor')) {
			h.addEventListener('click', function(){
				initEditor(conf);
			});
		}
		div.appendChild(rsync.show_line(conf, 'active', 'boolean', false));
		div.appendChild(rsync.show_line(conf, 'email_reports', 'boolean', false));
		div.appendChild(rsync.show_line(conf, 'rsync_limit_asset_ul', 'number', false));
		div.appendChild(rsync.show_line(conf, 'rsync_limit_asset_dl', 'number', false));
		div.appendChild(rsync.show_line(conf, 'rsync_excl', 'text', ''));
		div.appendChild(rsync.show_line(conf, 'rsync_up', 'text', ''));
		div.appendChild(rsync.show_line(conf, 'rsync_scan', 'text', ''));
		div.appendChild(rsync.show_line(conf, 'rsync_dl', 'text', ''));
		div.appendChild(rsync.show_line(conf, 'rsync_daemon_options', 'text', ''));
		div.appendChild(rsync.show_line(conf, 'rsync_delete', 'text', ''));
		div.appendChild(rsync.show_line(conf, 'ssh_public_key', 'text_multiline', '________'));
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
	rsync.show_rsync_servers();
}

//
// main
//
rsync.show_rsync_servers = function(){
	var out = document.querySelector('#contents');
	var h = document.createElement('h2');
	h.innerHTML = 'Servers';
	out.appendChild(h);
	damas.read( damas.search_mongo({_id:"REGEX_^sit\/"}).ids, function(servers){
		for (var i=0; i<servers.length; i++) {
			rsync.show_server(servers[i], out);
		}
	});
}

//
// editable server
//
rsync.show_server = function(server, out) {
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
	div.appendChild(rsync.show_line(server, 'name', 'text', ''));
	div.appendChild(rsync.show_line(server, 'active', 'boolean', false));
	div.appendChild(rsync.show_line(server, 'email', 'text', false));
	div.appendChild(rsync.show_line(server, 'asset_emission', 'boolean', false));
	div.appendChild(rsync.show_line(server, 'asset_reception', 'boolean', false));
	div.appendChild(rsync.show_line(server, 'asset_scan', 'boolean', false));
	div.appendChild(rsync.show_line(server, 'asset_delete', 'boolean', false));
	div.appendChild(rsync.show_line(server, 'url', 'text', ''));
	div.appendChild(rsync.show_line(server, 'rsync_args', 'text', ''));
	div.appendChild(rsync.show_line(server, 'rsync_env', 'text', '________'));
	return div;
}

//
// editable key line
//
rsync.show_line = function(server, keyname, defaultType, defaultValue)
{
	var li = document.createElement('li');
	if (defaultType === "boolean" ) {
		var input = document.createElement('input');
		input.type = 'checkbox';
		input.checked = server[keyname];
		li.appendChild(input);
		var span = document.createElement('span');
		span.innerHTML = keyname;
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


