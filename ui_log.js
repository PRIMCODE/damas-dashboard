require(['domReady'], function (domReady) {
	domReady(function () {
		//loadBtUpload();
	});
});

var ui_log = {
};
nbElements = 100;
offsetElements = 0;
var retrieved_nodes = [];
var scrollElem = document.getElementById('panelPrincipal');
var tableelem;

function show_log(){
	offsetElements = 0;
	var container = document.querySelector('#contents');
	container.innerHTML = '';
	tableelem = table();
	container.appendChild(tableelem);
	show_next();
}

scrollElem.addEventListener('scroll', function(){
	if (/#log/.test(location.hash) || location.hash==='') {
		if (this.scrollHeight - this.scrollTop === this.clientHeight) {
			show_next();
		}
	}
});

function show_next(){
	damas.search_mongo({'time': {$exists:true}, '#parent':{$exists:true}}, {"time":-1},nbElements,offsetElements, function(res){
		damas.read(res.ids, function(nodes){
			retrieved_nodes = retrieved_nodes.concat(nodes);
			tablebody(tableelem, nodes);
			offsetElements += nbElements;
		});
	});
}

function expand_events( id, current_event_id, out ){
	damas.search_mongo({'#parent': id }, {"time":1},100, 0, function(res){
		damas.read(res.ids, function(children){
			for(var i=0; i< children.length; i++){
				var n =  children[i];
				var tr = tablerow(n, true);
				tr.classList.add('history');
				if (n._id === current_event_id) {
					out.style.display= 'none';
					tr.classList.add('clicked');
				}
				td_time = tr.querySelector('td.time');
				td_time.addEventListener('click', function(e){
					out.style.display= 'table-row';
					var trnext = out.nextElementSibling;
					while(trnext) {
						if(trnext.classList.contains('last')) {
							trnext.remove();
							break;
						}
						trnext.remove();
						trnext = out.nextElementSibling;
					}
				});
				if (i === 0) {
					tr.classList.add('last');
				}
				if (i === children.length - 1) {
					tr.classList.add('first');
				}
				out.parentNode.insertBefore(tr, out.nextSibling);
			}
		});
	});
}

function table() {
	var table = document.createElement('table');
	var thead = document.createElement('thead');
	var th1 = document.createElement('th');
	var th2 = document.createElement('th');
	var th3 = document.createElement('th');
	var th4 = document.createElement('th');
	table.classList.add('log');
	th1.classList.add('time');
	th2.classList.add('file');
	th3.classList.add('size');
	th4.classList.add('comment');
	th1.innerHTML = 'time &xutri;';
	th2.innerHTML = 'file';
	th3.innerHTML = 'size';
	th4.innerHTML = 'comment';
	table.appendChild(thead);
	thead.appendChild(th1);
	thead.appendChild(th2);
	thead.appendChild(th3);
	thead.appendChild(th4);
	return table;
}

function tablebody(container, nodes) {
	var tbody = null;
	for (var i=0; i<nodes.length; i++) {
		if (i === 0){
			tbody = document.createElement('tbody');
			tbody.appendChild(tablerow(nodes[i]));
			container.appendChild(tbody);
			continue;
		}
		if (nodes[i].comment === nodes[i-1].comment) {
			var trow = tablerow(nodes[i]);
			trow.querySelector('td.comment').style.visibility = 'hidden';
			tbody.appendChild(trow);
		}
		else {
			tbody = document.createElement('tbody');
			tbody.appendChild(tablerow(nodes[i]));
	  		container.appendChild(tbody);
		}
	}
}

/*
 * @param noclickontimebool is an optional boolean
 */
function tablerow(node, noclickontimebool) {
	var tr = document.createElement('tr');
	var td1 = document.createElement('td');
	var td3 = document.createElement('td');
	var td4 = document.createElement('td');
	var td2 = document.createElement('td');
	var td5 = document.createElement('td');
	td1.classList.add('time');
	td2.classList.add('file');
	td3.classList.add('size');
	td4.classList.add('comment');
	td5.classList.add('buttons');
	var time = new Date(parseInt(node.time));
	td1.style.width = '18ex';
	td1.innerHTML= human_time(new Date(parseInt(node.time)));
	var file = node.file || node['#parent'] || node._id;
	if (file) {
		// here we want to know if we are in the zombillenium case or in the white fang case
		if ( (node['#parent'] && !node.file) || ( node.synced_online && node.synced_online > node.time )) {
			td2.appendChild(human_filename_href(file));
		}
		else {
			td2.innerHTML = human_filename_txt(file);
		}
	}
	td3.innerHTML = human_size( node.file_size || node.bytes || node.size || node.source_size);
	td4.innerHTML = '&lt;'+node.author+'&gt; '+node.comment;
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	tr.appendChild(td4);
	tr.appendChild(td5);
	var td5span0 = document.createElement('span');
	var td5span1 = document.createElement('span');
	td5span1.classList.add('delete');
	td5span1.innerHTML = 'x';
	td5.appendChild(td5span1);
	td5span1.addEventListener('click', function(e){
		e.stopPropagation();
		if (confirm('Delete '+node._id+' ?')) {
			damas.delete(node._id);
		}
	});
	if (noclickontimebool!==true) {
		td1.addEventListener('click', function(e){
			//if (node['#parent']) {
				//expand_events(node['#parent'], e.target.parentNode.querySelector('.children'));
				expand_events(node['#parent'], node._id, e.target.parentNode);
			//}
			//else {
				//expand_events(node._id, e.target.parentNode.querySelector('.children'));
				//expand_events(node._id, e.target.parentNode);
			//}
		});
	}
	if (require.specified('ui_editor')) {
		tr.addEventListener('click', function(){
			initEditor(node);
		});
	}
	tr.setAttribute('title', JSON_tooltip(node));
	td1.setAttribute('title', time);
	td3.setAttribute('title', node.file_size || node.bytes || node.size || node.source_size);
	td5span0.setAttribute('title', 'edit');
	td5span1.setAttribute('title', 'delete');
	return tr;
}

/*
(function (root, factory) {
	if (typeof define === 'function' && define.amd) { // AMD
		define(['../socket.io/socket.io'], factory);
	} else if (typeof module === 'object' && module.exports) { // Node
		module.exports = factory(require('socket.io-client'));
	} else { // Browser globals
		root.returnExports = factory(root.io);
	}
}(this, function (io) {
	if (typeof window !== 'undefined') {
		var address = location.protocol + '//' + location.host;
		var socket = io.connect(address, { path: '/socket.io' });

		window.addEventListener('beforeunload', function (event) {
			socket.close();
		});
	} else {
		// Suppose a local Socket.io server over TLS
		var address = 'wss://0.0.0.0:8443';
		var socket = io.connect(address, {
			path: '/socket.io',
			rejectUnauthorized: false
		});
	}

	socket.on('connect', function () {
		console.log('Connected to the Socket server ' + address);
	});

	socket.on('disconnect', function (reason) {
		console.log('Disconnected: ' + reason);
	});

	socket.on('create', function (nodes) {
		console.log(nodes.length + ' nodes created');
		console.log(nodes);
		var tbody = document.querySelector('tbody');
		nodes.forEach(function(node){
			if (node.time === undefined || node['#parent'] !== undefined ) {
				return;
			}
			var tr = tablerow(node);
			tr.style.opacity = '0';
			tbody.insertBefore(tr, tbody.firstChild);
			setTimeout(function() {
				tr.style.opacity = '1';
			}, 1);
		});
	});

	socket.on('update', function (nodes) {
		console.log(nodes.length + ' nodes updated');
		console.log(nodes);
	});

	socket.on('remove', function (nodes) {
		console.log(nodes.length + ' nodes removed');
		console.log(nodes);
	});

	return socket;
}));
*/
